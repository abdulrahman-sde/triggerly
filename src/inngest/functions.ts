import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { topologicalSort, toErrorMessage, updateExecutionLogs } from "./utils";
import prisma from "@/lib/prisma";
import { getExecutor } from "@/features/nodes/lib/node-registry";
import { nodeStatusChannel } from "./channels/node-status";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    triggers: { event: "workflows/execute.workflow" },
    retries: 1,
    onFailure: async ({ event, error }) => {
      const { executionId } = event.data.event.data;

      if (!executionId) return;

      await prisma.execution.update({
        where: { id: executionId },
        data: {
          status: "FAILED",
          finishedAt: new Date(),
          error: toErrorMessage(error),
        },
      });
    },
  },

  async ({ event, step }) => {
    const workflowId = event.data.workflowId;
    const executionId = event.data.executionId;
    const runId = event.data.runId;

    if (!workflowId) {
      throw new NonRetriableError("Workflow ID is required");
    }
    if (!executionId) {
      throw new NonRetriableError("Execution ID is required");
    }
    if (!runId) {
      throw new NonRetriableError("Run ID is required");
    }

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findFirst({
        where: { id: workflowId },
        include: {
          nodes: true,
          connections: true,
        },
      });

      if (!workflow) {
        throw new NonRetriableError("Workflow not found");
      }

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    const ch = nodeStatusChannel({ runId });

    let context = event.data.initialData || {};

    for (const node of sortedNodes) {
      try {
        const executor = getExecutor(node.type);
        context = await executor({
          data: node.data as Record<string, unknown>,
          nodeId: node.id,
          context,
          step,
          channel: ch,
        });

        await updateExecutionLogs({
          executionId,
          nodeId: node.id,
          log: {
            success: true,
            message: `${node.type} node executed successfully`,
            timestamp: new Date(),
          },
          step,
        });
      } catch (error) {
        await inngest.realtime.publish(ch.status, {
          status: "error",
          nodeId: node.id,
          error: toErrorMessage(error),
        });

        await updateExecutionLogs({
          executionId,
          nodeId: node.id,
          log: {
            success: false,
            message: `${node.type} node execution failed`,
            error: toErrorMessage(error),
            timestamp: new Date(),
          },
          step,
        });

        throw new NonRetriableError(toErrorMessage(error));
      }
    }

    await step.run("finalize-workflow", async () => {
      await prisma.execution.update({
        where: { id: executionId },
        data: {
          status: "SUCCESS",
          finishedAt: new Date(),
        },
      });
    });

    return { workflowId, result: context };
  },
);

import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { topologicalSort } from "./utils";
import prisma from "@/lib/prisma";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { nodeStatusChannel } from "./channels/node-status";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    triggers: { event: "workflows/execute.workflow" },
    retries: 1,
  },
  async ({ event, step }) => {
    const workflowId = event.data.workflowId;

    if (!workflowId) {
      throw new NonRetriableError("Workflow not found");
    }

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId,
        },
        include: {
          nodes: true,
          connections: true,
        },
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    let ch = nodeStatusChannel({ runId: event.data.runId });

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
      } catch (error) {
        await inngest.realtime.publish(ch.status, {
          status: "error",
          nodeId: node.id,
          error: (error as Error).message,
        });
        throw error;
      }
    }

    return { workflowId, result: context };
  },
);

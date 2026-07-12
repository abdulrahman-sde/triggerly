import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { topologicalSort } from "./utils";
import prisma from "@/lib/prisma";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    triggers: { event: "workflows/execute.workflow" },
  },
  async ({ event, step }) => {
    const workflowId = event.data.workflowId;

    if (!workflowId) {
      throw new NonRetriableError("Workflow not found");
    }

    const ch = httpRequestChannel({ runId: event.data.runId });

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

    let context = event.data.context || {};

    for (const node of sortedNodes) {
      const executor = getExecutor(node.type);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
        // publish: publish,
        channel: ch,
      });
    }

    return { workflowId, result: context };
  },
);

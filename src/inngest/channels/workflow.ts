// src/inngest/channels/workflow.ts
import { realtime } from "inngest";
import z from "zod";

export const workflowChannel = realtime.channel({
  name: ({ workflowId }: { workflowId: string }) => `workflow-${workflowId}`,
  topics: {
    executionStarted: {
      schema: z.object({ runId: z.string() }),
    },
  },
});

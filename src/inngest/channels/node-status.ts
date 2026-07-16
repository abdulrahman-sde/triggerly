import { error } from "console";
import { realtime } from "inngest";
import z from "zod";

export const nodeStatusChannel = realtime.channel({
  name: ({ runId }: { runId: string }) => `node-status-${runId}`,
  topics: {
    status: {
      schema: z.object({
        status: z.enum(["loading", "success", "error"]),
        nodeId: z.string(),
        error: z.string().optional(),
      }),
    },
  },
});

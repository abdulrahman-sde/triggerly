import { realtime } from "inngest";
import z from "zod";

export const httpRequestChannel = realtime.channel({
  name: ({ runId }: { runId: string }) => `http-request-${runId}`,
  topics: {
    status: {
      schema: z.object({
        type: z.enum(["loading", "success", "error"]),
        nodeId: z.string(),
      }),
    },
  },
});

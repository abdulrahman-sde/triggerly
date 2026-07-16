import type { NodeExecutor } from "@/features/executions/types";

import { inngest } from "@/inngest/client";

export const googleFormTriggerExecutor: NodeExecutor = async ({
  context,
  step,
  channel,
  nodeId,
}) => {
  await inngest.realtime.publish(channel.status, {
    status: "loading",
    nodeId: nodeId,
  });

  const result = await step.run("google-form-trigger", async () => context);

  await inngest.realtime.publish(channel.status, {
    status: "success",
    nodeId: nodeId,
  });

  return result;
};

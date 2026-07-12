import type { NodeExecutor } from "@/features/executions/types";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  context,
  step,
}) => {
  const result = await step.run("manual-trigger", async () => {
    // Perform any necessary operations for the manual trigger node
    // For example, you might want to log the trigger or update some state
    console.log("Manual trigger executed with context:", context);

    // Return the updated context (if any changes were made)
    return context;
  });

  return result;
};

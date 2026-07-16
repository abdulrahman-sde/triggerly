import { nodeStatusChannel } from "@/inngest/channels/node-status";
import type { GetStepTools, Inngest } from "inngest";
import type { Realtime } from "inngest/realtime";
export type WorkflowContext = Record<string, unknown>;
export type StepTools = GetStepTools<Inngest.Any>;

export interface ExecutorParams<tData = Record<string, unknown>> {
  data: tData;
  nodeId: string;
  context: WorkflowContext;
  step: StepTools;
  publish?: Realtime.TypedPublishFn;
  channel: ReturnType<typeof nodeStatusChannel>;
}

export type NodeExecutor<tData = Record<string, unknown>> = (
  params: ExecutorParams<tData>,
) => Promise<WorkflowContext>;

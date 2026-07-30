import { nodeStatusChannel } from "@/inngest/channels/node-status";
import { useWorkflowRun } from "@/store/workflow-run";
import { useRealtime } from "inngest/react";
import { getRealtimeToken } from "../actions/get-node-status-token";

export const useNodeStatus = ({ nodeId }: { nodeId: string }) => {
  const runId = useWorkflowRun((s) => s.runId);

  const ch = nodeStatusChannel({ runId: runId ?? "" });
  const topics = ["status"] as const;

  const { messages } = useRealtime({
    channel: ch,
    topics,
    token: () => getRealtimeToken(runId as string),
    enabled: Boolean(runId),
  });

  const status = messages.all
    .filter(
      (msg): msg is Extract<typeof msg, { kind: "data"; topic: "status" }> =>
        msg.kind === "data" && msg.data.nodeId === nodeId,
    )
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  console.log(status[0]?.data);
  return { status: status[0]?.data.status };
};

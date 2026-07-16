import { workflowChannel } from "@/inngest/channels/workflow";
import { useRealtime } from "inngest/react";
import { getWorkflowRealtimeToken } from "../actions/get-workflow-token";
import { useWorkflowRun } from "@/store/workflow-run";
import { useEffect } from "react";
import { Realtime } from "inngest";

export const useWorkflowStatus = (workflowId: string) => {
  const ch = workflowChannel({ workflowId });
  const topics = ["executionStarted"] as const;

  const { messages } = useRealtime({
    channel: ch,
    topics,
    token: () => getWorkflowRealtimeToken(workflowId),
    enabled: Boolean(workflowId),
  });
  useEffect(() => {
    const latest: Realtime.Message | undefined = messages.all.at(-1);
    if (latest) {
      console.log(latest);
      useWorkflowRun.getState().setRunId(latest.data.runId);
    }
  }, [messages]);
};

"use server";
import { workflowChannel } from "@/inngest/channels/workflow";
import { inngest } from "@/inngest/client";
import { getClientSubscriptionToken } from "inngest/react";

// actions.ts — same pattern as getRealtimeToken, just a different channel
export async function getWorkflowRealtimeToken(workflowId: string) {
  return getClientSubscriptionToken(inngest, {
    channel: workflowChannel({ workflowId }),
    topics: ["executionStarted"],
  });
}

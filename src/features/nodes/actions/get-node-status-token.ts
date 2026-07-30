"use server";

import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { nodeStatusChannel } from "@/inngest/channels/node-status";

export async function getRealtimeToken(runId: string) {
  return getClientSubscriptionToken(inngest, {
    channel: nodeStatusChannel({ runId }),
    topics: ["status"],
  });
}

import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky from "ky";
import Handlebars from "handlebars";
import { inngest } from "@/inngest/client";

type DiscordData = {
  variableName?: string;
  webhookUrl?: string;
  username?: string;
  content?: string;
};

export const discordExecutor: NodeExecutor<DiscordData> = async ({
  data,
  context,
  step,
  channel,
  nodeId,
}) => {
  try {
    const webhookUrl = Handlebars.compile(data.webhookUrl)(context);
    if (!webhookUrl) {
      throw new NonRetriableError("Webhook URL is required for Discord node");
    }

    const content = Handlebars.compile(data.content)(context);
    if (!content) {
      throw new NonRetriableError(
        "Message content is required for Discord node",
      );
    }

    const username = data.username
      ? Handlebars.compile(data.username)(context)
      : undefined;

    const variableName = data.variableName;
    if (!variableName) {
      throw new NonRetriableError("Variable name is required for Discord node");
    }

    await inngest.realtime.publish(channel.status, {
      status: "loading",
      nodeId: nodeId,
    });

    const result = await step.run(`discord-webhook-${nodeId}`, async () => {
      const body: Record<string, string> = { content };
      if (username) {
        body.username = username;
      }

      const response = await ky.post(webhookUrl, {
        json: body,
      });

      const responsePayload = {
        status: response.status,
        ok: response.ok,
      };

      return {
        ...context,
        [variableName]: responsePayload,
      };
    });

    await inngest.realtime.publish(channel.status, {
      status: "success",
      nodeId: nodeId,
    });
    return result;
  } catch (error) {
    await inngest.realtime.publish(channel.status, {
      status: "error",
      nodeId: nodeId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

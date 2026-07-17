import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { inngest } from "@/inngest/client";
import { generateText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

type OpenAICompatibleData = {
  variableName?: string;
  baseURL?: string;
  apiKey?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const OpenAICompatibleExecutor: NodeExecutor<
  OpenAICompatibleData
> = async ({ data, context, step, channel, nodeId }) => {
  try {
    if (!data.variableName) {
      throw new NonRetriableError("Variable name is required");
    }

    await inngest.realtime.publish(channel.status, {
      status: "loading",
      nodeId: nodeId,
    });

    const systemPrompt = data.systemPrompt
      ? Handlebars.compile(data.systemPrompt)(context)
      : "you are a helpful assistant";
    const userPrompt = data.userPrompt
      ? Handlebars.compile(data.userPrompt)(context)
      : "";
    const baseURL = data.baseURL || "https://integrate.api.nvidia.com/v1";
    const apiKey = data.apiKey || process.env.NIM_API_KEY || "";

    const selectedModel = "nvidia/nemotron-3-nano-30b-a3b";
    const provider = createOpenAICompatible({
      baseURL,
      name: "openai-compatible",
      apiKey,
    });

    const { steps } = await step.ai.wrap(
      "openai-compatible-generate-text",
      generateText,
      {
        model: provider.chatModel(selectedModel),
        system: systemPrompt,
        prompt: userPrompt,
      },
    );

    const text =
      steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    await inngest.realtime.publish(channel.status, {
      status: "success",
      nodeId: nodeId,
    });

    return {
      ...context,
      [data.variableName]: {
        aiResponse: text,
      },
    };
  } catch (error) {
    await inngest.realtime.publish(channel.status, {
      status: "error",
      nodeId: nodeId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

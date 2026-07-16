import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as kyOptions } from "ky";
import Handlebars from "handlebars";
import { inngest } from "@/inngest/client";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText } from "ai";
type GeminiData = {
  variableName?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const GeminiExecutor: NodeExecutor<GeminiData> = async ({
  data,
  context,
  step,
  channel,
  nodeId,
}) => {
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
    // const credentials = process.env.NIM_API_KEY;

    const nim = createOpenAICompatible({
      name: "nim",
      baseURL: "https://integrate.api.nvidia.com/v1",
      headers: {
        Authorization: `Bearer ${process.env.NIM_API_KEY}`,
      },
    });

    const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: nim("nvidia/nemotron-3-nano-30b-a3b"),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

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

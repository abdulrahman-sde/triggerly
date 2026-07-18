import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { inngest } from "@/inngest/client";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

type GeminiData = {
  variableName?: string;
  apiKey?: string;
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
    const credentials = data.apiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    const google = createGoogleGenerativeAI({ apiKey: credentials || "" });
    const selectedModel = data.model || "gemini-2.0-flash";

    const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google(selectedModel),
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

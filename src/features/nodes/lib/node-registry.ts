import { NodeType } from "@/generated/prisma/browser";
import { NodeExecutor } from "../types";
import { httpRequestExecutor } from "@/features/nodes/execution-nodes/http-request/excutor";
import { googleFormTriggerExecutor } from "@/features/nodes/trigger-nodes/google-form-trigger/executor";
import { DiscordExecutor } from "@/features/nodes/execution-nodes/discord/excutor";
import { GeminiExecutor } from "../execution-nodes/gemini/excutor";
import { OpenAICompatibleExecutor } from "../execution-nodes/openai-compatible/excutor";
import { manualTriggerExecutor } from "../trigger-nodes/manual-trigger/executor";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
  [NodeType.GEMINI]: GeminiExecutor,
  [NodeType.OPENAI_COMPATIBLE]: OpenAICompatibleExecutor,
  [NodeType.DISCORD]: DiscordExecutor,
};

export const getExecutor = (nodeType: NodeType): NodeExecutor => {
  const executor = executorRegistry[nodeType];
  if (!executor) {
    throw new Error(`No executor found for node type: ${nodeType}`);
  }
  return executor;
};

import { initialNode } from "@/components/react-flow/initial-node";
import { DiscordNode } from "@/features/nodes/execution-nodes/discord/node";
import { GeminiNode } from "@/features/nodes/execution-nodes/gemini/node";
import { HttpRequestNode } from "@/features/nodes/execution-nodes/http-request/node";
import { OpenAICompatibleNode } from "@/features/nodes/execution-nodes/openai-compatible/node";
import GoogleFormTriggerNode from "@/features/nodes/trigger-nodes/google-form-trigger/node";
import ManualTriggerNode from "@/features/nodes/trigger-nodes/manual-trigger/node";
import { GoogleSheetsNode } from "@/features/nodes/execution-nodes/google-sheets/node";
import { EmailNode } from "@/features/nodes/execution-nodes/email/node";
import { NodeType } from "@/generated/prisma/enums";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
  [NodeType.INITIAL]: initialNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,
  [NodeType.GEMINI]: GeminiNode,
  [NodeType.OPENAI_COMPATIBLE]: OpenAICompatibleNode,
  [NodeType.DISCORD]: DiscordNode,
  [NodeType.GOOGLE_SHEETS]: GoogleSheetsNode,
  [NodeType.EMAIL]: EmailNode,
} as const satisfies NodeTypes;

export type NodeComponentType = keyof typeof nodeComponents;

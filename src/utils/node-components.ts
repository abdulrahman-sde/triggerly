import { initialNode } from "@/components/react-flow/initial-node";
import { GeminiNode } from "@/features/executions/components/gemini/node";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import GoogleFormTriggerNode from "@/features/triggers/components/google-form-trigger/node";
import ManualTriggerNode from "@/features/triggers/components/manual-trigger/node";
import { NodeType } from "@/generated/prisma/enums";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
  [NodeType.INITIAL]: initialNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,
  [NodeType.GEMINI]: GeminiNode,
} as const satisfies NodeTypes;

export type NodeComponentType = keyof typeof nodeComponents;

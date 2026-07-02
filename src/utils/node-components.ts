import { initialNode } from "@/components/react-flow/initial-node";
import { HttpRequestNode } from "@/features/executions/components/http-request-node";
import ManualTriggerNode from "@/features/triggers/components/manual-trigger-node";
import { NodeType } from "@/generated/prisma/enums";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
  [NodeType.INITIAL]: initialNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
} as const satisfies NodeTypes;

export type NodeComponentType = keyof typeof nodeComponents;

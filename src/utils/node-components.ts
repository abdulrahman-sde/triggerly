import { initialNode } from "@/components/react-flow/initial-node";
import { NodeType } from "@/generated/prisma/enums";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
  [NodeType.INITIAL]: initialNode,
} as const satisfies NodeTypes;

export type NodeComponentType = keyof typeof nodeComponents;

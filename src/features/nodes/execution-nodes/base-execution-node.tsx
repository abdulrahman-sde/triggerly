"use client";

import { BaseHandle } from "@/components/react-flow/base-handle";
import { BaseNode } from "@/components/react-flow/base-node";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { WorkflowNode } from "@/components/react-flow/workflow-node";
import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import { memo, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const chipStyles: Record<string, string> = {
  "HTTP Request":
    "border-amber-200 bg-amber-100 text-amber-700 shadow-[0_8px_20px_-12px_rgba(217,119,6,0.5)]",
  "AI Action":
    "border-violet-300 bg-violet-100 text-violet-700 shadow-[0_8px_20px_-12px_rgba(139,92,246,0.4)]",
  "Send Message":
    "border-sky-300 bg-sky-200/80 text-sky-800 shadow-[0_8px_20px_-12px_rgba(14,165,233,0.4)]",
};

interface BaseExecutionNodeProps extends NodeProps {
  children?: ReactNode;
  status?: NodeStatus;
  chipLabel?: string;
  chipIcon?: LucideIcon;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseExecutionNode = memo(
  ({
    id,
    selected,
    children,
    status = "initial",
    chipLabel,
    chipIcon: ChipIcon,
    onSettings,
    onDoubleClick,
  }: BaseExecutionNodeProps) => {
    const { setNodes, setEdges } = useReactFlow();

    const handleDelete = () => {
      setNodes((currentNodes) => {
        const updatedNodes = currentNodes.filter((node) => node.id !== id);
        return updatedNodes;
      });

      setEdges((currentEdges) => {
        const updatedEdges = currentEdges.filter(
          (edge) => edge.source !== id && edge.target !== id,
        );
        return updatedEdges;
      });
    };

    return (
      <WorkflowNode
        selected={selected}
        onDelete={handleDelete}
        onSettings={onSettings}
      >
        <div className="relative w-72 pt-5">
          {chipLabel && (
            <div
              className={cn(
                "pointer-events-none absolute -top-0.5 -z-20 inline-flex h-13 pb-7 items-center gap-1 rounded-t-xl border px-3.5 text-xs font-medium shadow-sm",
                chipStyles[chipLabel] ??
                  "border-border bg-muted text-muted-foreground",
              )}
            >
              {ChipIcon && <ChipIcon className="size-3 " />}
              {chipLabel}
            </div>
          )}

          <BaseNode
            onDoubleClick={onDoubleClick}
            status={status}
            selected={selected}
            className="group w-full overflow-hidden rounded-2xl bg-card"
          >
            {children}

            <BaseHandle id="target-1" type="target" position={Position.Left} />
            <BaseHandle id="source-1" type="source" position={Position.Right} />
          </BaseNode>
        </div>
      </WorkflowNode>
    );
  },
);

BaseExecutionNode.displayName = "BaseExecutionNode";

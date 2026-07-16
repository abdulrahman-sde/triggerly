"use client";

import { BaseHandle } from "@/components/react-flow/base-handle";
import { BaseNode } from "@/components/react-flow/base-node";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { WorkflowNode } from "@/components/react-flow/workflow-node";
import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import { Play } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Pointer } from "reicon-react";
import { cn } from "@/lib/utils";

interface BaseTriggerNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  status?: NodeStatus;
  iconBg: string;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo(
  ({
    id,
    selected,
    icon: Icon,
    name,
    description,
    children,
    status = "initial",
    iconBg,
    onSettings,
    onDoubleClick,
  }: BaseTriggerNodeProps) => {
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
        name={name}
        description={description}
        onDelete={handleDelete}
        onSettings={onSettings}
      >
        <div className="relative w-72 pt-5">
          <div className="pointer-events-none absolute   top-0  -z-20 inline-flex h-12 pb-7 items-center gap-1 rounded-t-xl border border-blue-200 bg-[#CDDCFB] px-3.5 text-xs font-medium text-blue-700 shadow-[0_8px_20px_-12px_rgba(37,99,235,0.5)]">
            <Pointer className="size-3 fill-current" weight="Filled" />
            Trigger
          </div>

          <BaseNode
            onDoubleClick={onDoubleClick}
            status={status}
            selected={selected}
            className="group w-full overflow-hidden rounded-2xl bg-card"
          >
            <div className="flex items-start gap-3 p-4">
              <div
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl",
                  iconBg,
                )}
              >
                {typeof Icon === "string" ? (
                  <Image src={Icon} alt={name} width={30} height={30} />
                ) : (
                  <Icon className="size-5 text-foreground" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium leading-5 text-foreground">
                  {name}
                </p>
                <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
                  {description ?? "Not configured yet"}
                </p>
              </div>
            </div>

            {children}

            <BaseHandle id="source-1" type="source" position={Position.Right} />
          </BaseNode>
        </div>
      </WorkflowNode>
    );
  },
);

BaseTriggerNode.displayName = "BaseTriggerNode";

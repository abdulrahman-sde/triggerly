"use client";

import { NodeToolbar, Position } from "@xyflow/react";
import { SettingsIcon, TrashIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../ui/button";

interface WorkflowNodeProps {
  children: ReactNode;
  showToolbar?: boolean;
  selected?: boolean;
  onDelete?: () => void;
  onSettings?: () => void;
  name?: string;
  description?: string;
}

export function WorkflowNode({
  children,
  showToolbar = true,
  selected = false,
  onDelete,
  onSettings,
}: WorkflowNodeProps) {
  return (
    <>
      {showToolbar && (
        <NodeToolbar
          position={Position.Top}
          isVisible={selected}
          className="pb-1"
        >
          <div className="flex items-center gap-1 rounded-2xl border border-white/10  p-1.5  shadow-[0_12px_32px_-18px_rgba(0,0,0,0.85)] backdrop-blur-md duration-300">
            <Button
              size="icon"
              variant="ghost"
              onClick={onSettings}
              className="h-8 w-8 rounded-xl"
            >
              <SettingsIcon className="size-4" />
            </Button>
            <div className="h-5 w-px bg-white/10" />
            <Button
              size="icon"
              variant="ghost"
              onClick={onDelete}
              className="h-8 w-8 rounded-xl "
            >
              <TrashIcon className="size-4" />
            </Button>
          </div>
        </NodeToolbar>
      )}
      {children}
    </>
  );
}

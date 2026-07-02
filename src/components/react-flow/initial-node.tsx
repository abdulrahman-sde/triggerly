"use clinet";
import { NodeProps } from "@xyflow/react";
import { PlaceholderNode } from "../placeholder-node";
import { memo, useState } from "react";
import { Plus } from "lucide-react";
import { WorkflowNode } from "./workflow-node";
import { NodeSelector } from "@/features/editor/components/node-selector";

export const initialNode = memo((props: NodeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <NodeSelector open={isOpen} onOpenChange={setIsOpen}>
      <WorkflowNode showToolbar={false}>
        <PlaceholderNode {...props}>
          <div className="flex flex-col items-center justify-center ">
            <Plus className="size-4 text-gray-400" />
          </div>
        </PlaceholderNode>
      </WorkflowNode>
    </NodeSelector>
  );
});

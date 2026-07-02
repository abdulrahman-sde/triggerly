import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "./base-trigger-node";
import { MousePointer2Icon } from "lucide-react";

export default function ManualTriggerNode(props: NodeProps) {
  return (
    <div>
      <BaseTriggerNode
        {...props}
        name="Manual Trigger"
        icon={MousePointer2Icon}
      ></BaseTriggerNode>
    </div>
  );
}

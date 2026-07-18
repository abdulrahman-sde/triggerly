import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../base-trigger-node";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { Pointer } from "reicon-react";

export default function ManualTriggerNode(props: NodeProps) {
  const { status } = useNodeStatus({ nodeId: props.id });

  return (
    <BaseTriggerNode
      {...props}
      name="Manual Trigger"
      icon={Pointer}
      iconBg="bg-zinc-100/80"
      iconColor="#6366f1"
      status={status ?? "initial"}
    ></BaseTriggerNode>
  );
}

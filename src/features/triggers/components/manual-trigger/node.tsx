import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../base-trigger-node";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";

export default function ManualTriggerNode(props: NodeProps) {
  const { status } = useNodeStatus({ nodeId: props.id });

  return (
    <BaseTriggerNode
      {...props}
      name="Manual Trigger"
      icon="/assets/icons/manual-trigger.svg"
      iconBg="bg-zinc-100/80"
      status={status ?? "initial"}
    ></BaseTriggerNode>
  );
}

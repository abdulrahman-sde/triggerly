"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import EmailSheet from "./sheet";
import { BaseExecutionNode } from "../base-execution-node";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";

import { useNodeStatus } from "../../hooks/use-node-status";

type EmailNodeData = {
  variableName?: string;
  credentialId?: string;
  from?: string;
  to?: string;
  subject?: string;
  body?: string;
};

type EmailNodeType = Node<EmailNodeData>;

export const EmailNode = memo((props: NodeProps<EmailNodeType>) => {
  const { updateNodeData } = useReactFlow();
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeData = props.data;

  const handleSubmit = (values: Partial<EmailNodeData>) => {
    updateNodeData(props.id, values);
  };

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const { status } = useNodeStatus({ nodeId: props.id });

  return (
    <>
      <EmailSheet
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        chipLabel="Email"
        chipIcon={Mail}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        status={status ?? "initial"}
      >
        <div className="flex items-start gap-3 p-4">
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-card",
              "border border-border/60",
            )}
          >
            <Image
              src="/assets/icons/resend.svg"
              alt="Resend"
              width={24}
              height={24}
              className="size-5 object-contain"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-medium leading-5 text-foreground">
              {nodeData?.to || "No recipient set"}
            </p>
            <span className="text-sm leading-5 text-muted-foreground line-clamp-1">
              {nodeData?.subject
                ? nodeData.subject
                : "No subject set"}
            </span>
          </div>
        </div>
      </BaseExecutionNode>
    </>
  );
});

EmailNode.displayName = "EmailNode";
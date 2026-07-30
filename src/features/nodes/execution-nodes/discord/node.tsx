"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import DiscordSheet from "./sheet";
import { BaseExecutionNode } from "../base-execution-node";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { useNodeStatus } from "../../hooks/use-node-status";
import { Chat } from "reicon-react";

type DiscordNodeData = {
  variableName?: string;
  username?: string;
  webhookUrl?: string;
  content?: string;
};

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
  const { updateNodeData } = useReactFlow();
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeData = props.data;

  const handleSubmit = (values: Partial<DiscordNodeData>) => {
    updateNodeData(props.id, values);
  };

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const { status } = useNodeStatus({ nodeId: props.id });

  return (
    <>
      <DiscordSheet
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        chipLabel="Send Message"
        chipIcon={Chat}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        status={status ?? "initial"}
      >
        <div className="flex items-start gap-3 p-4">
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl",
              "bg-zinc-100/80",
            )}
          >
            <Image
              src="/assets/icons/discord.svg"
              alt="Discord"
              width={24}
              height={24}
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-medium leading-5 text-foreground">
              {nodeData?.username || "Discord"}
            </p>
            <span className="text-sm leading-5 text-muted-foreground line-clamp-1">
              {nodeData?.content
                ? `${nodeData.content.slice(0, 40)}${nodeData.content.length > 40 ? "..." : ""}`
                : "No Manual message set"}
            </span>
          </div>
        </div>
      </BaseExecutionNode>
    </>
  );
});

DiscordNode.displayName = "DiscordNode";

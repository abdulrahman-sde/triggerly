"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { useNodeStatus } from "../../hooks/use-node-status";
import { Sparkle3 } from "reicon-react";
import { Layers } from "lucide-react";
import OpenAICompatibleSheet, { OpenAICompatibleFormValues } from "./sheet";

type OpenAICompatibleNodeTypes = Node<OpenAICompatibleFormValues>;

export const OpenAICompatibleNode = memo(
  (props: NodeProps<OpenAICompatibleNodeTypes>) => {
    const { updateNodeData } = useReactFlow();
    const [dialogOpen, setDialogOpen] = useState(false);
    const nodeData = props.data;

    const handleSubmit = (values: Partial<OpenAICompatibleFormValues>) => {
      updateNodeData(props.id, values);
    };

    const handleOpenSettings = () => {
      setDialogOpen(true);
    };

    const { status } = useNodeStatus({ nodeId: props.id });

    const hasCustomUrl = !!nodeData?.baseURL;
    const displayModel =
      nodeData?.model || "nvidia/llama-3.1-nemotron-nano-8b-v1";
    const displayUrl = hasCustomUrl
      ? nodeData.baseURL!.replace(/^https?:\/\//, "").replace(/\/v\d+\/?$/, "")
      : "nim (default)";

    return (
      <>
        <OpenAICompatibleSheet
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          defaultValues={nodeData}
        />
        <BaseExecutionNode
          {...props}
          id={props.id}
          chipLabel="AI Action"
          chipIcon={Sparkle3}
          onSettings={handleOpenSettings}
          onDoubleClick={handleOpenSettings}
          status={status ?? "initial"}
        >
          <div className="flex items-start gap-1  px-3 pt-2.5 pb-2">
            <div
              className={cn(
                "flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-lg",
                "bg-zinc-100/80",
              )}
            >
              <Image
                src="/assets/icons/openai.svg"
                alt="OpenAI Compatible"
                width={12}
                height={12}
              />
            </div>

            <div className="min-w-0 flex-1 mt-0.5">
              <p className="truncate text-[15px] font-medium leading-5 text-foreground">
                OpenAI Compatible
              </p>
            </div>
          </div>

          <div className="px-3 pb-3 pt-0 flex flex-col gap-3">
            <div className="rounded-xl border border-border/60 bg-secondary/90 p-1.5 flex flex-col gap-1">
              <div className="self-start rounded border border-border/60 bg-card px-1.5 py-0.5 text-[9px] text-muted-foreground/75 uppercase leading-none">
                Prompt
              </div>
              <div className="text-xs leading-relaxed px-1 line-clamp-4  text-foreground/85 break-words whitespace-pre-wrap">
                {nodeData?.userPrompt || "No prompt configured"}
              </div>
            </div>

            <div className="self-start flex items-center gap-1.5 rounded-lg border border-border/50 bg-secondary/15 px-2 py-1 text-xs text-muted-foreground">
              <Layers className="size-3.5 text-muted-foreground/60" />
              <span className="font-sans text-[11px] leading-none lowercase">
                {displayModel}
              </span>
              {displayUrl && (
                <>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="font-sans text-[11px] leading-none text-muted-foreground/60 truncate max-w-[100px]">
                    {displayUrl}
                  </span>
                </>
              )}
            </div>
          </div>
        </BaseExecutionNode>
      </>
    );
  },
);

OpenAICompatibleNode.displayName = "OpenAICompatibleNode";

"use client";

import { Globe } from "lucide-react";
import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import HttpRequestSheet from "./sheet";
import { BaseExecutionNode } from "../base-execution-node";
import { cn } from "@/lib/utils";

import { useNodeStatus } from "../../hooks/use-node-status";
import { GlobePointer } from "reicon-react";

const methodStyles: Record<string, string> = {
  GET: "bg-green-100/70 text-green-700",
  POST: "bg-blue-100/70 text-blue-700",
  PUT: "bg-orange-100/70 text-orange-700",
  PATCH: "bg-violet-100/70 text-violet-700",
  DELETE: "bg-red-100/70 text-red-700",
};

type HttpRequestNodeData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const { updateNodeData } = useReactFlow();
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeData = props.data;
  const endpoint = nodeData?.endpoint
    ? `${nodeData.endpoint}`
    : "Not configured";

  const method = nodeData?.method ? `${nodeData.method}` : "";

  const handleSubmit = (values: Partial<HttpRequestNodeData>) => {
    updateNodeData(props.id, values);
  };

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const { status } = useNodeStatus({ nodeId: props.id });

  return (
    <>
      <HttpRequestSheet
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        chipLabel="HTTP Request"
        chipIcon={Globe}
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
            <GlobePointer className="size-6" color="#b45309" weight="Filled" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-medium leading-5 text-foreground">
              HTTP Request
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              {method && (
                <span
                  className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-medium leading-none ${methodStyles[method] || "bg-zinc-100/70 text-zinc-700"}`}
                >
                  {method}
                </span>
              )}
              <span className="text-sm leading-5 text-muted-foreground truncate">
                {endpoint ?? "Not configured yet"}
              </span>
            </div>
          </div>
        </div>
      </BaseExecutionNode>
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";

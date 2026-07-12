"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import HttpRequestSheet from "./sheet";
import { BaseExecutionNode } from "../base-execution-node";
import { httpRequestChannel } from "@/inngest/channels";
import { useRealtime } from "inngest/react";
import { getRealtimeToken } from "./actions";
import { useWorkflowRun } from "@/store/workflow-run";

type HttpRequestNodeData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

// Mirrors the "kind: data" branch of Realtime.Message for the "status" topic.
// We never publish streamed chunks on this channel, so this is the only
// variant that will actually occur at runtime — but TS needs it spelled out
// to narrow the union produced by messages.all.
type HttpStatusMessage = {
  topic: "status";
  channel: string;
  kind: "data";
  createdAt: Date;
  runId?: string;
  fnId?: string;
  envId?: string;
  data: {
    type: "loading" | "success" | "error";
    nodeId: string;
  };
};

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const { updateNodeData } = useReactFlow();
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeData = props.data;
  const description = nodeData?.endpoint
    ? `${nodeData.method || "GET"}: ${nodeData.endpoint}`
    : "Not configured";

  const handleSubmit = (values: Partial<HttpRequestNodeData>) => {
    updateNodeData(props.id, values);
  };

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const runId = useWorkflowRun((s) => s.runId);

  const ch = httpRequestChannel({ runId: runId ?? "" });
  const topics = ["status"] as const;

  const { messages } = useRealtime({
    channel: ch,
    topics,
    token: () => getRealtimeToken(runId as string),
    enabled: Boolean(runId),
  });

  const status = messages.all
    .filter(
      (msg): msg is HttpStatusMessage =>
        msg.kind === "data" && msg.data.nodeId === props.id,
    )
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

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
        icon={GlobeIcon}
        name="HTTPS Request"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        status={status[0]?.data.type ?? "initial"}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";

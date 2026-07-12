"use client";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-worflows";
import { nodeComponents } from "@/utils/node-components";
import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  MiniMap,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { NodeSelector } from "./node-selector";
import { EditorBottomBar } from "./editor-bottom-bar";
import { Button } from "@/components/ui/button";

import { useEditorStore } from "@/store/editor-store";

export default function Editor({ workflowId }: { workflowId: string }) {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const [nodes, setNodes] = useState<Node[]>(workflow?.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow?.edges);
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(100);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const onViewportChange = useCallback(
    (viewport: { x: number; y: number; zoom: number }) => {
      setZoom(Math.round(viewport.zoom * 100));
    },
    [],
  );

  return (
    <div className="w-full h-full ">
      <ReactFlow
        proOptions={{ hideAttribution: true }}
        colorMode="dark"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        nodeTypes={nodeComponents}
        onConnect={onConnect}
        onViewportChange={onViewportChange}
        onInit={(state) => {
          const setEditor = useEditorStore.getState().setEditorState;
          setEditor(state);
        }}
        className="rounded-xl"
      >
        <MiniMap />
        <Background gap={15} />

        <Controls />
        <Panel position="top-right">
          <NodeSelector open={isOpen} onOpenChange={setIsOpen}>
            <div className="flex flex-col items-center gap-1">
              <Button
                asChild
                size="icon"
                variant="secondary"
                className="h-9 w-9.5 p-2"
              >
                <Plus className=" text-gray-200" />
              </Button>
              <span className="text-xs font-bold text-gray-100">Add Node</span>
            </div>
          </NodeSelector>
        </Panel>
        <Panel position="bottom-center">
          <EditorBottomBar workflowId={workflowId} zoom={zoom} />
        </Panel>
      </ReactFlow>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editor-store";
import { useUpdateWorkflow } from "@/features/workflows/hooks/use-worflows";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Floppy, Loader } from "reicon-react";
import { Maximize2, Minimize2, WandSparklesIcon, ZoomIn } from "lucide-react";

export function EditorBottomBar({
  workflowId,
  zoom,
}: {
  workflowId: string;
  zoom: number;
}) {
  const editorState = useEditorStore((state) => state.editorState);
  const handleSaveWorkflow = useUpdateWorkflow();
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleSave = () => {
    if (!editorState) return;
    handleSaveWorkflow.mutate(
      {
        id: workflowId,
        nodes: editorState.getNodes(),
        edges: editorState.getEdges(),
      },
      {
        onSuccess: () => {
          setLastSaved(new Date().toLocaleTimeString());
        },
      },
    );
  };

  const handleAiGenerate = () => {
    toast.info("AI node generation coming soon");
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return (
    <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm border rounded-xl shadow-lg px-2.5 py-1.5">
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium px-1">
        <ZoomIn className="h-3 w-3" />
        {zoom}%<span className="text-muted-foreground/40">|</span>
        {lastSaved ? `Saved ${lastSaved}` : "Not saved"}
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <span className="text-muted-foreground/40">|</span>
        <Button size="icon-sm" variant="outline" onClick={toggleFullscreen}>
          {isFullscreen ? (
            <Minimize2 className="h-2 w-2" />
          ) : (
            <Maximize2 className="h-3 w-3" />
          )}
        </Button>
        <Button size="icon-sm" variant="outline" onClick={handleAiGenerate}>
          <WandSparklesIcon className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          onClick={handleSave}
          disabled={handleSaveWorkflow.isPending}
        >
          {handleSaveWorkflow.isPending ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Floppy className="h-4 w-4" />
          )}
          Save Workflow
        </Button>
      </div>
    </div>
  );
}

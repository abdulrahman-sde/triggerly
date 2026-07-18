"use client";

import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-worflows";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Loader, Play } from "reicon-react";
import { Maximize2, Minimize2, WandSparklesIcon, ZoomIn } from "lucide-react";

export function EditorBottomBar({
  workflowId,
  zoom,
}: {
  workflowId: string;
  zoom: number;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const executeWorkflow = useExecuteWorkflow();

  const handleExecuteWorkflow = () => {
    executeWorkflow.mutate({ workflowId });
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
          variant="default"
          onClick={handleExecuteWorkflow}
          disabled={executeWorkflow.isPending}
        >
          {executeWorkflow.isPending ? (
            <>
              <Loader size={24} className="animate-spin" />
              Executing ...
            </>
          ) : (
            <>
              <Play size={18} />
              Execute Workflow
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

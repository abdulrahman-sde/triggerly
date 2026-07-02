"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NodeType } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import { GlobeIcon, MousePointer2Icon, MousePointerIcon } from "lucide-react";
import { toast } from "sonner";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

const TriggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger manually",
    description: "Runs the flow on clicking a button. ",
    icon: MousePointer2Icon,
  },
];

const ExecutionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP",
    description: "Send an HTTP request to a URL",
    icon: GlobeIcon,
  },
];

export function NodeSelector({
  open,
  onOpenChange,
  onSelect,
  children,
}: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (type: NodeType) => void;
  children: React.ReactNode;
}) {
  const { getNodes, setNodes, screenToFlowPosition } = useReactFlow();

  const handleNodeSelect = (selection: NodeTypeOption) => {
    if (selection.type === NodeType.MANUAL_TRIGGER) {
      const nodes = getNodes();
      console.log(nodes);
      const hasManualTriggerAlready = nodes.some(
        (node) => node.type === NodeType.MANUAL_TRIGGER,
      );

      if (hasManualTriggerAlready) {
        return toast.error(
          "Only one manual trigger node is allowed per workflow.",
        );
      }
    }
    const position = screenToFlowPosition({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
      y: window.innerHeight / 2 + (Math.random() - 0.5) * 200,
    });

    const newNode = {
      id: crypto.randomUUID(),
      type: selection.type,
      position,
      data: {},
    };

    setNodes((nodes) => {
      const hasInitialNode = nodes.some(
        (node) => node.type === NodeType.INITIAL,
      );
      if (hasInitialNode) {
        return [newNode];
      }
      return [...nodes, newNode];
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Add node</SheetTitle>
          <SheetDescription>
            Select the type of node you want to add.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 px-4 pb-4">
          {TriggerNodes.map((node) => {
            const Icon = node.icon;
            return (
              <button
                key={node.type}
                type="button"
                onClick={() => {
                  handleNodeSelect(node);
                  onSelect?.(node.type);
                  onOpenChange?.(false);
                }}
                className={cn(
                  "bg-card hover:bg-accent group flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-all",
                  "hover:border-primary/30 hover:shadow-sm",
                  "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                )}
              >
                <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-md">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{node.label}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                    {node.description}
                  </p>
                </div>
              </button>
            );
          })}

          {ExecutionNodes.map((node) => {
            const Icon = node.icon;
            return (
              <button
                key={node.type}
                type="button"
                onClick={() => {
                  handleNodeSelect(node);
                  onSelect?.(node.type);
                  onOpenChange?.(false);
                }}
                className={cn(
                  "bg-card hover:bg-accent group flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-all",
                  "hover:border-primary/30 hover:shadow-sm",
                  "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                )}
              >
                <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-md">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{node.label}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                    {node.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}

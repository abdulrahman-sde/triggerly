"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NodeType } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import { Pointer, GlobePointer } from "reicon-react";
import Image from "next/image";
import { toast } from "sonner";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const TriggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Manual Trigger",
    description: "Runs the flow when you click a button in the dashboard.",
    icon: <Pointer className="size-4" />,
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google Form Trigger",
    description: "Runs the flow when a Google Form is submitted.",
    icon: (
      <Image
        src="/assets/icons/google-form.svg"
        alt=""
        width={16}
        height={16}
        className="size-4"
      />
    ),
  },
];

const ExecutionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTPS Request",
    description:
      "Send an HTTPS request to any URL with custom headers and body.",
    icon: <GlobePointer className="size-4" />,
  },
  {
    type: NodeType.GEMINI,
    label: "Gemini",
    description: "Send a request to Gemini API.",
    icon: (
      <Image
        src="/assets/icons/gemini.svg"
        alt=""
        width={16}
        height={16}
        className="size-4"
      />
    ),
  },
  {
    type: NodeType.OPENAI_COMPATIBLE,
    label: "OpenAI Compatible",
    description: "Send a request to any OpenAI-compatible API.",
    icon: (
      <Image
        src="/assets/icons/openai.svg"
        alt=""
        width={16}
        height={16}
        className="size-4"
      />
    ),
  },
  {
    type: NodeType.DISCORD,
    label: "Discord",
    description: "Send a request to Discord API.",
    icon: (
      <Image
        src="/assets/icons/discord.svg"
        alt=""
        width={16}
        height={16}
        className="size-4"
      />
    ),
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
      <SheetContent
        side="right"
        className="w-80 border-l   backdrop-blur-xl p-0 rounded-l-2xl"
      >
        <SheetHeader className="flex flex-row items-center justify-between px-5 pt-5 pb-3 border-b ">
          <SheetTitle className="text-base font-medium ">Add Node</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-5 pt-4 pb-5 overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Triggers
              </span>
            </div>
            <div className="flex flex-col ">
              {TriggerNodes.map((node) => {
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
                      "group relative flex items-start gap-3 rounded-lg px-4 py-3.5 text-left transition-colors w-full overflow-hidden",
                      "hover:bg-primary/[0.03] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none duration-300",
                    )}
                  >
                    <span className="absolute left-0 top-2 h-[calc(100%-1rem)] w-0.5 rounded-full bg-primary/0 transition-all duration-300 group-hover:bg-primary group-hover:shadow-[0_0_12px_2px] group-hover:shadow-primary/60" />
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border">
                      {node.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium ">{node.label}</p>
                      <p className="text-xs text-muted-foreground mt-px leading-relaxed">
                        {node.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Actions
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {ExecutionNodes.map((node) => {
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
                      "group relative flex items-start gap-3 rounded-lg px-4 py-3.5 text-left transition-colors w-full overflow-hidden",
                      "hover:bg-primary/[0.03] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none duration-300",
                    )}
                  >
                    <span className="absolute left-0 top-2 h-[calc(100%-1rem)] w-0.5 rounded-full bg-primary/0 transition-all duration-300 group-hover:bg-primary group-hover:shadow-[0_0_12px_2px] group-hover:shadow-primary/60" />
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border">
                      {node.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium ">{node.label}</p>
                      <p className="text-xs text-muted-foreground mt-px leading-relaxed">
                        {node.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

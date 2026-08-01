import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";
import { NodeStatus } from "./node-status-indicator";
import { NodeStatusIndicator } from "./node-status-indicator";

interface BaseNodeProps extends ComponentProps<"div"> {
  status?: NodeStatus;
  selected?: boolean;
}

export function BaseNode({
  className,
  status = "initial",
  selected = false,
  ...props
}: BaseNodeProps) {
  const statusStyles =
    status === "loading"
      ? "border-blue-400/25"
      : status === "success"
        ? "border-emerald-400/50"
        : status === "error"
          ? "border-red-300/50"
          : "border-border/70";

  return (
    <NodeStatusIndicator
      status={status}
      variant="border"
      className="rounded-2xl"
    >
      <div
        className={cn(
          "bg-card text-card-foreground relative z-10 rounded-2xl border-2 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] duration-200",
          selected &&
            "shadow-[inset_0_0_0_2px_rgba(59,130,246,0.7),0_18px_40px_-28px_rgba(15,23,42,0.45)]",
          statusStyles,
          className,
        )}
        tabIndex={0}
        {...props}
      >
        <div className="relative z-10">{props.children}</div>
      </div>
    </NodeStatusIndicator>
  );
}

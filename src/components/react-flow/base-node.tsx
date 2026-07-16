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
        ? "border-emerald-400/25"
        : status === "error"
          ? "border-red-300/25"
          : "border-border/70";

  return (
    <NodeStatusIndicator
      status={status}
      variant="border"
      className="rounded-2xl"
    >
      <div
        className={cn(
          "bg-card text-card-foreground relative z-10 rounded-2xl border shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] duration-200",
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

/**
 * A container for a consistent header layout intended to be used inside the
 * `<BaseNode />` component.
 */
export function BaseNodeHeader({
  className,
  ...props
}: ComponentProps<"header">) {
  return (
    <header
      {...props}
      className={cn(
        "mx-0 my-0 -mb-1 flex flex-row items-center justify-between gap-2 px-4 py-3",
        // Remove or modify these classes if you modify the padding in the
        // `<BaseNode />` component.
        className,
      )}
    />
  );
}

/**
 * The title text for the node. To maintain a native application feel, the title
 * text is not selectable.
 */
export function BaseNodeHeaderTitle({
  className,
  ...props
}: ComponentProps<"h3">) {
  return (
    <h3
      data-slot="base-node-title"
      className={cn("user-select-none flex-1 text-sm font-medium", className)}
      {...props}
    />
  );
}

export function BaseNodeContent({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-content"
      className={cn("flex flex-col gap-y-3 p-4", className)}
      {...props}
    />
  );
}

export function BaseNodeFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-footer"
      className={cn(
        "flex flex-col items-center gap-y-2 border-t px-4 pb-4 pt-3",
        className,
      )}
      {...props}
    />
  );
}

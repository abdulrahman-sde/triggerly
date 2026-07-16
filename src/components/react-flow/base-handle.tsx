import type { ComponentProps } from "react";
import { Handle, type HandleProps } from "@xyflow/react";

import { cn } from "@/lib/utils";

export type BaseHandleProps = HandleProps;

export function BaseHandle({
  className,
  children,
  ...props
}: ComponentProps<typeof Handle>) {
  return (
    <Handle
      {...props}
      style={{ width: 11, height: 11, ...props.style }}
      className={cn(
        "rounded-full border-2 border-background bg-foreground shadow-[0_0_0_1px_hsl(var(--border))] transition-opacity",
        className,
      )}
    >
      {children}
    </Handle>
  );
}

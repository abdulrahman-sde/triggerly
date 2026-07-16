import { type ReactNode } from "react";
import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type NodeStatus = "loading" | "success" | "error" | "initial";

export type NodeStatusVariant = "overlay" | "border";

export type NodeStatusIndicatorProps = {
  status?: NodeStatus;
  variant?: NodeStatusVariant;
  children: ReactNode;
  className?: string;
};

export const SpinnerLoadingIndicator = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="relative">
      <StatusBorder className="border-blue-400/30">{children}</StatusBorder>

      <div className="pointer-events-none bg-background/50 backdrop-blur-xs absolute inset-0 z-50 rounded-2xl" />
      <div className="pointer-events-none absolute inset-0 z-50">
        <span className="absolute left-[calc(50%-1.25rem)] top-[calc(50%-1.25rem)] inline-block h-10 w-10 animate-ping rounded-full bg-blue-400/15" />

        <LoaderCircle className="absolute left-[calc(50%-0.75rem)] top-[calc(50%-0.75rem)] size-6 animate-spin text-blue-500" />
      </div>
      <div className="pointer-events-none absolute right-2.5 top-2.5 z-50 flex size-5 items-center justify-center rounded-full border border-blue-300/20 bg-blue-300/8 text-blue-300 shadow-[0_0_0_1px_rgba(37,99,235,0.08)]">
        <LoaderCircle className="size-3.5 animate-spin" />
      </div>
    </div>
  );
};

export const BorderLoadingIndicator = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <>
      <div className="absolute -left-px -top-px h-[calc(100%+2px)] w-[calc(100%+2px)]">
        <style>
          {`
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .spinner {
          animation: spin 2s linear infinite;
          position: absolute;
          left: 50%;
          top: 50%;
          width: 140%;
          aspect-ratio: 1;
          transform-origin: center;
        }
      `}
        </style>
        <div
          className={cn(
            "pointer-events-none absolute inset-0 overflow-hidden rounded-2xl",
            className,
          )}
        >
          <div className="spinner rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,rgb(100,130,255)_0deg,rgba(100,130,255,0)_360deg)]" />
        </div>
      </div>
      {children}
    </>
  );
};

const StatusBorder = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <>
      <div
        className={cn(
          "pointer-events-none absolute -left-px -top-px h-[calc(100%+2px)] w-[calc(100%+2px)] rounded-2xl border-2",
          className,
        )}
      />
      {children}
    </>
  );
};

export const NodeStatusIndicator = ({
  status,
  variant = "border",
  children,
  className,
}: NodeStatusIndicatorProps) => {
  switch (status) {
    case "loading":
      switch (variant) {
        case "overlay":
          return <SpinnerLoadingIndicator>{children}</SpinnerLoadingIndicator>;
        case "border":
          return (
            <BorderLoadingIndicator className={className}>
              {children}
            </BorderLoadingIndicator>
          );
        default:
          return <>{children}</>;
      }
    case "success":
      return (
        <div className="relative">
          <StatusBorder className={cn("border-emerald-400/80", className)}>
            {children}
          </StatusBorder>
          <div className="pointer-events-none absolute right-2.5 top-2.5 z-50 flex size-5 items-center justify-center rounded-full text-emerald-300 shadow-[0_0_0_1px_rgba(5,150,105,0.08)]">
            <CheckCircle2 className="size-3.5" />
          </div>
        </div>
      );
    case "error":
      return (
        <div className="relative">
          <StatusBorder className={cn("border-red-300", className)}>
            {children}
          </StatusBorder>
          <div className="pointer-events-none absolute right-2.5 top-2.5 z-50 flex size-5 items-center justify-center rounded-full text-red-300 shadow-[0_0_0_1px_rgba(239,68,68,0.08)]">
            <AlertCircle className="size-3.5" />
          </div>
        </div>
      );
    default:
      return <>{children}</>;
  }
};

import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Loader } from "reicon-react";
import Spinner from "./spinner";

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn("rounded-md animate-shimmer", className)}
      style={{
        background:
          "linear-gradient(90deg, var(--muted) 0%, color-mix(in oklch, var(--muted-foreground) 10%, transparent) 50%, var(--muted) 100%)",
        backgroundSize: "200% 100%",
      }}
    />
  );
}

export default function WorkflowEditorSkeleton() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
      <header className="flex h-13 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard/workflows">
                Workflows
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <Shimmer className="hidden h-4 w-36 md:block" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex-1" />
      </header>
      <div
        className="flex-1 relative overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: "#141414" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 flex flex-col gap-1 rounded-lg border border-border bg-card p-1">
          <Shimmer className="size-8 rounded-md" />
          <Shimmer className="size-8 rounded-md" />
          <Shimmer className="size-8 rounded-md" />
        </div>
        <div className="absolute bottom-4 right-4 rounded-lg border border-border bg-card p-2">
          <Shimmer className="h-28 w-44 rounded-md" />
        </div>
        <div className="absolute top-4 right-4">
          <Shimmer className="size-10 rounded-xl" />
        </div>
        <div className="relative flex flex-col items-center gap-3">
          <Spinner />
          <p className="text-sm text-muted-foreground">Loading workflow...</p>
        </div>
      </div>
    </>
  );
}

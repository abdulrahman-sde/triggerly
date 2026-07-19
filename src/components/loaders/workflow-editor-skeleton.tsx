import { Skeleton } from "@/components/ui/skeleton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Spinner from "./spinner";

export default function WorkflowEditorSkeleton() {
  return (
    <>
      <header className="flex bg-sidebar h-13 shrink-0 items-center gap-2 px-4">
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
              <Skeleton className="hidden h-4 w-36 md:block" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex-1" />
        <Skeleton className="h-8 w-32" />
      </header>
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-background bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:18px_18px]">
        <div className="absolute bottom-4 left-4 flex flex-col gap-1 rounded-lg border border-border bg-card p-1">
          <Skeleton className="size-8" />
          <Skeleton className="size-8" />
          <Skeleton className="size-8" />
        </div>
        <div className="absolute bottom-4 right-4 rounded-lg border border-border bg-card p-2">
          <Skeleton className="h-28 w-44" />
        </div>
        <div className="absolute top-4 right-4">
          <Skeleton className="size-10 rounded-xl" />
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg border border-border bg-card px-3 py-1.5">
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="relative flex flex-col items-center gap-3">
          <Spinner />
          <p className="text-sm text-muted-foreground">Loading workflow...</p>
        </div>
      </div>
    </>
  );
}

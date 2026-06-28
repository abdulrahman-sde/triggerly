"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-worflows";

export default function EditorHeader({ workflowId }: { workflowId: string }) {
  console.log("workflowId", workflowId);
  const { data: workflow } = useSuspenseWorkflow(workflowId);

  return (
    <>
      <header className="flex h-13 shrink-0 items-center gap-2 px-4  ">
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
              <BreadcrumbPage>
                {workflow?.name || `Workflow: ${workflowId}`}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex-1" />
      </header>
    </>
  );
}

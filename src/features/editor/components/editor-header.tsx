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
import {
  useExecuteWorkflow,
  useSuspenseWorkflow,
  useUpdateName,
} from "@/features/workflows/hooks/use-worflows";
import { Button } from "@/components/ui/button";
import { Loader, Pen, Play } from "reicon-react";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function EditorHeader({ workflowId }: { workflowId: string }) {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const handleNameEdit = useUpdateName();
  const [isEditMode, setEditMode] = useState(false);
  const [workflowName, setWorkflowName] = useState(workflow.name);
  const executeWorkflow = useExecuteWorkflow();
  const handleEditName = () => {
    if (workflowName.trim().length < 3) {
      return toast.error("Workflow name must be at least 3 characters long");
    }
    toast.loading("Saving workflow name...");

    handleNameEdit.mutate(
      { id: workflowId, name: workflowName },
      {
        onSuccess: () => {
          toast.dismiss();
          toast.success("Workflow name updated");
          setEditMode(false);
        },
        onError: (ctx) => {
          toast.dismiss();
          toast.error(ctx.message || "Failed to update workflow name");
        },
      },
    );
  };

  const handleExecuteWorkflow = () => {
    executeWorkflow.mutate({ workflowId });
  };
  return (
    <>
      <header className="flex  h-13 shrink-0 items-center gap-2 px-4  ">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard/workflows ">
                Workflows
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm flex items-center gap-1.5">
                {isEditMode ? (
                  <>
                    <Input
                      className="h-7.5"
                      value={workflowName}
                      onChange={(e) => {
                        e.preventDefault();
                        setWorkflowName(e.target.value);
                      }}
                    />
                    <Button
                      size={"sm"}
                      onClick={handleEditName}
                      disabled={handleNameEdit.isPending}
                    >
                      {handleNameEdit.isPending ? (
                        <>
                          <Loader size={24} className="animate-spin" />
                          Updating ...
                        </>
                      ) : (
                        <>Save</>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <p>{workflowName || `Workflow: ${workflowId}`}</p>
                    <Pen
                      size={13}
                      className="mt-0.5 cursor-pointer"
                      onClick={() => {
                        setEditMode(true);
                      }}
                    />
                  </>
                )}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex-1" />

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

      </header>
    </>
  );
}

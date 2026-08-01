"use client";
import { generateSlug } from "random-word-slugs";

import { MoreHorizontal, Plus, Trash2, Workflow } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EntityContainer } from "@/components/shared/entity-container";
import { EntityHeader } from "@/components/shared/entity-header";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  useCreateWorkflow,
  useRemoveWorkflow,
  useSuspenseWorkflows,
} from "../hooks/use-worflows";
import Link from "next/link";
import { formatDate } from "@/utils/format-date";

export default function WorkflowsList({
  description,
}: {
  description?: string;
}) {
  const workflows = useSuspenseWorkflows();
  const removeWorkflow = useRemoveWorkflow();
  const createWorkflow = useCreateWorkflow();
  const router = useRouter();

  const handleCreateWorkflow = () => {
    createWorkflow.mutate(
      { name: generateSlug(3) },
      {
        onSuccess: (data) => {
          router.push(`/dashboard/workflows/${data.id}`);
        },
      },
    );
  };

  const handleRemoveWorkflow = (id: string) => {
    removeWorkflow.mutate({ id });
  };
  return (
    <EntityContainer
      header={
        <EntityHeader
          title="Workflows"
          description={description}
          newButtonLabel="New Workflow"
          onNew={handleCreateWorkflow}
          isCreating={createWorkflow.isPending}
        />
      }
    >
      {workflows.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent ring-1 ring-primary/10">
            <Workflow className="size-7 text-primary/60" />
          </div>
          <p className="text-sm font-medium text-foreground/70">
            No workflows yet
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground/60 max-w-xs">
            Create a workflow to start automating your tasks.
          </p>
          <Button
            onClick={handleCreateWorkflow}
            variant="outline"
            size="sm"
            className="mt-5"
            disabled={createWorkflow.isPending}
          >
            <Plus className="size-3.5 mr-1.5" />
            Create workflow
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {workflows.data.map((workflow) => (
          <Link
            href={`/dashboard/workflows/${workflow.id}`}
            prefetch
            key={workflow.id}
          >
            <Card
              key={workflow.id}
              size="sm"
              className={cn({
                "opacity-30":
                  removeWorkflow.isPending &&
                  removeWorkflow.variables?.id === workflow.id,
              })}
            >
              <CardHeader>
                <CardTitle className="capitalize line-clamp-1">
                  {workflow.name}
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Created {formatDate(new Date(workflow.createdAt))}
                </CardDescription>
                <CardAction>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveWorkflow(workflow.id);
                        }}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardAction>
              </CardHeader>
            </Card>
          </Link>
        ))}
        </div>
      )}
    </EntityContainer>
  );
}

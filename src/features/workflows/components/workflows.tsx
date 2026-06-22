"use client";
import { generateSlug } from "random-word-slugs";

import { MoreHorizontal, Trash2 } from "lucide-react";
import {
  useCreateWorkflow,
  useRemoveWorkflow,
  useSuspenseWorkflows,
} from "../hooks/use-worflows";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function WorkflowsList() {
  const workflows = useSuspenseWorkflows();
  const removeWorkflow = useRemoveWorkflow();
  const createWorkflow = useCreateWorkflow();
  const router = useRouter();
  // if (workflows.data.length === 0) {
  //   return (
  //     <Card size="sm" className="py-12">
  //       <CardContent className="text-center text-muted-foreground">
  //         No workflows yet. Create your first one.
  //       </CardContent>
  //     </Card>
  //   );
  // }

  const handleCreateWorkflow = () => {
    createWorkflow.mutate(
      { name: generateSlug(3) },
      {
        onSuccess: (data) => {
          router.push(`/dashboard/workflows/${data.id}`);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create workflow");
        },
      },
    );
  };
  return (
    <EntityContainer
      header={
        <EntityHeader
          title="Workflows"
          newButtonLabel="New Workflow"
          onNew={handleCreateWorkflow}
          isCreating={createWorkflow.isPending}
        />
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {workflows.data.map((workflow) => (
          <Card
            key={workflow.id}
            size="sm"
            className={cn({ "opacity-30": removeWorkflow.isPending })}
          >
            <CardHeader>
              <CardTitle>{workflow.name}</CardTitle>
              <CardDescription>
                Created {new Date(workflow.createdAt).toLocaleDateString()}
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
                      onClick={() => removeWorkflow.mutate({ id: workflow.id })}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </div>
    </EntityContainer>
  );
}

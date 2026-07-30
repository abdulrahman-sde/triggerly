"use client";

import { Play } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { EntityContainer } from "@/components/shared/entity-container";
import { EntityHeader } from "@/components/shared/entity-header";
import { cn } from "@/lib/utils";

import { useSuspenseExecutions } from "../hooks/use-executions";
import { ExecutionStatus } from "@/generated/prisma/enums";

const statusMeta: Record<
  ExecutionStatus,
  { label: string; dot: string }
> = {
  [ExecutionStatus.PENDING]: {
    label: "Pending",
    dot: "bg-yellow-500",
  },
  [ExecutionStatus.RUNNING]: {
    label: "Running",
    dot: "bg-blue-500",
  },
  [ExecutionStatus.SUCCESS]: {
    label: "Success",
    dot: "bg-emerald-500",
  },
  [ExecutionStatus.FAILED]: {
    label: "Failed",
    dot: "bg-red-500",
  },
};

export default function ExecutionsList({
  description,
}: {
  description?: string;
}) {
  const executions = useSuspenseExecutions();

  return (
    <EntityContainer
      header={
        <EntityHeader
          title="Executions"
          description={description}
        />
      }
    >
      {executions.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent ring-1 ring-primary/10">
            <Play className="size-7 text-primary/60" />
          </div>
          <p className="text-sm font-medium text-foreground/70">
            No executions yet
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground/60 max-w-xs">
            Run a workflow to see its execution history here.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {executions.data.map((execution) => {
            const meta = statusMeta[execution.status];

            return (
              <Card
                key={execution.id}
                size="sm"
                className={cn(
                  "relative overflow-hidden transition-all duration-200",
                  "hover:-translate-y-0.5 hover:shadow-md",
                )}
              >
                <CardHeader>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="truncate">
                      {execution.workflow.name}
                    </CardTitle>
                    <CardDescription>
                      <span className="mt-0.5 inline-flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5">
                          <span className={cn("size-1.5 rounded-full", meta.dot)} />
                          <span className="text-[11px] font-medium">
                            {meta.label}
                          </span>
                        </span>
                        <span className="text-[11px] text-muted-foreground/50">
                          {new Date(execution.startedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </span>
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}
    </EntityContainer>
  );
}

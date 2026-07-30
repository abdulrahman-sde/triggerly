import WorkflowsSkeleton from "@/components/loaders/workflows-skeleton";
import WorkflowsList from "@/features/workflows/components/workflows";

import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/shared/error-fallback";

export const dynamic = "force-dynamic";

export default function Workflows() {
  prefetchWorkflows();
  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={
          <ErrorFallback
            title="Failed to load workflows"
            description="Could not load your workflows. Please try again later."
          />
        }
      >
        <Suspense fallback={<WorkflowsSkeleton />}>
          <WorkflowsList description="Create, edit, and manage your automation workflows." />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

import WorkflowsSkeleton from "@/components/loaders/workflows-skeleton";
import WorkflowsList from "@/features/workflows/components/workflows";

import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const dynamic = "force-dynamic";

export default function Workflows() {
  prefetchWorkflows();
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Failed to load workflows.</div>}>
        <Suspense fallback={<WorkflowsSkeleton />}>
          <WorkflowsList />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

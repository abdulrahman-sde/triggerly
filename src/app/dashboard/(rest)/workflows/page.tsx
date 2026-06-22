import WorkflowsList from "@/features/workflows/components/workflows";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
export default async function Workflows() {
  await requireAuth();
  prefetchWorkflows();
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Failed to load workflows.</div>}>
        <Suspense fallback={<div>Loading workflows...</div>}>
          <WorkflowsList />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

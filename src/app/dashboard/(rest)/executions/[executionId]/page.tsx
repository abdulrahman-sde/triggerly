import { prefetchExecution } from "@/features/executions/server/prefetch";
import ExecutionDetails from "@/features/executions/components/execution-details";
import ExecutionDetailsSkeleton from "@/components/loaders/execution-details-skeleton";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/shared/error-fallback";

export const dynamic = "force-dynamic";

export default async function ExecutionDetailsPage({
  params,
}: {
  params: Promise<{ executionId: string }>;
}) {
  const { executionId } = await params;
  prefetchExecution(executionId);

  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={
          <ErrorFallback
            title="Failed to load execution"
            description="Could not load this execution. Please try again later."
          />
        }
      >
        <Suspense fallback={<ExecutionDetailsSkeleton />}>
          <ExecutionDetails executionId={executionId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

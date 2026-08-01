import ExecutionsList from "@/features/executions/components/executions-list";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/shared/error-fallback";
import { prefetchExecutions } from "@/features/executions/server/prefetch";
import ExecutionsListSkeleton from "@/components/loaders/executions-list-skeleton";
export const dynamic = "force-dynamic";
export default function Executions() {
  prefetchExecutions();
  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={
          <ErrorFallback
            title="Failed to load executions"
            description="Could not load your executions. Please try again later."
          />
        }
      >
        <Suspense fallback={<ExecutionsListSkeleton />}>
          <ExecutionsList description="View and manage the executions of your workflows." />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

import ExecutionsList from "@/features/executions/components/executions-list";
import { prefetchExecutions } from "@/features/executions/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/shared/error-fallback";

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
        <Suspense fallback={<div>Loading executions...</div>}>
          <ExecutionsList description="View the execution history of your workflows." />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

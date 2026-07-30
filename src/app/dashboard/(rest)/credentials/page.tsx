import WorkflowsSkeleton from "@/components/loaders/workflows-skeleton";
import CredentialsList from "@/features/credentials/components/credentials";
import { prefetchCredentials } from "@/features/credentials/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/shared/error-fallback";
 
export const dynamic = "force-dynamic";
 
export default function Credentials() {
  prefetchCredentials();
  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={
          <ErrorFallback
            title="Failed to load credentials"
            description="Could not load your credentials. Please try again later."
          />
        }
      >
        <Suspense fallback={<WorkflowsSkeleton />}>
          <CredentialsList description="Manage API keys and authentication for external services." />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

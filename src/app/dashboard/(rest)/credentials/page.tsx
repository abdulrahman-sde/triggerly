import WorkflowsSkeleton from "@/components/loaders/workflows-skeleton";
import CredentialsList from "@/features/credentials/components/credentials";
import { prefetchCredentials } from "@/features/credentials/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const dynamic = "force-dynamic";

export default function Credentials() {
  prefetchCredentials();
  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-sm font-medium text-destructive">
              Failed to load credentials
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60">
              Please try again later.
            </p>
          </div>
        }
      >
        <Suspense fallback={<WorkflowsSkeleton />}>
          <CredentialsList />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

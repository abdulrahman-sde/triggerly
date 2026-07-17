import WorkflowsSkeleton from "@/components/loaders/workflows-skeleton";
import CredentialsList from "@/features/credentials/components/credentials";
import { prefetchCredentials } from "@/features/credentials/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function Credentials() {
  prefetchCredentials();
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Failed to load credentials.</div>}>
        <Suspense fallback={<WorkflowsSkeleton />}>
          <CredentialsList />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

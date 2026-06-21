import { EntityContainer } from "@/components/shared/entity-container";
import { EntityHeader } from "@/components/shared/entity-header";
import WorkflowsList from "@/features/workflows/components/workflows-list";
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
          <EntityContainer
            header={
              <EntityHeader
                title="Workflows"
                newButtonLabel="New Workflow"
                newButtonHref="/workflow/new"
              />
            }
          >
            <WorkflowsList />
          </EntityContainer>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

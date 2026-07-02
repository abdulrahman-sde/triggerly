import EditorHeader from "@/features/editor/components/editor-header";
import Editor from "@/features/editor/components/workflow-editor";
import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import WorkflowEditorSkeleton from "@/components/loaders/workflow-editor-skeleton";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function WorkflowEditor({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const { workflowId } = await params;
  prefetchWorkflow(workflowId);
  return (
    <HydrateClient>
      <Suspense fallback={<WorkflowEditorSkeleton />}>
        <ErrorBoundary fallback={<div>Failed to load workflow editor.</div>}>
          <EditorHeader workflowId={workflowId} />
          <Editor workflowId={workflowId} />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
}

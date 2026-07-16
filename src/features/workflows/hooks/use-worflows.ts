"use client";
import { useWorkflowRun } from "@/store/workflow-run";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();
  console.log("client side workflows fetching");

  return useSuspenseQuery(trpc.workflows.getAll.queryOptions());
};

export const useSuspenseWorkflow = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
};
export const useRemoveWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation(
    trpc.workflows.delete.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(trpc.workflows.getAll.queryOptions());

        toast.success("Workflow deleted");
      },
      onError: (ctx) => {
        toast.error(ctx.message || "Failed to delete workflow");
      },
    }),
  );
};

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: () => {
        toast.dismiss();
        queryClient.invalidateQueries(trpc.workflows.getAll.queryOptions());

        toast.success("New Workflow created");
      },
      onError: (ctx) => {
        toast.dismiss();
        toast.error(ctx.message || "Failed to create workflow");
      },
    }),
  );
};

export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation(
    trpc.workflows.update.mutationOptions({
      onSuccess: (_, variables) => {
        toast.dismiss();
        queryClient.invalidateQueries(trpc.workflows.getAll.queryOptions());
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({ id: variables.id }),
        );
        toast.success("Workflow saved");
      },
      onError: (err) => {
        toast.dismiss();
        toast.error(err.message || "Failed to save workflow");
      },
    }),
  );
};

export const useUpdateName = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.updateName.mutationOptions({
      onSuccess: (data, variables) => {
        toast.dismiss();
        queryClient.invalidateQueries(trpc.workflows.getAll.queryOptions());
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({ id: variables.id }),
        );
      },
      onError: (err) => {
        toast.dismiss();
        toast.error(err.message || "Failed to update workflow name");
      },
    }),
  );
};

export const useExecuteWorkflow = () => {
  const trpc = useTRPC();
  return useMutation(
    trpc.workflows.execute.mutationOptions({
      onMutate: () => {
        useWorkflowRun.getState().setRunId(null); // <-- this is "how you get the runId on the frontend"
      },
      onSuccess: (data, input) => {
        useWorkflowRun.getState().setRunId(data.runId); // <-- this is "how you get the runId on the frontend"

        toast.success(data.message || "Workflow execution started");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to execute workflow");
      },
    }),
  );
};

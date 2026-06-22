"use client";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.workflows.getAll.queryOptions());
};

export const useRemoveWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation(
    trpc.workflows.delete.mutationOptions({
      onSuccess: () => {
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
        queryClient.invalidateQueries(trpc.workflows.getAll.queryOptions());
        toast.success("New Workflow created");
      },
      onError: (ctx) => {
        toast.error(ctx.message || "Failed to create workflow");
      },
    }),
  );
};

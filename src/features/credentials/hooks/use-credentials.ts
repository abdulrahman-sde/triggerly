"use client";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useSuspenseCredentials = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.credentials.getAll.queryOptions());
};

export const useRemoveCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation(
    trpc.credentials.delete.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(trpc.credentials.getAll.queryOptions());

        toast.success("Credential deleted");
      },
      onError: (ctx) => {
        toast.error(ctx.message || "Failed to delete credential");
      },
    }),
  );
};

export const useCreateCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: () => {
        toast.dismiss();
        queryClient.invalidateQueries(trpc.credentials.getAll.queryOptions());

        toast.success("New Credential created");
      },
      onError: (ctx) => {
        toast.dismiss();
        toast.error(ctx.message || "Failed to create credential");
      },
    }),
  );
};

export const useUpdateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: (data, variables) => {
        toast.dismiss();
        queryClient.invalidateQueries(trpc.credentials.getAll.queryOptions());
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryOptions({ id: variables.id }),
        );
        toast.success("Credential updated");
      },
      onError: (err) => {
        toast.dismiss();
        toast.error(err.message || "Failed to update credential");
      },
    }),
  );
};

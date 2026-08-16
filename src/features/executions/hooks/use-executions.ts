"use client";
import { useTRPC } from "@/trpc/client";
import { keepPreviousData, useSuspenseQuery } from "@tanstack/react-query";

export const useSuspenseExecutions = (page: number) => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.executions.getAll.queryOptions(
      { page },
      { placeholderData: keepPreviousData },
    ),
  );
};

export const useSuspenseExecution = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.executions.getOne.queryOptions({ id }));
};

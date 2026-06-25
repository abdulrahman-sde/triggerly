import type { inferInput } from "@trpc/tanstack-react-query";
import { trpc, prefetch } from "@/trpc/server";
type Input = inferInput<typeof trpc.workflows.getAll>;

export function prefetchWorkflows(input?: Input) {
  return prefetch(trpc.workflows.getAll.queryOptions(input));
}

export const prefetchWorkflow = (id: string) => {
  return prefetch(trpc.workflows.getOne.queryOptions({ id }));
};

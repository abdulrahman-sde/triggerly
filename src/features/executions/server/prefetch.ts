import { trpc, prefetch } from "@/trpc/server";

export function prefetchExecutions() {
  return prefetch(trpc.executions.getAll.queryOptions());
}

export function prefetchExecution(id: string) {
  return prefetch(trpc.executions.getOne.queryOptions({ id }));
}

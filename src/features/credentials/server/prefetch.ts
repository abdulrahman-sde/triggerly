import type { inferInput } from "@trpc/tanstack-react-query";
import { trpc, prefetch } from "@/trpc/server";
type Input = inferInput<typeof trpc.credentials.getAll>;

export function prefetchCredentials(input?: Input) {
  return prefetch(trpc.credentials.getAll.queryOptions(input));
}


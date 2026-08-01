import { trpc, prefetch } from "@/trpc/server";

export function prefetchCredentials() {
  return prefetch(trpc.credentials.getAll.queryOptions());
}

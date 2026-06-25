import { Skeleton } from "../ui/skeleton";

export function WorkflowsSkeleton() {
  return (
    <div className="p-2 h-full">
      <div className="mx-auto max-w-7xl w-full flex flex-col gap-y-8 h-full">
        <div className="flex flex-row items-center justify-between gap-x-4">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

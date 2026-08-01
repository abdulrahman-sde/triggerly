import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ExecutionDetailsSkeleton() {
  return (
    <div className="flex h-full flex-col gap-6">
      <Skeleton className="h-4 w-28" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>
        <Skeleton className="h-3.5 w-40" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="gap-2 px-4 py-3.5">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-4 w-24" />
          </Card>
        ))}
      </div>
      <Card className="flex flex-col gap-5 p-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-44" />
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="mt-1 size-5 rounded-full" />
              <Skeleton className="h-12 flex-1 rounded-lg" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

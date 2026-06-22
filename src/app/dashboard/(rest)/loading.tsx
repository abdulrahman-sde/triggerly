import { Skeleton } from "@/components/ui/skeleton"

function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="size-7 shrink-0 rounded-md" />
      </div>
      <Skeleton className="h-4 w-24" />
    </div>
  )
}

export default function DashboardLoading() {
  return (
    <div className="p-2 h-full">
      <div className="mx-auto max-w-screen-xl w-full flex flex-col gap-y-8 h-full">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

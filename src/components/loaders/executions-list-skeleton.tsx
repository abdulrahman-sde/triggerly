import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { EntityContainer } from "@/components/shared/entity-container";

function CardSkeleton() {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-36" />
        </CardTitle>
        <CardDescription>
          <div className="mt-1 flex justify-between items-center gap-2">
            <span className="inline-flex items-center gap-1.5">
              <Skeleton className="size-1.5 rounded-full" />
              <Skeleton className="h-3 w-12" />
            </span>
            <Skeleton className="h-3 w-20" />
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export default function ExecutionsListSkeleton() {
  return (
    <EntityContainer
      header={
        <div className="flex flex-row items-center justify-between gap-x-4">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-3.5 w-48" />
          </div>
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </EntityContainer>
  );
}

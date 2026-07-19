import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { EntityContainer } from "@/components/shared/entity-container";

function CardSkeleton() {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-32" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-24" />
        </CardDescription>
        <CardAction>
          <Skeleton className="size-7 rounded-md" />
        </CardAction>
      </CardHeader>
    </Card>
  );
}

export default function WorkflowsSkeleton() {
  return (
    <EntityContainer
      header={
        <div className="flex flex-row items-center justify-between gap-x-4">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-3.5 w-48" />
          </div>
          <Skeleton className="h-8 w-32 rounded-md" />
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

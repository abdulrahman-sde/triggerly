import Link from "next/link";
import { Button } from "../ui/button";
import { Plus, Loader } from "reicon-react";
import { toast } from "sonner";

type EntityHeaderProps = {
  title: string;
  description?: string;
  newButtonLabel?: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { newButtonHref: string; onNew?: never }
  | { onNew?: never; newButtonHref?: never }
);

export const EntityHeader = ({
  title,
  description,
  onNew,
  newButtonHref,
  newButtonLabel,
  disabled,
  isCreating,
}: EntityHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between gap-x-4">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
        {description && (
          <p className="text-xs md:text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {onNew && !newButtonHref && (
        <Button
          disabled={isCreating || disabled}
          className="h-8 px-2.5"
          onClick={onNew}
        >
          {isCreating ? (
            <>
              <Loader size={24} weight="Filled" className="animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus size={24} weight="Filled" />
              {newButtonLabel}
            </>
          )}
        </Button>
      )}
      {newButtonHref && !onNew && (
        <Button size="sm" asChild>
          <Link href={newButtonHref} prefetch>
            <Plus className="size-4" />
            {newButtonLabel}
          </Link>
        </Button>
      )}
    </div>
  );
};

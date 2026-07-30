"use client";

import { FallbackProps } from "react-error-boundary";
import { Button } from "../ui/button";

type ErrorFallbackProps = {
  title?: string;
  description?: string;
};

export const ErrorFallback = ({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again later.",
  error,
  resetErrorBoundary,
}: ErrorFallbackProps & Partial<FallbackProps>) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-sm font-medium text-destructive">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground/60">{description}</p>
      {error ? (
        <p className="mt-2 max-w-md text-xs text-muted-foreground/40">
          {(error as Error).message}
        </p>
      ) : null}
      {resetErrorBoundary && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => resetErrorBoundary()}
        >
          Try again
        </Button>
      )}
    </div>
  );
};

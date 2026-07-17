import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 text-sm text-foreground transition-all outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/50 hover:border-border/80 hover:bg-secondary/50 disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-50 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

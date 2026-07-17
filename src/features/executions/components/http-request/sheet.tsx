"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

const methodTheme: Record<string, { bg: string; text: string; ring: string }> =
  {
    GET: {
      bg: "bg-green-500/8",
      text: "text-green-600",
      ring: "ring-green-500/25",
    },
    POST: {
      bg: "bg-blue-500/8",
      text: "text-blue-600",
      ring: "ring-blue-500/25",
    },
    PUT: {
      bg: "bg-orange-500/8",
      text: "text-orange-600",
      ring: "ring-orange-500/25",
    },
    PATCH: {
      bg: "bg-violet-500/8",
      text: "text-violet-600",
      ring: "ring-violet-500/25",
    },
    DELETE: {
      bg: "bg-red-500/8",
      text: "text-red-600",
      ring: "ring-red-500/25",
    },
  };

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, "Variable name is required")
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {
      message:
        "Variable name must start with a letter or underscore and can only contain letters, numbers, and underscores",
    }),
  endpoint: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  method: z.enum(METHODS),
  body: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function HttpRequestSheet({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FormValues) => void;
  defaultValues?: Partial<FormValues>;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      method: "GET",
      endpoint: "",
      variableName: "",
      body: "",
      ...defaultValues,
    },
  });

  const method = form.watch("method");
  const showBody = method === "POST" || method === "PUT" || method === "PATCH";

  useEffect(() => {
    if (open) {
      form.reset({
        method: "GET",
        endpoint: "",
        variableName: "",
        body: "",
        ...defaultValues,
      });
    }
  }, [open, defaultValues, form]);

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values);
    onOpenChange(false);
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-80 border-l border-border/40 p-0 rounded-l-2xl bg-gradient-to-b from-background via-background to-secondary/20 shadow-2xl backdrop-blur-2xl">
        <SheetHeader className="px-5 pt-6 pb-4 border-b border-border/40 bg-gradient-to-r from-transparent via-primary/[0.02] to-transparent">
          <SheetTitle className="text-base tracking-tight">HTTPS Request</SheetTitle>
          <p className="text-xs text-muted-foreground/70 mt-1 leading-relaxed">
            Send an HTTP request and store the response for later steps.
          </p>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <div className="flex flex-col gap-6 px-5 pt-5 pb-5 overflow-y-auto">
            <div className="grid gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary/60" />
                <p className="text-xs font-medium text-foreground/80">Variable name</p>
              </div>
              <Input
                placeholder="responseData"
                className="h-8.5 px-3 text-[12px]"
                {...form.register("variableName")}
              />
              <p className="text-xs text-muted-foreground/60 pl-1">
                Use <code className="text-xs text-foreground/70 font-mono bg-secondary/40 px-1 py-0.5 rounded">{`{{variableName.httpResponse.data}}`}</code> in later steps to reference the response.
              </p>
              {form.formState.errors.variableName && (
                <p className="text-xs text-destructive pl-1">
                  {form.formState.errors.variableName.message}
                </p>
              )}
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                <p className="text-xs font-medium text-foreground/80">Method</p>
              </div>
              <div className="grid grid-cols-5 gap-1.5 bg-secondary/10 rounded-xl p-1">
                {METHODS.map((m) => {
                  const theme = methodTheme[m];
                  const selected = method === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => form.setValue("method", m)}
                      className={cn(
                        "rounded-lg py-1.5 text-xs font-medium transition-all duration-150",
                        selected
                          ? `${theme.bg} ${theme.text} ring-1 ${theme.ring}`
                          : "text-muted-foreground/40 hover:text-muted-foreground hover:bg-secondary/30",
                      )}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground/60 pl-1">
                Choose the HTTP method for this request.
              </p>
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                <p className="text-xs font-medium text-foreground/80">Endpoint</p>
              </div>
              <Input
                placeholder="https://api.example.com/data"
                className="h-8.5 px-3 text-[12px]"
                {...form.register("endpoint")}
              />
              <p className="text-xs text-muted-foreground/60 pl-1">
                Supports <code className="text-xs text-foreground/70 font-mono bg-secondary/40 px-1 py-0.5 rounded">{`{{variable}}`}</code> templating.
              </p>
              {form.formState.errors.endpoint && (
                <p className="text-xs text-destructive pl-1">
                  {form.formState.errors.endpoint.message}
                </p>
              )}
            </div>

            {showBody && (
              <div className="grid gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                  <p className="text-xs font-medium text-foreground/80">Body</p>
                </div>
                <Textarea
                  placeholder='{"key": "value"}'
                  className="bg-input/30 px-3 text-[12px]"
                  {...form.register("body")}
                />
                <p className="text-xs text-muted-foreground/60 pl-1">
                  Supports <code className="text-xs text-foreground/70 font-mono bg-secondary/40 px-1 py-0.5 rounded">{`{{variable}}`}</code> templating.
                </p>
              </div>
            )}
          </div>

          <div className="mt-auto px-5 py-4 border-t border-border/40 bg-gradient-to-b from-transparent to-secondary/10">
            <Button type="submit" className="w-full">
              Save
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

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

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, "Variable name is required")
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {
      message:
        "Variable name must start with a letter or underscore and can only contain letters, numbers, and underscores",
    }),
  baseURL: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  apiKey: z.string().optional(),
  model: z.string().optional(),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().optional(),
});

export type OpenAICompatibleFormValues = z.infer<typeof formSchema>;

export default function OpenAICompatibleSheet({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: OpenAICompatibleFormValues) => void;
  defaultValues?: Partial<OpenAICompatibleFormValues>;
}) {
  const defaults = {
    variableName: defaultValues?.variableName ?? "",
    baseURL: defaultValues?.baseURL ?? "https://integrate.api.nvidia.com/v1",
    apiKey: defaultValues?.apiKey ?? "",
    model: defaultValues?.model ?? "nvidia/llama-3.1-nemotron-nano-8b-v1",
    systemPrompt: defaultValues?.systemPrompt ?? "",
    userPrompt: defaultValues?.userPrompt ?? "",
  };

  const form = useForm<OpenAICompatibleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaults,
  });

  useEffect(() => {
    if (open) {
      form.reset(defaults);
    }
  }, [open, defaultValues, form]);

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values);
    onOpenChange(false);
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-80 border-l overflow-auto border-border/40 p-0 rounded-l-2xl bg-gradient-to-b from-background via-background to-secondary/20 shadow-2xl backdrop-blur-2xl">
        <SheetHeader className="px-5 pt-6 pb-4 border-b border-border/40 bg-gradient-to-r from-transparent via-primary/[0.02] to-transparent">
          <SheetTitle className="text-base tracking-tight">
            OpenAI Compatible
          </SheetTitle>
          <p className="text-xs text-muted-foreground/70 mt-1 leading-relaxed">
            Run a prompt against any OpenAI-compatible API and store the result.
          </p>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <div className="mx-5 mt-4 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700 leading-relaxed">
            Defaults to NIM using{" "}
            <code className="text-[11px] font-mono bg-blue-100/60 px-1 rounded">
              NIM_API_KEY
            </code>
            . Fill in custom values to override.
          </div>
          <div className="flex flex-col gap-6 px-5 pt-5 pb-5 overflow-y-auto">
            <div className="grid gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary/60" />
                <p className="text-xs font-medium text-foreground/80">
                  Variable name
                </p>
              </div>
              <Input
                placeholder="aiResult"
                className="h-8.5 px-3 text-[12px]"
                {...form.register("variableName")}
              />
              <p className="text-xs text-muted-foreground/60 pl-1">
                Use{" "}
                <code className="text-xs text-foreground/70 font-mono bg-secondary/40 px-1 py-0.5 rounded">{`{{variableName}}`}</code>{" "}
                in later steps.
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
                <p className="text-xs font-medium text-foreground/80">
                  Base URL
                </p>
              </div>
              <Input
                placeholder="https://api.openai.com/v1"
                className="h-8.5 px-3 text-[12px]"
                {...form.register("baseURL")}
              />
              {form.formState.errors.baseURL && (
                <p className="text-xs text-destructive pl-1">
                  {form.formState.errors.baseURL.message}
                </p>
              )}
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                <p className="text-xs font-medium text-foreground/80">
                  API Key
                </p>
              </div>
              <Input
                type="password"
                placeholder="sk-..."
                className="h-8.5 px-3 text-[12px]"
                {...form.register("apiKey")}
              />
              {form.formState.errors.apiKey && (
                <p className="text-xs text-destructive pl-1">
                  {form.formState.errors.apiKey.message}
                </p>
              )}
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                <p className="text-xs font-medium text-foreground/80">Model</p>
              </div>
              <Input
                placeholder="gpt-4o"
                className="h-8.5 px-3 text-[12px]"
                {...form.register("model")}
              />
              {form.formState.errors.model && (
                <p className="text-xs text-destructive pl-1">
                  {form.formState.errors.model.message}
                </p>
              )}
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                <p className="text-xs font-medium text-foreground/80">
                  System prompt
                </p>
              </div>
              <Textarea
                placeholder="You are a helpful assistant..."
                className="bg-input/30 px-3 text-[12px]"
                {...form.register("systemPrompt")}
              />
              <p className="text-xs text-muted-foreground/60 pl-1">
                Instructions to set the behavior of the model.
              </p>
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                <p className="text-xs font-medium text-foreground/80">
                  User prompt
                </p>
              </div>
              <Textarea
                placeholder="Summarize the data: {{previousVar}}"
                className="bg-input/30 px-3 text-[12px]"
                {...form.register("userPrompt")}
              />
              <p className="text-xs text-muted-foreground/60 pl-1">
                Supports{" "}
                <code className="text-xs text-foreground/70 font-mono bg-secondary/40 px-1 py-0.5 rounded">{`{{variable}}`}</code>{" "}
                templating.
              </p>
            </div>
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

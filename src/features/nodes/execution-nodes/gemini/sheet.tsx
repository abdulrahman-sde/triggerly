"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { CredentialType } from "@/generated/prisma/enums";
import { useSuspenseCredentials } from "@/features/credentials/hooks/use-credentials";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

const AVAILABLE_MODELS = [
  "gemini-3.5-flash",
  "gemini-2.5-pro",
  "gemini-3-flash-preview",
] as const;

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, "Variable name is required")
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {
      message:
        "Variable name must start with a letter or underscore and can only contain letters, numbers, and underscores",
    }),
  credentialId: z.string().optional(),
  apiKey: z.string().optional(),
  model: z.enum(AVAILABLE_MODELS).optional(),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().optional(),
});

export type GeminiFormValues = z.infer<typeof formSchema>;

export default function GeminiSheet({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: GeminiFormValues) => void;
  defaultValues?: Partial<GeminiFormValues>;
}) {
  const router = useRouter();
  const { data: credentials } = useSuspenseCredentials();
  const geminiCredentials = credentials.filter(
    (c) => c.type === CredentialType.GEMINI,
  );

  const defaults = {
    variableName: defaultValues?.variableName ?? "",
    credentialId: defaultValues?.credentialId ?? "",
    apiKey: defaultValues?.apiKey ?? "",
    model: defaultValues?.model ?? "gemini-3.5-flash",
    systemPrompt: defaultValues?.systemPrompt ?? "",
    userPrompt: defaultValues?.userPrompt ?? "",
  };

  const form = useForm<GeminiFormValues>({
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
      <SheetContent className="w-80 border-l border-border/40 p-0 rounded-l-2xl bg-gradient-to-b from-background via-background to-secondary/20 shadow-2xl backdrop-blur-2xl">
        <SheetHeader className="px-5 pt-6 pb-4 border-b border-border/40 bg-gradient-to-r from-transparent via-primary/[0.02] to-transparent">
          <SheetTitle className="text-base tracking-tight">
            AI Action
          </SheetTitle>
          <p className="text-xs text-muted-foreground/70 mt-1 leading-relaxed">
            Run a prompt against a Gemini model and store the result.
          </p>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 min-h-0 flex-col">
          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 pt-5 pb-5">
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
                <span className="size-1.5 rounded-full bg-primary/60" />
                <p className="text-xs font-medium text-foreground/80">
                  Credential
                </p>
              </div>
              <Select
                value={form.watch("credentialId") || ""}
                onValueChange={(id) => {
                  if (id === "__manage__") {
                    router.push("/dashboard/credentials");
                    return;
                  }
                  const cred = geminiCredentials.find((c) => c.id === id);
                  if (cred) {
                    form.setValue("credentialId", cred.id);
                    form.setValue("apiKey", cred.value);
                  }
                }}
              >
                <SelectTrigger size="sm" className="h-8.5 px-3 text-[12px]">
                  <SelectValue
                    placeholder={
                      geminiCredentials.length > 0
                        ? "Select credential..."
                        : "No credentials saved"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {geminiCredentials.length === 0 ? (
                    <SelectItem value="__manage__">Add credential →</SelectItem>
                  ) : (
                    <>
                      {geminiCredentials.map((cred) => (
                        <SelectItem key={cred.id} value={cred.id}>
                          {cred.name}
                        </SelectItem>
                      ))}
                      <SelectSeparator />
                      <SelectItem value="__manage__">
                        Manage credentials
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              <input type="hidden" {...form.register("apiKey")} />
              {form.watch("credentialId") && (
                <p className="text-xs text-muted-foreground/60 pl-1">
                  Using{" "}
                  <span className="font-medium text-foreground/70">
                    {
                      geminiCredentials.find(
                        (c) => c.id === form.watch("credentialId"),
                      )?.name
                    }
                  </span>
                </p>
              )}
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                <p className="text-xs font-medium text-foreground/80">Model</p>
              </div>
              <div className="grid grid-cols-3 gap-1.5 bg-secondary/10 rounded-xl p-1">
                {AVAILABLE_MODELS.map((m) => {
                  const selected = form.watch("model") === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => form.setValue("model", m)}
                      className={cn(
                        "rounded-lg py-1.5 text-xs font-medium transition-all duration-150",
                        selected
                          ? "bg-violet-500/10 text-violet-600"
                          : "text-muted-foreground/40 hover:text-muted-foreground hover:bg-secondary/30",
                      )}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground/60 pl-1">
                Choose the Gemini model version.
              </p>
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

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
  baseURL: z.string().optional(),
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
  const router = useRouter();
  const { data: credentials } = useSuspenseCredentials();
  const openaiCredentials = credentials.filter(
    (c) => c.type === CredentialType.OPENAI_COMPATIBLE,
  );

  const defaults = {
    variableName: defaultValues?.variableName ?? "",
    credentialId: defaultValues?.credentialId ?? "",
    apiKey: defaultValues?.apiKey ?? "",
    baseURL: defaultValues?.baseURL ?? "",
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
      <SheetContent className="w-80 border-l border-border/40 p-0 gap-0 rounded-l-2xl bg-gradient-to-b from-background via-background to-secondary/20 shadow-2xl backdrop-blur-2xl">
        <SheetHeader className="px-5 pt-6 pb-4 border-b border-border/40 bg-gradient-to-r from-transparent via-primary/[0.02] to-transparent">
          <SheetTitle className="text-base tracking-tight">
            OpenAI Compatible
          </SheetTitle>
          <p className="text-xs text-muted-foreground/70 mt-1 leading-relaxed">
            Run a prompt against any OpenAI-compatible API and store the result.
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
                  const cred = openaiCredentials.find((c) => c.id === id);
                  if (cred) {
                    form.setValue("credentialId", cred.id);
                    form.setValue("apiKey", cred.value);
                    if (cred.baseURL) form.setValue("baseURL", cred.baseURL);
                  }
                }}
              >
                <SelectTrigger size="sm" className="h-8.5 px-3 text-[12px]">
                  <SelectValue placeholder={openaiCredentials.length > 0 ? "Select credential..." : "No credentials saved"} />
                </SelectTrigger>
                <SelectContent>
                  {openaiCredentials.length === 0 ? (
                    <SelectItem value="__manage__">
                      Add credential →
                    </SelectItem>
                  ) : (
                    <>
                      {openaiCredentials.map((cred) => (
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
                    {openaiCredentials.find((c) => c.id === form.watch("credentialId"))?.name}
                  </span>
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

            <div>
              <p className="text-[11px] font-semibold text-foreground/50 uppercase mb-3">
                Quick Guide
              </p>
              <ol className="space-y-2.5">
                {[
                  "Save your provider's API key & base URL as a credential",
                  "Select the credential for this node",
                  "Specify the model name your provider uses",
                  "Write your prompt using {{variable}} templating",
                ].map((step, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 text-xs text-muted-foreground/60"
                  >
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-500">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
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

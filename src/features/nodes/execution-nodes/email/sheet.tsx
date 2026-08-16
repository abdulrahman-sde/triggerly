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
import {
  VariableDefinitionHint,
  VariableReferenceHint,
} from "@/components/shared/variable-hints";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, "Variable name is required")
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {
      message:
        "Variable name must start with a letter or underscore and can only contain letters, numbers, and underscores",
    }),
  credentialId: z.string().optional(),
  from: z.string().min(1, "From address is required"),
  to: z.string().min(1, "Recipient is required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().optional(),
});

export type EmailFormValues = z.infer<typeof formSchema>;

export default function EmailSheet({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Partial<EmailFormValues>) => void;
  defaultValues?: Partial<EmailFormValues>;
}) {
  const router = useRouter();
  const { data: credentials } = useSuspenseCredentials();
  const resendCredentials = credentials.filter(
    (c) => c.type === CredentialType.RESEND,
  );

  const defaults = {
    variableName: defaultValues?.variableName ?? "",
    credentialId: defaultValues?.credentialId ?? "",
    from: defaultValues?.from ?? "",
    to: defaultValues?.to ?? "",
    subject: defaultValues?.subject ?? "",
    body: defaultValues?.body ?? "",
  };

  const form = useForm<EmailFormValues>({
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
            Send Email
          </SheetTitle>
          <p className="text-xs text-muted-foreground/70 mt-1 leading-relaxed">
            Send an email via the Resend API.
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
                placeholder="emailResult"
                className="h-8.5 px-3 text-[12px]"
                {...form.register("variableName")}
              />
              <VariableDefinitionHint
                name={form.watch("variableName") ?? ""}
                path="id"
              />
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
                  const cred = resendCredentials.find((c) => c.id === id);
                  if (cred) {
                    form.setValue("credentialId", cred.id);
                  }
                }}
              >
                <SelectTrigger size="sm" className="h-8.5 px-3 text-[12px]">
                  <SelectValue
                    placeholder={
                      resendCredentials.length > 0
                        ? "Select credential..."
                        : "No credentials saved"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {resendCredentials.length === 0 ? (
                    <SelectItem value="__manage__">
                      Add credential →
                    </SelectItem>
                  ) : (
                    <>
                      {resendCredentials.map((cred) => (
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
              {form.watch("credentialId") && (
                <p className="text-xs text-muted-foreground/60 pl-1">
                  Using{" "}
                  <span className="font-medium text-foreground/70">
                    {
                      resendCredentials.find(
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
                <p className="text-xs font-medium text-foreground/80">
                  From
                </p>
              </div>
              <Input
                placeholder="noreply@yourdomain.com"
                className="h-8.5 px-3 text-[12px]"
                {...form.register("from")}
              />
              <p className="text-xs text-muted-foreground/60 pl-1">
                Must match a verified domain in your Resend account.
              </p>
              <VariableReferenceHint />
              {form.formState.errors.from && (
                <p className="text-xs text-destructive pl-1">
                  {form.formState.errors.from.message}
                </p>
              )}
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                <p className="text-xs font-medium text-foreground/80">
                  To
                </p>
              </div>
              <Input
                placeholder="user@example.com"
                className="h-8.5 px-3 text-[12px]"
                {...form.register("to")}
              />
              <p className="text-xs text-muted-foreground/60 pl-1">
                Recipient email address, comma-separated for multiple.
              </p>
              <VariableReferenceHint />
              {form.formState.errors.to && (
                <p className="text-xs text-destructive pl-1">
                  {form.formState.errors.to.message}
                </p>
              )}
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                <p className="text-xs font-medium text-foreground/80">
                  Subject
                </p>
              </div>
              <Input
                placeholder="Hello from Triggerly!"
                className="h-8.5 px-3 text-[12px]"
                {...form.register("subject")}
              />
              <VariableReferenceHint />
              {form.formState.errors.subject && (
                <p className="text-xs text-destructive pl-1">
                  {form.formState.errors.subject.message}
                </p>
              )}
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                <p className="text-xs font-medium text-foreground/80">
                  Body
                </p>
              </div>
              <Textarea
                placeholder="Hi {{name}},\n\nWelcome to Triggerly!"
                className="h-24 px-3 text-[12px] resize-none"
                {...form.register("body")}
              />
              <p className="text-xs text-muted-foreground/60 pl-1">
                Plain text email body.
              </p>
              <VariableReferenceHint />
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
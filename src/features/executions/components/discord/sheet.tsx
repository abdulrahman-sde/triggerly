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
  webhookUrl: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Webhook URL is required"),
  username: z.string().optional(),
  content: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function DiscordSheet({
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
      webhookUrl: "",
      variableName: "",
      username: "",
      content: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        webhookUrl: "",
        variableName: "",
        username: "",
        content: "",
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
          <SheetTitle className="text-base tracking-tight">
            Discord Webhook
          </SheetTitle>
          <p className="text-xs text-muted-foreground/70 mt-1 leading-relaxed">
            Send a message to a Discord channel via webhook.
          </p>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <div className="flex flex-col gap-6 px-5 pt-5 pb-5 overflow-y-auto">
            <div className="grid gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary/60" />
                <p className="text-xs font-medium text-foreground/80">
                  Variable name
                </p>
              </div>
              <Input
                placeholder="discordResult"
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
                  Webhook URL
                </p>
              </div>
              <Input
                placeholder="https://discord.com/api/webhooks/..."
                className="h-8.5 px-3 text-[12px]"
                {...form.register("webhookUrl")}
              />
              {form.formState.errors.webhookUrl && (
                <p className="text-xs text-destructive pl-1">
                  {form.formState.errors.webhookUrl.message}
                </p>
              )}
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                <p className="text-xs font-medium text-foreground/80">
                  Username
                </p>
              </div>
              <Input
                placeholder="My Bot"
                className="h-8.5 px-3 text-[12px]"
                {...form.register("username")}
              />
              <p className="text-xs text-muted-foreground/60 pl-1">
                Override the webhook&apos;s default username (optional).
              </p>
            </div>
          </div>

          <div className="grid gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-muted-foreground/40" />
              <p className="text-xs font-medium text-foreground/80">
                Message
              </p>
            </div>
            <Textarea
              placeholder="Hello @everyone!"
              className="h-20 px-3 text-[12px] resize-none"
              {...form.register("content")}
            />
            <p className="text-xs text-muted-foreground/60 pl-1">
              Message content sent to the channel (optional).
            </p>
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

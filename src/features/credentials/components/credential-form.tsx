"use client";

import { CredentialType } from "@/generated/prisma/enums";
import {
  useCreateCredential,
  useUpdateCredential,
} from "../hooks/use-credentials";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader, KeyRound, ShieldCheck, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.nativeEnum(CredentialType),
  value: z.string().min(1, "API key is required"),
  baseURL: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CredentialFormProps {
  initialData?: {
    id?: string;
    name: string;
    type: CredentialType;
    value: string;
    baseURL?: string;
  };
  onSuccess?: () => void;
}

const PROVIDERS: {
  value: CredentialType;
  label: string;
  icon: string;
}[] = [
  {
    value: CredentialType.GEMINI,
    label: "Gemini",
    icon: "/assets/icons/gemini.svg",
  },
  {
    value: CredentialType.OPENAI_COMPATIBLE,
    label: "OpenAI Compatible",
    icon: "/assets/icons/openai.svg",
  },
];

const providerGuides: Record<
  CredentialType,
  { heading: string; steps: string[] }
> = {
  [CredentialType.GEMINI]: {
    heading: "Google Gemini API",
    steps: [
      "Go to Google AI Studio",
      'Click "Get API Key"',
      "Create a new key or copy an existing one",
      "Paste it below and give it a name",
    ],
  },
  [CredentialType.OPENAI_COMPATIBLE]: {
    heading: "OpenAI Compatible",
    steps: [
      "Visit your provider's API dashboard",
      "Generate a new API key",
      "Copy the key and paste it below",
      "Enter your provider's API base URL",
    ],
  },
};

export default function CredentialForm({
  initialData,
  onSuccess,
}: CredentialFormProps) {
  const createCredential = useCreateCredential();
  const updateCredential = useUpdateCredential();
  const [showKey, setShowKey] = useState(false);

  const isEdit = !!initialData?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      type: CredentialType.GEMINI,
      value: "",
      baseURL: "",
    },
  });

  const selectedType = form.watch("type");
  const guide = providerGuides[selectedType];

  const onSubmit = form.handleSubmit((values) => {
    const onSettled = () => {
      form.reset();
      onSuccess?.();
    };

    if (isEdit && initialData?.id) {
      updateCredential.mutate({ id: initialData.id, ...values }, { onSettled });
    } else {
      createCredential.mutate(values, { onSettled });
    }
  });

  const isPending = createCredential.isPending || updateCredential.isPending;

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="pb-0">
        <SheetTitle>{isEdit ? "Edit credential" : "New credential"}</SheetTitle>
        <SheetDescription>
          {isEdit
            ? "Update your API key or credential details securely."
            : "Connect an API key to allow your workflows to call external AI models."}
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <form id="credential-form" onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="text-[11px] font-semibold  text-foreground/70 uppercase "
            >
              Name
            </label>
            <Input
              id="name"
              autoComplete="off"
              placeholder="e.g. My Gemini Key\u2026"
              spellCheck={false}
              className="h-8.5 px-3 text-[12px]"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="type"
              className="text-[11px] font-semibold  text-foreground/70 uppercase "
            >
              Provider
            </label>
            <Select
              value={form.watch("type")}
              onValueChange={(value) =>
                form.setValue("type", value as CredentialType, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
                {PROVIDERS.map((provider) => (
                  <SelectItem key={provider.value} value={provider.value}>
                    <span className="flex items-center gap-2 ">
                      <Image
                        src={provider.icon}
                        alt=""
                        width={14}
                        height={14}
                        className="object-contain"
                        aria-hidden="true"
                      />
                      {provider.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.type && (
              <p className="text-xs text-destructive">
                {form.formState.errors.type.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="value"
              className="text-[11px] font-semibold  text-foreground/70 uppercase "
            >
              API Key
            </label>
            <div className="relative">
              <Input
                id="value"
                type={showKey ? "text" : "password"}
                autoComplete="new-password"
                placeholder={
                  isEdit
                    ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                    : "sk-\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                }
                spellCheck={false}
                className="h-8.5 px-3 pr-10 text-[12px]"
                {...form.register("value")}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute  right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label={showKey ? "Hide API key" : "Show API key"}
                tabIndex={-1}
              >
                {showKey ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {form.formState.errors.value && (
              <p className="text-xs text-destructive">
                {form.formState.errors.value.message}
              </p>
            )}
          </div>

          {selectedType === CredentialType.OPENAI_COMPATIBLE && (
            <div className="space-y-1.5">
              <label
                htmlFor="baseURL"
                className="text-[11px] font-semibold text-foreground/70 uppercase"
              >
                Base URL
              </label>
              <Input
                id="baseURL"
                autoComplete="off"
                placeholder="https://api.openai.com/v1"
                spellCheck={false}
                className="h-8.5 px-3 text-[12px]"
                {...form.register("baseURL")}
              />
            </div>
          )}
        </form>

        <div>
          <p className="text-[11px] font-semibold  text-foreground/50 uppercase  mb-3">
            Quick Guide
          </p>

          {guide && (
            <ol className="space-y-2.5">
              {guide.steps.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-xs text-muted-foreground/60"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded text-[9px] font-bold",
                      selectedType === CredentialType.GEMINI
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-emerald-500/10 text-emerald-500",
                    )}
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          )}
        </div>

        <hr className="border-border/50" />

        <div className="flex items-start gap-2.5">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
          <p className="text-xs text-muted-foreground/50 leading-relaxed">
            All secret keys are encrypted at rest using AES-256-GCM. Once saved,
            keys are masked in the UI and never exposed in clear text again.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t p-4">
        <Button type="submit" form="credential-form" disabled={isPending}>
          {isPending && <Loader className="mr-1.5 size-3.5 animate-spin" />}
          {isEdit ? "Save changes" : "Create credential"}
        </Button>
        <SheetClose asChild>
          <Button
            type="button"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
        </SheetClose>
      </div>
    </div>
  );
}

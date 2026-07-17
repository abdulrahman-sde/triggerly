"use client";

import { CredentialType } from "@/generated/prisma/enums";
import { useRouter } from "next/navigation";
import {
  useCreateCredential,
  useUpdateCredential,
  useSuspenseCredential,
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
import { ArrowLeft, Loader } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { EntityContainer } from "@/components/shared/entity-container";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.nativeEnum(CredentialType),
  value: z.string().min(1, "API key is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface CredentialFormProps {
  initialData?: {
    id?: string;
    name: string;
    type: CredentialType;
    value: string;
  };
}

const PROVIDERS: {
  value: CredentialType;
  label: string;
  icon: string;
  iconBg: string;
}[] = [
  {
    value: CredentialType.GEMINI,
    label: "Gemini",
    icon: "/assets/icons/gemini.svg",
    iconBg: "bg-blue-500/10",
  },
  {
    value: CredentialType.OPENAI_COMPATIBLE,
    label: "OpenAI Compatible",
    icon: "/assets/icons/openai-compatible.svg",
    iconBg: "bg-emerald-500/10",
  },
];

function ProviderIcon({
  type,
  size = 14,
}: {
  type: CredentialType;
  size?: number;
}) {
  const provider = PROVIDERS.find((p) => p.value === type);
  if (!provider) return null;
  return (
    <span
      className={`inline-flex items-center justify-center rounded ${provider.iconBg}`}
      style={{ width: size + 8, height: size + 8 }}
    >
      <Image
        src={provider.icon}
        alt={provider.label}
        width={size}
        height={size}
        className="object-contain"
      />
    </span>
  );
}

export default function CredentialForm({ initialData }: CredentialFormProps) {
  const router = useRouter();
  const createCredential = useCreateCredential();
  const updateCredential = useUpdateCredential();

  const isEdit = !!initialData?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      type: CredentialType.GEMINI,
      value: "",
    },
  });

  const selectedType = form.watch("type");

  const onSubmit = form.handleSubmit((values) => {
    if (isEdit && initialData?.id) {
      updateCredential.mutate({ id: initialData.id, ...values });
    } else {
      createCredential.mutate(values);
    }
  });

  const isPending =
    createCredential.isPending || updateCredential.isPending;

  return (
    <EntityContainer
      header={
        <div className="flex flex-col gap-y-1.5">
          <Link
            href="/dashboard/credentials"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/60 transition-colors hover:text-foreground w-fit mb-2"
          >
            <ArrowLeft className="size-3.5" />
            Back to Credentials
          </Link>
          <h1 className="text-xl font-semibold tracking-tight">
            {isEdit ? "Edit credential" : "New credential"}
          </h1>
          <p className="text-xs text-muted-foreground/75 leading-relaxed">
            {isEdit
              ? "Update your API key or credential details securely."
              : "Connect an API key to allow your workflows to call external AI models."}
          </p>
        </div>
      }
    >
      <div className="grid gap-8 lg:grid-cols-5 items-start">
        {/* Form Column */}
        <form onSubmit={onSubmit} className="lg:col-span-3 space-y-6">
          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
              Name
            </label>
            <Input
              id="name"
              autoComplete="off"
              placeholder="e.g. My Gemini Key"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Provider */}
          <div className="space-y-1.5">
            <label htmlFor="type" className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
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
                <span className="flex items-center gap-2 min-w-0">
                  <ProviderIcon type={selectedType} size={13} />
                  <SelectValue placeholder="Select a provider" />
                </span>
              </SelectTrigger>
              <SelectContent>
                {PROVIDERS.map((provider) => (
                  <SelectItem key={provider.value} value={provider.value}>
                    <span className="flex items-center gap-2">
                      <span
                        className={`inline-flex size-5 items-center justify-center rounded ${provider.iconBg}`}
                      >
                        <Image
                          src={provider.icon}
                          alt={provider.label}
                          width={12}
                          height={12}
                          className="object-contain"
                        />
                      </span>
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

          {/* API key */}
          <div className="space-y-1.5">
            <label htmlFor="value" className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
              API Key
            </label>
            <Input
              id="value"
              type="password"
              autoComplete="new-password"
              placeholder="sk-••••••••••••••••"
              {...form.register("value")}
            />
            {form.formState.errors.value && (
              <p className="text-xs text-destructive">
                {form.formState.errors.value.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader className="mr-1.5 size-3.5 animate-spin" />}
              {isEdit ? "Save changes" : "Create credential"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Documentation/Guide Side panel */}
        <div className="lg:col-span-2 space-y-5 rounded-xl border border-border/40 bg-secondary/15 p-5">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-1">
              Guide & Safety
            </h2>
            <p className="text-xs text-muted-foreground/70 leading-relaxed">
              Ensure you configure the correct API keys for node integration.
            </p>
          </div>

          <div className="space-y-4 pt-1">
            <div className="space-y-1">
              <h3 className="text-xs font-medium text-foreground">
                Google Gemini API
              </h3>
              <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
                Obtain your Gemini API key from Google AI Studio. It allows your workflows to execute nodes running model prompts.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-medium text-foreground">
                OpenAI Compatible
              </h3>
              <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
                For custom endpoints, self-hosted LLMs, or alternative providers like OpenRouter or DeepSeek. Key details are protected here, base URLs are set at the node layer.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-medium text-foreground">
                Security & Encryption
              </h3>
              <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
                All secret keys are encrypted at rest using AES-256-GCM. Once saved, keys are masked in the UI and never exposed in clear text again.
              </p>
            </div>
          </div>
        </div>
      </div>
    </EntityContainer>
  );
}

export const CredentialView = ({
  credentialId,
}: {
  credentialId: string;
}) => {
  const { data: credential } = useSuspenseCredential(credentialId);
  return <CredentialForm initialData={credential} />;
};

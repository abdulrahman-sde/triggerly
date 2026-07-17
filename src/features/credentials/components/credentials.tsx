"use client";

import { Trash2, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EntityContainer } from "@/components/shared/entity-container";
import { EntityHeader } from "@/components/shared/entity-header";
import { cn } from "@/lib/utils";

import Image from "next/image";
import Link from "next/link";
import {
  useRemoveCredential,
  useSuspenseCredentials,
} from "../hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";

const providerMeta: Record<
  CredentialType,
  { label: string; icon: string; iconBg: string }
> = {
  [CredentialType.GEMINI]: {
    label: "Gemini",
    icon: "/assets/icons/gemini.svg",
    iconBg: "bg-blue-500/10",
  },
  [CredentialType.OPENAI_COMPATIBLE]: {
    label: "OpenAI Compatible",
    icon: "/assets/icons/openai-compatible.svg",
    iconBg: "bg-emerald-500/10",
  },
};

export default function CredentialsList() {
  const credentials = useSuspenseCredentials();
  const removeCredential = useRemoveCredential();

  return (
    <EntityContainer
      header={
        <EntityHeader
          title="Credentials"
          newButtonLabel="New Credential"
          newButtonHref={"/dashboard/credentials/new"}
        />
      }
    >
      {credentials.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-xl border border-border/50 bg-secondary/40">
            <svg
              className="size-5 text-muted-foreground/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground/70">No credentials yet</p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            Add an API key to use with your workflows.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/40 rounded-xl border border-border/40 overflow-hidden">
          {credentials.data.map((credential) => {
            const meta = providerMeta[credential.type] ?? {
              label: credential.type,
              icon: "/assets/icons/openai-compatible.svg",
              iconBg: "bg-secondary/60",
            };
            const isPendingDelete =
              removeCredential.isPending &&
              removeCredential.variables?.id === credential.id;

            return (
              <div
                key={credential.id}
                className={cn(
                  "group relative flex items-center gap-4 px-4 py-3.5 transition-colors duration-150",
                  "hover:bg-secondary/30",
                  isPendingDelete && "pointer-events-none opacity-30",
                )}
              >
                {/* Provider icon */}
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    meta.iconBg,
                  )}
                >
                  <Image
                    src={meta.icon}
                    alt={meta.label}
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                </div>

                {/* Name + meta */}
                <Link
                  href={`/dashboard/credentials/${credential.id}`}
                  prefetch
                  className="min-w-0 flex-1"
                >
                  <p className="truncate text-sm font-medium text-foreground leading-none">
                    {credential.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/60">
                    {meta.label} ·{" "}
                    {new Date(credential.createdAt).toLocaleDateString(
                      undefined,
                      { month: "short", day: "numeric", year: "numeric" },
                    )}
                  </p>
                </Link>

                {/* Actions (fade in on hover) */}
                <div className="flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive/60 hover:text-destructive hover:bg-destructive/8"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCredential.mutate({ id: credential.id });
                    }}
                    aria-label="Delete credential"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                  <Link
                    href={`/dashboard/credentials/${credential.id}`}
                    prefetch
                    className="flex size-7 items-center justify-center rounded-md text-muted-foreground/50 transition-colors hover:text-foreground"
                  >
                    <ChevronRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </EntityContainer>
  );
}

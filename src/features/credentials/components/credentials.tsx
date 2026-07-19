"use client";

import { useState } from "react";
import { MoreHorizontal, Trash2, KeyRound, Plus } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { EntityContainer } from "@/components/shared/entity-container";
import { EntityHeader } from "@/components/shared/entity-header";
import { cn } from "@/lib/utils";

import {
  useRemoveCredential,
  useSuspenseCredentials,
} from "../hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";
import CredentialForm from "./credential-form";

type EditingCredential = {
  id: string;
  name: string;
  type: CredentialType;
  value: string;
};

const providerMeta: Record<
  CredentialType,
  { label: string; icon: string; gradient: string }
> = {
  [CredentialType.GEMINI]: {
    label: "Gemini",
    icon: "/assets/icons/gemini.svg",
    gradient: "from-blue-500/20 via-blue-500/10 to-transparent",
  },
  [CredentialType.OPENAI_COMPATIBLE]: {
    label: "OpenAI Compatible",
    icon: "/assets/icons/openai-compatible.svg",
    gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent",
  },
};

export default function CredentialsList({ description }: { description?: string }) {
  const credentials = useSuspenseCredentials();
  const removeCredential = useRemoveCredential();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingCredential, setEditingCredential] =
    useState<EditingCredential | null>(null);

  const openCreate = () => {
    setEditingCredential(null);
    setSheetOpen(true);
  };

  const openEdit = (credential: EditingCredential) => {
    setEditingCredential(credential);
    setSheetOpen(true);
  };

  const closeSheet = () => {
    setSheetOpen(false);
    setEditingCredential(null);
  };

  return (
    <>
      <EntityContainer
        header={
          <EntityHeader
            title="Credentials"
            description={description}
            newButtonLabel="New Credential"
            onNew={openCreate}
          />
        }
      >
        {credentials.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent ring-1 ring-primary/10">
              <KeyRound className="size-7 text-primary/60" />
            </div>
            <p className="text-sm font-medium text-foreground/70">
              No credentials yet
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground/60 max-w-xs">
              Add an API key to connect your workflows to external AI models and
              services.
            </p>
            <Button
              onClick={openCreate}
              variant="outline"
              size="sm"
              className="mt-5"
            >
              <Plus className="size-3.5 mr-1.5" />
              Add credential
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {credentials.data.map((credential) => {
              const meta = providerMeta[credential.type] ?? {
                label: credential.type,
                icon: "/assets/icons/openai-compatible.svg",
                gradient: "from-secondary/40 to-transparent",
              };
              const isPendingDelete =
                removeCredential.isPending &&
                removeCredential.variables?.id === credential.id;

              return (
                <div
                  key={credential.id}
                  onClick={() => openEdit(credential)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      openEdit(credential);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className={cn(
                    "group block w-full text-left focus-visible:outline-none",
                    isPendingDelete && "pointer-events-none opacity-30",
                  )}
                >
                  <Card
                    size="sm"
                    className={cn(
                      "relative overflow-hidden transition-all duration-200 cursor-pointer",
                      "hover:-translate-y-0.5 hover:shadow-md",
                      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    )}
                  >
                    <div
                      className={cn(
                        "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-200",
                        meta.gradient,
                        "group-hover:opacity-100",
                      )}
                      aria-hidden="true"
                    />
                    <CardHeader>
                      <div className="min-w-0 flex-1">
                          <CardTitle className="truncate">
                            {credential.name}
                          </CardTitle>
                          <CardDescription>
                            <span className="mt-0.5 inline-flex items-center gap-1.5">
                              <span
                                className={cn(
                                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                                  credential.type === CredentialType.GEMINI
                                    ? "bg-blue-500/10 text-blue-500"
                                    : "bg-emerald-500/10 text-emerald-500",
                                )}
                              >
                                {meta.label}
                              </span>
                              <span className="text-[11px] text-muted-foreground/50">
                                {new Date(
                                  credential.createdAt,
                                ).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </span>
                          </CardDescription>
                        </div>
                      <CardAction>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Credential actions"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenuItem
                              className="gap-2 text-destructive focus:text-destructive"
                              onClick={() =>
                                removeCredential.mutate({
                                  id: credential.id,
                                })
                              }
                            >
                              <Trash2 className="size-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardAction>
                    </CardHeader>
                  </Card>
                </div>
            );
          })}
        </div>
        )}
      </EntityContainer>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="flex flex-col p-0 w-full sm:max-w-lg">
          <CredentialForm
            initialData={
              editingCredential
                ? {
                    id: editingCredential.id,
                    name: editingCredential.name,
                    type: editingCredential.type,
                    value: editingCredential.value,
                  }
                : undefined
            }
            onSuccess={closeSheet}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}

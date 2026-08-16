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
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { extractSpreadsheetId } from "./range-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import {
  VariableDefinitionHint,
  VariableReferenceHint,
} from "@/components/shared/variable-hints";

const OPERATION_VALUES = ["append", "read"] as const;

const OPERATIONS = [
  { value: "append", label: "Append row" },
  { value: "read", label: "Read values" },
] as const;

export type GoogleSheetsOperation = (typeof OPERATION_VALUES)[number];

const TAB_NAME =
  "[A-Za-z0-9_.-]+(?: [A-Za-z0-9_.-]+)*|'[^']*'";
const GRID_CELL = "[A-Za-z]{1,3}[0-9]*|[0-9]+";
const GRID_RANGE = `(?:${GRID_CELL})(?::(?:${GRID_CELL})?)?`;
const rangePattern = new RegExp(
  `^${TAB_NAME}(?:!(?:${GRID_RANGE}))?$|^${GRID_RANGE}$`,
);

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, "Variable name is required")
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {
      message:
        "Variable name must start with a letter or underscore and can only contain letters, numbers, and underscores",
    }),
  credentialId: z.string().optional(),
  spreadsheetUrl: z
    .string()
    .min(1, "Spreadsheet ID or URL is required"),
  operation: z.enum(OPERATION_VALUES),
  range: z
    .string()
    .min(1, "Range is required")
    .superRefine((value, ctx) => {
      if (!rangePattern.test(value.trim())) {
        ctx.addIssue({
          code: "custom",
          message:
            "Invalid range. Use a tab name (e.g. Sheet1), a cell (Sheet1!A1), or a rectangle (Sheet1!A1:D10).",
        });
      }
    }),
  values: z.string().optional(),
});

export type GoogleSheetsFormValues = z.infer<typeof formSchema>;

export default function GoogleSheetsSheet({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Partial<GoogleSheetsFormValues>) => void;
  defaultValues?: Partial<GoogleSheetsFormValues>;
}) {
  const router = useRouter();
  const trpc = useTRPC();
  const { data: credentials } = useSuspenseCredentials();
  const sheetsCredentials = credentials.filter(
    (c) => c.type === CredentialType.GOOGLE_SERVICE_ACCOUNT,
  );

  const defaults = {
    variableName: defaultValues?.variableName ?? "",
    credentialId: defaultValues?.credentialId ?? "",
    spreadsheetUrl: defaultValues?.spreadsheetUrl ?? "",
    operation: defaultValues?.operation ?? ("append" as GoogleSheetsOperation),
    range: defaultValues?.range ?? "Sheet1!A1",
    values: defaultValues?.values ?? "",
  };

  const form = useForm<GoogleSheetsFormValues>({
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

  const credentialId = form.watch("credentialId");
  const { data: serviceAccountEmail } = useQuery(
    trpc.credentials.getServiceAccountEmail.queryOptions(
      { id: credentialId ?? "" },
      { enabled: !!credentialId },
    ),
  );

  const [copied, setCopied] = useState(false);
  const handleCopyEmail = async () => {
    if (!serviceAccountEmail) return;
    await navigator.clipboard.writeText(serviceAccountEmail);
    setCopied(true);
    toast.success("Service account email copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const operation = form.watch("operation");
  const spreadsheetUrl = form.watch("spreadsheetUrl") ?? "";
  const spreadsheetId = extractSpreadsheetId(spreadsheetUrl);

  const { data: tabsData, isFetching: tabsLoading } = useQuery(
    trpc.googleSheets.getTabs.queryOptions(
      { credentialId: credentialId ?? "", spreadsheetUrl },
      { enabled: !!credentialId && !!spreadsheetId },
    ),
  );

  const tabs = tabsData?.ok ? tabsData.tabs : [];
  const currentRange = form.watch("range") ?? "";
  const currentTab = currentRange.includes("!")
    ? currentRange.split("!")[0]
    : currentRange;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-80 border-l border-border/40 p-0 rounded-l-2xl bg-gradient-to-b from-background via-background to-secondary/20 shadow-2xl backdrop-blur-2xl">
        <SheetHeader className="px-5 pt-6 pb-4 border-b border-border/40 bg-gradient-to-r from-transparent via-primary/[0.02] to-transparent">
          <SheetTitle className="text-base tracking-tight">
            Google Sheets
          </SheetTitle>
          <p className="text-xs text-muted-foreground/70 mt-1 leading-relaxed">
            Append or read values in a Google Spreadsheet.
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
                placeholder="sheetResult"
                className="h-8.5 px-3 text-[12px]"
                {...form.register("variableName")}
              />
              <VariableDefinitionHint
                name={form.watch("variableName") ?? ""}
                path={operation === "read" ? "values" : "updatedRange"}
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
                  const cred = sheetsCredentials.find((c) => c.id === id);
                  if (cred) {
                    form.setValue("credentialId", cred.id);
                  }
                }}
              >
                <SelectTrigger size="sm" className="h-8.5 px-3 text-[12px]">
                  <SelectValue
                    placeholder={
                      sheetsCredentials.length > 0
                        ? "Select credential..."
                        : "No credentials saved"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {sheetsCredentials.length === 0 ? (
                    <SelectItem value="__manage__">
                      Add credential →
                    </SelectItem>
                  ) : (
                    <>
                      {sheetsCredentials.map((cred) => (
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
                      sheetsCredentials.find(
                        (c) => c.id === form.watch("credentialId"),
                      )?.name
                    }
                  </span>
                </p>
              )}
              {serviceAccountEmail && (
                <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/15 px-2.5 py-2">
                  <p className="min-w-0 flex-1 text-[11px] leading-snug text-muted-foreground/80">
                    Share your sheet with
                    <span className="mt-0.5 block truncate font-mono text-[11px] text-foreground/80">
                      {serviceAccountEmail}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label="Copy service account email"
                    className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    {copied ? (
                      <Check className="size-3.5 text-green-500" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                <p className="text-xs font-medium text-foreground/80">
                  Spreadsheet
                </p>
              </div>
              <Input
                placeholder="https://docs.google.com/spreadsheets/d/... or the ID"
                className="h-8.5 px-3 text-[12px]"
                {...form.register("spreadsheetUrl")}
              />
              <p className="text-xs text-muted-foreground/60 pl-1">
                Paste the spreadsheet URL or its ID. Private sheets must be
                shared with your service account email (above) as Editor.
              </p>
              <VariableReferenceHint />
              {form.formState.errors.spreadsheetUrl && (
                <p className="text-xs text-destructive pl-1">
                  {form.formState.errors.spreadsheetUrl.message}
                </p>
              )}
            </div>

            {!!credentialId && !!spreadsheetId && (
              <div className="grid gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                  <p className="text-xs font-medium text-foreground/80">
                    Tab
                  </p>
                </div>
                <Select
                  value={currentTab}
                  onValueChange={(tab) => {
                    form.setValue(
                      "range",
                      operation === "read" ? tab : `${tab}!A1`,
                      { shouldValidate: true },
                    );
                  }}
                >
                  <SelectTrigger size="sm" className="h-8.5 px-3 text-[12px]">
                    <SelectValue
                      placeholder={
                        tabs.length > 0
                          ? "Select a tab..."
                          : "No tabs found"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {tabs.map((tab) => (
                      <SelectItem key={tab} value={tab}>
                        {tab}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {tabsLoading && (
                  <p className="text-xs text-muted-foreground/60 pl-1">
                    Loading tabs…
                  </p>
                )}
                {tabsData?.ok === false && (
                  <p className="text-xs text-destructive pl-1">
                    {tabsData.error}
                  </p>
                )}
                {tabs.length > 0 && (
                  <p className="text-xs text-muted-foreground/60 pl-1">
                    Picking a tab fills the Range below — read: just the tab
                    name (all data), append: tab!A1.
                  </p>
                )}
              </div>
            )}

            <div className="grid gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                <p className="text-xs font-medium text-foreground/80">
                  Operation
                </p>
              </div>
              <div className="grid grid-cols-2 gap-1.5 bg-secondary/10 rounded-xl p-1">
                {OPERATIONS.map((op) => {
                  const selected = form.watch("operation") === op.value;
                  return (
                    <button
                      key={op.value}
                      type="button"
                      onClick={() => form.setValue("operation", op.value)}
                      className={cn(
                        "rounded-lg py-1.5 text-xs font-medium transition-all duration-150",
                        selected
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "text-muted-foreground/40 hover:text-muted-foreground hover:bg-secondary/30",
                      )}
                    >
                      {op.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                <p className="text-xs font-medium text-foreground/80">
                  Range
                </p>
              </div>
              <Input
                placeholder={
                  operation === "read"
                    ? "Sheet1 (tab name only reads all rows)"
                    : "Sheet1!A1"
                }
                className="h-8.5 px-3 text-[12px]"
                {...form.register("range")}
              />
              <p className="text-xs text-muted-foreground/60 pl-1">
                {operation === "read"
                  ? "Read all data: just the tab name (e.g. Sheet1). A cell (Sheet1!A1) or rectangle (Sheet1!A1:D1000) for a slice."
                  : "A1 notation, e.g. Sheet1!A1. Appending starts after the last used row."}
              </p>
              <VariableReferenceHint />
              {form.formState.errors.range && (
                <p className="text-xs text-destructive pl-1">
                  {form.formState.errors.range.message}
                </p>
              )}
            </div>

            {operation !== "read" && (
              <div className="grid gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                  <p className="text-xs font-medium text-foreground/80">
                    Row values
                  </p>
                </div>
                <Textarea
                  placeholder={
                    "One row per line, comma separated:\nJohn,{{orderEmail}},42"
                  }
                  className="min-h-24 bg-input/30 px-3 text-[12px] resize-none"
                  {...form.register("values")}
                />
                <p className="text-xs text-muted-foreground/60 pl-1">
                  Each line becomes a row; cells are comma separated.
                </p>
                <VariableReferenceHint />
                {form.formState.errors.values && (
                  <p className="text-xs text-destructive pl-1">
                    {form.formState.errors.values.message}
                  </p>
                )}
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
"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { generateGoogleFormScript } from "@/lib/google-form-script";

const steps = [
  "Open your Google Form → Script editor",
  "Paste this script and save",
  "Triggers → Add Trigger → On form submit → Save",
];

const variables = [
  ["{{googleForm.respondentEmail}}", "Respondent's email"],
  ["{{googleForm.responses['Question Name']}}", "Specific answer"],
  ["{{json googleForm.responses}}", "All responses"],
];

export default function GoogleFormSetupSheet({
  open,
  onOpenChange,
  webhookUrl,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  webhookUrl: string;
}) {
  const [copied, setCopied] = useState(false);

  const script = generateGoogleFormScript(webhookUrl);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(script);
    setCopied(true);
    toast.success("Script copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-80 border-l backdrop-blur-xl p-0 rounded-l-2xl">
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-border">
          <SheetTitle className="text-base">Google Form Trigger</SheetTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Connect a Google Form submission to start this workflow.
          </p>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-5 pt-4 pb-5 overflow-y-auto">
          <div>
            <p className="text-xs text-muted-foreground mb-3">Setup</p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="shrink-0 mt-0.5 flex size-5 items-center justify-center rounded bg-muted text-[10px] font-mono text-muted-foreground/60">
                  1
                </span>
                <div className="flex flex-col gap-2">
                  <p className="pt-px text-sm leading-snug text-muted-foreground">
                    Open your Google Form → Script editor
                  </p>
                  <Button
                    onClick={handleCopy}
                    size="sm"
                    variant="secondary"
                    className="w-fit gap-1.5 text-xs"
                  >
                    {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    {copied ? "Copied!" : "Copy Script"}
                  </Button>
                </div>
              </div>
              {steps.slice(1).map((step, i) => (
                <div key={step} className="flex gap-3">
                  <span className="shrink-0 mt-0.5 flex size-5 items-center justify-center rounded bg-muted text-[10px] font-mono text-muted-foreground/60">
                    {i + 2}
                  </span>
                  <p className="pt-px text-sm leading-snug text-muted-foreground">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-3">Variables</p>
            <div className="divide-y divide-border">
              {variables.map(([variable, description]) => (
                <div key={variable} className="py-2.5 first:pt-0 last:pb-0">
                  <code className="block font-mono text-xs text-foreground mb-0.5">
                    {variable}
                  </code>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

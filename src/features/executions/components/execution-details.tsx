"use client";

import { useState, type ReactNode } from "react";
import {
  Zap,
  Plus,
  Copy,
  ChevronDown,
  ChevronRight,
  Terminal,
  Box,
} from "lucide-react";
import Image from "next/image";
import { Pointer, GlobePointer } from "reicon-react";
import {
  differenceInMilliseconds,
  format,
  formatDuration as formatDurationDateFns,
  intervalToDuration,
} from "date-fns";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EntityContainer } from "@/components/shared/entity-container";
import { EntityHeader } from "@/components/shared/entity-header";
import { cn } from "@/lib/utils";
import { ExecutionStatus } from "@/generated/prisma/enums";
import { formatDate } from "@/utils/format-date";
import { useSuspenseExecution } from "../hooks/use-executions";

type ExecutionLog = {
  success: boolean;
  message: string;
  timestamp: string | Date;
};

const statusLabels: Record<ExecutionStatus, string> = {
  [ExecutionStatus.PENDING]: "Pending",
  [ExecutionStatus.RUNNING]: "Running",
  [ExecutionStatus.SUCCESS]: "Success",
  [ExecutionStatus.FAILED]: "Failed",
};

const nodeTypeNames: Record<string, string> = {
  INITIAL: "Initial Stage",
  MANUAL_TRIGGER: "Manual Trigger",
  HTTP_REQUEST: "HTTP Request",
  GOOGLE_FORM_TRIGGER: "Google Form Trigger",
  GEMINI: "Gemini",
  OPENAI_COMPATIBLE: "OpenAI Compatible",
  DISCORD: "Discord",
};

const nodeIcons: Record<string, ReactNode> = {
  INITIAL: <Plus className="size-4 text-gray-400" />,
  MANUAL_TRIGGER: (
    <Pointer className="size-4" color="#6366f1" weight="Filled" />
  ),
  HTTP_REQUEST: (
    <GlobePointer className="size-4" color="#b45309" weight="Filled" />
  ),
  GOOGLE_FORM_TRIGGER: (
    <Image
      src="/assets/icons/google-form.svg"
      alt=""
      width={16}
      height={16}
      className="size-4"
    />
  ),
  GEMINI: (
    <Image
      src="/assets/icons/gemini.svg"
      alt=""
      width={16}
      height={16}
      className="size-4"
    />
  ),
  OPENAI_COMPATIBLE: (
    <Image
      src="/assets/icons/openai.svg"
      alt=""
      width={16}
      height={16}
      className="size-4"
    />
  ),
  DISCORD: (
    <Image
      src="/assets/icons/discord.svg"
      alt=""
      width={16}
      height={16}
      className="size-4"
    />
  ),
};

const parseLog = (log: ExecutionLog) => {
  const match = Object.keys(nodeTypeNames).find((type) =>
    log.message.includes(`${type} node`),
  );
  if (!match) {
    return {
      title: log.message,
      detail: null,
      nodeType: "UNKNOWN",
      icon: <Box className="size-4 text-muted-foreground" />,
    };
  }
  const suffix = log.message.split(`${match} node`)[1]?.trim() || "";
  return {
    title: nodeTypeNames[match],
    detail:
      suffix || (log.success ? "Completed successfully" : "Execution failed"),
    nodeType: match,
    icon: nodeIcons[match],
  };
};

const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  return formatDurationDateFns(
    intervalToDuration({ start: 0, end: ms }),
    { format: ["minutes", "seconds"], delimiter: " " },
  );
};

export default function ExecutionDetails({
  executionId,
}: {
  executionId: string;
}) {
  const execution = useSuspenseExecution(executionId).data;

  const logs = Array.isArray(execution.logs)
    ? (execution.logs as ExecutionLog[])
    : [];

  const startedAt = new Date(execution.startedAt);

  const [expandedIndices, setExpandedIndices] = useState<
    Record<number, boolean>
  >({
    0: true, // First log expanded by default
  });
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const copyLogToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <EntityContainer
      header={
        <EntityHeader
          title={execution.workflow.name}
          description={`${statusLabels[execution.status]} · ${
            execution.runId
          } · Triggered ${formatDate(startedAt)}`}
        />
      }
    >
      {/* Execution Error */}
      {execution.error && (
        <Card className="flex items-start gap-3 border-destructive/40 bg-destructive/5 p-4">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <Zap className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-destructive">
              Execution failed
            </p>
            <p className="mt-0.5 break-all text-xs text-muted-foreground">
              {execution.error}
            </p>
          </div>
        </Card>
      )}

      {/* Execution Timeline */}
      {logs.length === 0 ? (
        <Card className="flex flex-col items-center justify-center border-dashed border-border bg-card py-14 text-center">
          <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Zap className="size-5" />
          </div>
          <p className="text-sm font-medium text-foreground">
            No execution logs recorded
          </p>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            Logs will appear here in chronological order as nodes execute.
          </p>
        </Card>
      ) : (
        <div className="max-h-[600px] overflow-y-auto pr-2 max-w-200">
          <div className="relative my-2 space-y-6 before:absolute before:left-3 before:h-full before:w-px before:bg-border">
            {logs.map((log, index) => {
              const parsed = parseLog(log);
              const isExpanded = !!expandedIndices[index];
              const prevTime =
                index === 0
                  ? startedAt
                  : new Date(logs[index - 1].timestamp);
              const nodeDuration = formatDuration(
                differenceInMilliseconds(
                  new Date(log.timestamp),
                  prevTime,
                ),
              );

              return (
                <div key={index} className="group/experience-position">
                  <div
                    onClick={() => toggleExpand(index)}
                    className={cn(
                      "relative block max-w-200 cursor-pointer select-none",
                      "before:absolute before:-top-1 before:-right-1 before:-bottom-1.5 before:left-7 before:rounded-lg hover:before:bg-muted/30",
                    )}
                  >
                    <div className="relative z-1 mb-1 flex items-start gap-1 text-base">
                      <div className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100/80 dark:bg-zinc-100">
                        {parsed.icon}
                      </div>

                      <h4 className="flex-1 pt-0.5 text-sm font-medium text-foreground">
                        {parsed.title}
                      </h4>

                      <div className="shrink-0 pt-0.5 text-muted-foreground">
                        {isExpanded ? (
                          <ChevronDown className="size-4" />
                        ) : (
                          <ChevronRight className="size-4" />
                        )}
                      </div>
                    </div>

                    <dl className="relative z-1 flex flex-wrap items-center gap-2 pl-7 text-xs text-muted-foreground">
                      <div>
                        <dt className="sr-only">Step</dt>
                        <dd className="tabular-nums">Step #{index + 1}</dd>
                      </div>
                      <Separator
                        orientation="vertical"
                        className="h-3.5 self-center"
                      />
                      <div>
                        <dt className="sr-only">Time</dt>
                        <dd className="font-mono tabular-nums">
                          {format(new Date(log.timestamp), "HH:mm:ss.SSS")}
                        </dd>
                      </div>
                      <Separator
                        orientation="vertical"
                        className="h-3.5 self-center"
                      />
                      <div>
                        <dt className="sr-only">Duration</dt>
                        <dd className="tabular-nums">{nodeDuration}</dd>
                      </div>
                      <Separator
                        orientation="vertical"
                        className="h-3.5 self-center"
                      />
                      <div>
                        <dt className="sr-only">Status</dt>
                        <dd
                          className={cn(
                            "font-medium",
                            log.success
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-destructive",
                          )}
                        >
                          {log.success ? "Success" : "Failed"}
                        </dd>
                      </div>
                      {parsed.detail && (
                        <>
                          <Separator
                            orientation="vertical"
                            className="h-3.5 self-center"
                          />
                          <dd className="truncate max-w-56">{parsed.detail}</dd>
                        </>
                      )}
                    </dl>
                  </div>

                  {/* Expandable Log Output */}
                  {isExpanded && (
                    <div className="pt-2 pl-7">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Terminal className="size-3.5" />
                          <span>Log Output</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyLogToClipboard(log.message, index);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Copy className="size-3" />
                          {copiedIndex === index ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <div className="mt-2 rounded-lg border border-border bg-muted p-3 font-mono text-xs text-foreground overflow-x-auto">
                        <pre className="whitespace-pre-wrap break-all leading-relaxed">
                          {log.message}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </EntityContainer>
  );
}

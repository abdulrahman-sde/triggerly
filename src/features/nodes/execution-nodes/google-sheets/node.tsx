"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import GoogleSheetsSheet, {
  GoogleSheetsOperation,
} from "./sheet";
import { BaseExecutionNode } from "../base-execution-node";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { useNodeStatus } from "../../hooks/use-node-status";
import { Table2 } from "lucide-react";

type GoogleSheetsNodeData = {
  variableName?: string;
  credentialId?: string;
  spreadsheetUrl?: string;
  operation?: GoogleSheetsOperation;
  range?: string;
  values?: string;
};

type GoogleSheetsNodeType = Node<GoogleSheetsNodeData>;

const operationLabels: Record<GoogleSheetsOperation, string> = {
  append: "Append row",
  read: "Read values",
};

export const GoogleSheetsNode = memo((props: NodeProps<GoogleSheetsNodeType>) => {
  const { updateNodeData } = useReactFlow();
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeData = props.data;

  const handleSubmit = (values: Partial<GoogleSheetsNodeData>) => {
    updateNodeData(props.id, values);
  };

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const { status } = useNodeStatus({ nodeId: props.id });

  const operation = nodeData?.operation ?? "append";
  const range = nodeData?.range ?? "Sheet1!A1";

  return (
    <>
      <GoogleSheetsSheet
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        chipLabel="Google Sheets"
        chipIcon={Table2}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        status={status ?? "initial"}
      >
        <div className="flex items-start gap-3 p-4">
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl",
              "bg-zinc-100/80 dark:bg-zinc-100",
            )}
          >
            <Image
              src="/assets/icons/google-sheets.svg"
              alt="Google Sheets"
              width={24}
              height={24}
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-medium leading-5 text-foreground">
              Google Sheets
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="inline-flex items-center rounded-sm bg-green-100/70 px-1.5 py-0.5 text-[10px] font-medium leading-none text-green-700 dark:bg-green-200">
                {operationLabels[operation]}
              </span>
              <span className="truncate text-sm leading-5 text-muted-foreground">
                {nodeData?.spreadsheetUrl
                  ? `${range}`
                  : "Not configured"}
              </span>
            </div>
          </div>
        </div>
      </BaseExecutionNode>
    </>
  );
});

GoogleSheetsNode.displayName = "GoogleSheetsNode";
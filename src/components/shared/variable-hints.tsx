"use client";

import type { ReactNode } from "react";

const codeClass =
  "text-xs text-foreground/70 font-mono bg-secondary/40 px-1 py-0.5 rounded";

export function VariableDefinitionHint({
  name,
  path,
}: {
  name: string;
  path: string;
}) {
  const example = `{{${name.trim() || "variableName"}.${path}}}`;
  return (
    <p className="text-xs text-muted-foreground/60 pl-1">
      Use <code className={codeClass}>{example}</code> in later steps to
      reference this output.
    </p>
  );
}

export function VariableReferenceHint({ children }: { children?: ReactNode }) {
  return (
    <p className="text-xs text-muted-foreground/60 pl-1">
      {children ?? (
        <>
          Insert <code className={codeClass}>{"{{varName}}"}</code> to use
          values from earlier steps.
        </>
      )}
    </p>
  );
}

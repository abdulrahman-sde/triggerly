"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BracesIcon } from "lucide-react";

type VariablePickerProps = {
  variables: { name: string; label: string }[];
  onInsert: (name: string) => void;
};

export function VariablePicker({ variables, onInsert }: VariablePickerProps) {
  if (variables.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="size-5 shrink-0 text-muted-foreground hover:text-foreground"
        >
          <BracesIcon className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuLabel className="text-xs font-medium">
          Variables
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {variables.map((v) => (
          <DropdownMenuItem
            key={v.name}
            onClick={() => onInsert(v.name)}
            className="font-mono text-xs"
          >
            {`{{${v.name}}}`}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

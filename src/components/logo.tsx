import { Workflow } from "lucide-react";
import { cn } from "../lib/utils";

// ─── Option 1: Two Connected Workflow Nodes ───────────────────────────────

export const Logo = ({
  className,
}: {
  className?: string;
  uniColor?: boolean;
}) => {
  return (
    <div>
      <LogoIcon className={cn("size-4", className)} />
      <p>Triggerly</p>
    </div>
  );
};

export const LogoIcon = ({ className }: { className?: string }) => {
  return <Workflow className={cn(className)} />;
};

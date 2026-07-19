import { EntityHeader } from "@/components/shared/entity-header";

export default function Executions() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <EntityHeader
        title="Executions"
        description="Monitor and review the history of all workflow runs."
      />
    </div>
  );
}

"use client";

import { useSuspenseWorkflows } from "../hooks/use-worflows";

export default function WorkflowsList() {
  const workflows = useSuspenseWorkflows();
  return (
    <div>
      {workflows.data.map((workflow) => (
        <div key={workflow.id}>{workflow.name + workflow.id}</div>
      ))}
    </div>
  );
}

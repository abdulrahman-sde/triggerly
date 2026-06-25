"use client";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-worflows";
import { useParams } from "next/navigation";

export default function Editor() {
  const params = useParams<{ workflowId: string }>();
  const { data } = useSuspenseWorkflow(params.workflowId);
  return <div>{data?.name}</div>;
}

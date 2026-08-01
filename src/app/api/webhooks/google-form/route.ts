import { workflowChannel } from "@/inngest/channels/workflow";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const workflowId = url.searchParams.get("workflowId");
  console.log("Received webhook request for workflowId:", workflowId);

  if (!workflowId) {
    return Response.json(
      { success: false, error: "Missing required query parameter: workflowId" },
      { status: 400 },
    );
  }
  const body = await req.json();

  const formData = {
    formId: body.formId,
    formTitle: body.formTitle,
    responseId: body.responseId,
    timestamp: body.timestamp,
    respondentEmail: body.respondentEmail,
    responses: body.responses,
    raw: body,
  };

  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
    select: { userId: true },
  });

  if (!workflow) {
    return Response.json(
      { success: false, error: "Workflow not found" },
      { status: 404 },
    );
  }
  const runId = crypto.randomUUID();
  const execution = await prisma.execution.create({
    data: {
      workflowId,
      status: "PENDING",
      userId: workflow?.userId,
      runId,
    },
  });
  await inngest.send({
    name: "workflows/execute.workflow",
    data: {
      workflowId,
      executionId: execution.id,
      initialData: formData,
      runId: runId,
    },
  });

  await inngest.realtime.publish(
    workflowChannel({ workflowId }).executionStarted,
    { runId },
  );
  return new Response("OK");
}

import { workflowChannel } from "@/inngest/channels/workflow";
import { inngest } from "@/inngest/client";

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

  const runId = crypto.randomUUID();

  await inngest.send({
    name: "workflows/execute.workflow",
    data: {
      workflowId,
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

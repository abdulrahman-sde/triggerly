import type { NodeExecutor } from "@/features/nodes/types";
import { NonRetriableError } from "inngest";
import ky from "ky";
import Handlebars from "handlebars";
import { inngest } from "@/inngest/client";
import { resolveCredentialApiKey } from "@/lib/credential-crypto";
import { Resend } from "resend";

type EmailData = {
  variableName?: string;
  credentialId?: string;
  from?: string;
  to?: string;
  subject?: string;
  body?: string;
};

export const EmailExecutor: NodeExecutor<EmailData> = async ({
  data,
  context,
  step,
  channel,
  nodeId,
}) => {
  const variableName = data.variableName;
  if (!variableName) {
    throw new NonRetriableError("Variable name is required for Email node");
  }

  const from = Handlebars.compile(data.from ?? "")(context);
  const to = Handlebars.compile(data.to ?? "")(context);
  const subject = Handlebars.compile(data.subject ?? "")(context);
  const body = Handlebars.compile(data.body ?? "")(context);
  console.log("Email node data after Handlebars compilation:", {
    from,
    to,
    subject,
    body,
  });
  for (const [field, value] of [
    ["From", from],
    ["To", to],
    ["Subject", subject],
    ["Body", body],
  ]) {
    if (!value) {
      throw new NonRetriableError(`${field} is required for Email node`);
    }
  }

  await inngest.realtime.publish(channel.status, {
    status: "loading",
    nodeId: nodeId,
  });

  const result = await step.run(`send-email-${nodeId}`, async () => {
    const apiKey =
      (await resolveCredentialApiKey(data.credentialId)) ||
      process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new NonRetriableError(
        "Resend API key credential is required for Email node",
      );
    }

    const resend = new Resend(apiKey);
    const { data: response, error } = await resend.emails.send({
      from,
      to,
      subject,
      text: body,
    });

    if (error) {
      throw new NonRetriableError(
        `Failed to send email: ${error.message || "Unknown error"}`,
      );
    }

    return {
      ...context,
      [variableName]: {
        id: response?.id,
        to,
        subject,
      },
    };
  });

  await inngest.realtime.publish(channel.status, {
    status: "success",
    nodeId: nodeId,
  });

  return result;
};

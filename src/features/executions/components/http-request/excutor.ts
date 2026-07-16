import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as kyOptions } from "ky";
import Handlebars from "handlebars";
import { inngest } from "@/inngest/client";
type httpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: string;
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<httpRequestData> = async ({
  data,
  context,
  step,
  publish,
  channel,
  nodeId,
}) => {
  try {
    const endpoint = Handlebars.compile(data.endpoint)(context);
    if (!endpoint) {
      throw new NonRetriableError("Endpoint is required for HTTP request node");
    }
    const variableName = data.variableName;

    if (!variableName) {
      throw new NonRetriableError(
        "Variable name is required for HTTP request node",
      );
    }

    await inngest.realtime.publish(channel.status, {
      status: "loading",
      nodeId: nodeId,
    });

    const result = await step.run(`http-request-${nodeId}`, async () => {
      const method = data.method || "GET";
      const options: kyOptions = { method };

      if (["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
        const resolvedBody = Handlebars.compile(data.body)(context);
        JSON.parse(resolvedBody);
        options.body = resolvedBody;
        options.headers = { "Content-status": "application/json" };
      }
      const response = await ky(endpoint, options);
      const contentType = response.headers.get("content-type");
      const responseData = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      const responsePayload = {
        httpResponse: { status: response.status, data: responseData },
      };
      return {
        ...context,
        [variableName]: responsePayload,
      };
    });

    await inngest.realtime.publish(channel.status, {
      status: "success",
      nodeId: nodeId,
    });
    return result;
  } catch (error) {
    await inngest.realtime.publish(channel.status, {
      status: "error",
      nodeId: nodeId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

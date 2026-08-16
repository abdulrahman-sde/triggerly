import type { NodeExecutor } from "@/features/nodes/types";
import { NonRetriableError } from "inngest";
import ky from "ky";
import Handlebars from "handlebars";
import { inngest } from "@/inngest/client";
import {
  authorizeSheets,
  extractSpreadsheetId,
  resolveServiceAccount,
  toGoogleApiError,
} from "./lib";

export type GoogleSheetsOperation = "append" | "read";

type GoogleSheetsData = {
  variableName?: string;
  credentialId?: string;
  spreadsheetUrl?: string;
  operation?: GoogleSheetsOperation;
  range?: string;
  values?: string;
};

const parseValues = (raw: string): string[][] => {
  return raw
    .trim()
    .split("\n")
    .filter((row) => row.trim().length > 0)
    .map((row) =>
      row
        .split(",")
        .map((cell) => cell.trim())
        .filter((cell) => cell.length > 0),
    );
};

export const GoogleSheetsExecutor: NodeExecutor<GoogleSheetsData> = async ({
  data,
  context,
  step,
  channel,
  nodeId,
}) => {
  const variableName = data.variableName;
  if (!variableName) {
    throw new NonRetriableError(
      "Variable name is required for Google Sheets node",
    );
  }

  const spreadsheetsUrl = data.spreadsheetUrl
    ? Handlebars.compile(data.spreadsheetUrl)(context)
    : "";
  const spreadsheetId = extractSpreadsheetId(spreadsheetsUrl);
  if (!spreadsheetId) {
    throw new NonRetriableError("Spreadsheet ID or URL is required");
  }

  const operation = data.operation || "append";
  const range = data.range
    ? Handlebars.compile(data.range)(context)
    : undefined;
  if (!range) {
    throw new NonRetriableError("Range is required for Google Sheets node");
  }

  const rawValues = data.values ? Handlebars.compile(data.values)(context) : "";
  if (operation !== "read" && !rawValues.trim()) {
    throw new NonRetriableError("Values are required for the append operation");
  }
  const values = operation === "read" ? [] : parseValues(rawValues);

  const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;

  await inngest.realtime.publish(channel.status, {
    status: "loading",
    nodeId: nodeId,
  });

  const result = await step.run(
    `google-sheets-${operation}-${nodeId}`,
    async () => {
      const key = await resolveServiceAccount(data.credentialId);
      const accessToken = await authorizeSheets(key);

      let responsePayload: Record<string, unknown> = {};

      try {
        if (operation === "read") {
          const response = await ky
            .get(`${baseUrl}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
            .json<Record<string, unknown>>();

          responsePayload = {
            values: response.values ?? [],
            range: response.range,
          };
        } else {
          const response = await ky
            .post(
              `${baseUrl}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
              {
                headers: { Authorization: `Bearer ${accessToken}` },
                json: { values },
              },
            )
            .json<{
              spreadsheetId?: string;
              tableRange?: string;
              updates?: { updatedRange?: string; updatedRows?: number };
            }>();

          responsePayload = {
            spreadsheetId: response.spreadsheetId,
            tableRange: response.tableRange,
            updatedRange: response.updates?.updatedRange,
            updatedRows: response.updates?.updatedRows,
          };
        }
      } catch (error) {
        await toGoogleApiError(error);
      }

      return {
        ...context,
        [variableName]: responsePayload,
      };
    },
  );

  await inngest.realtime.publish(channel.status, {
    status: "success",
    nodeId: nodeId,
  });

  return result;
};

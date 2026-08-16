import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import ky from "ky";
import {
  authorizeSheets,
  extractSpreadsheetId,
  parseGoogleApiError,
  resolveServiceAccount,
} from "../lib";

export const GoogleSheetsRouter = createTRPCRouter({
  getTabs: protectedProcedure
    .input(
      z.object({
        credentialId: z.string().min(1),
        spreadsheetUrl: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const spreadsheetId = extractSpreadsheetId(input.spreadsheetUrl);
      if (!spreadsheetId) {
        return { ok: false as const, error: "Invalid spreadsheet URL or ID" };
      }

      try {
        const key = await resolveServiceAccount(input.credentialId);
        const accessToken = await authorizeSheets(key);

        const response = await ky
          .get(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          )
          .json<{
            sheets?: { properties?: { title?: string } }[];
          }>();

        const tabs = (response.sheets ?? [])
          .map((sheet) => sheet.properties?.title)
          .filter((title): title is string => !!title);

        return { ok: true as const, tabs };
      } catch (error) {
        return { ok: false as const, error: await parseGoogleApiError(error) };
      }
    }),
});
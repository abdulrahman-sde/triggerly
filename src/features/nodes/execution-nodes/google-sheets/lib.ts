import { NonRetriableError } from "inngest";
import { JWT } from "google-auth-library";
import { HTTPError } from "ky";
import { resolveCredentialApiKey } from "@/lib/credential-crypto";
import { extractSpreadsheetId } from "./range-utils";

export { extractSpreadsheetId };

const SPREADSHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

export type ServiceAccountKey = {
  client_email?: string;
  private_key?: string;
};

export const resolveServiceAccount = async (
  credentialId?: string,
): Promise<ServiceAccountKey> => {
  const keyJson =
    (await resolveCredentialApiKey(credentialId)) ||
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!keyJson) {
    throw new NonRetriableError(
      "Google Sheets credential is required for this node",
    );
  }

  let key: ServiceAccountKey;
  try {
    key = JSON.parse(keyJson) as ServiceAccountKey;
  } catch {
    throw new NonRetriableError(
      "Google Sheets credential is not a valid service account JSON",
    );
  }

  if (!key.client_email || !key.private_key) {
    throw new NonRetriableError(
      "Google Sheets credential JSON is missing client_email or private_key",
    );
  }

  return key;
};

export const authorizeSheets = async (
  key: ServiceAccountKey,
): Promise<string> => {
  const client = new JWT({
    email: key.client_email!,
    key: key.private_key!,
    scopes: [SPREADSHEETS_SCOPE],
  });
  const tokens = await client.authorize();
  if (!tokens?.access_token) {
    throw new NonRetriableError("Failed to obtain Google API access token");
  }
  return tokens.access_token;
};

export const parseGoogleApiError = async (
  error: unknown,
): Promise<string> => {
  if (error instanceof HTTPError) {
    try {
      const body = (await error.response.json()) as {
        error?: { message?: string; status?: string };
      };
      const message = body?.error?.message;
      if (message) {
        return body?.error?.status
          ? `${message} (${body.error.status})`
          : message;
      }
    } catch {
      // ignore body parse failure
    }
  }

  return error instanceof Error ? error.message : String(error);
};

export const toGoogleApiError = async (error: unknown): Promise<never> => {
  throw new NonRetriableError(await parseGoogleApiError(error));
};
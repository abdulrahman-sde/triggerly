# Google Sheets Node — Complete Flow

How the Google Sheets node works in Triggerly, from credential creation to the final Google Sheets REST API call.

---

## 1. High-level flow

```
User creates a credential          User configures the node          Workflow runs
───────────────────────            ────────────────────────          ─────────────
Google Cloud:                       selects spreadsheet URL           Inngest "execute-workflow"
service account JSON                + tab + operation + values        topological sort of nodes
        │                                   │                                 │
        ▼                                   ▼                                 ▼
Encrypted (AES-256-GCM)          saved as Node.data (JSON)      GoogleSheetsExecutor resolves
stored in credential.value        (never touches the DB            credential (decrypted)
        │                           via tRPC — read-only)          or env var fallback
        ▼                                   │                                 │
tRPC credentials.*                tRPC googleSheets.getTabs        JWT (client_email +
  (server-side, decryption        fetches tab names live from     private_key) → access token
  happens ONLY here)              Sheets API for the dropdown             │
                                                                          ▼
                                                              Google Sheets REST API v4
                                                              append / read / update
```

Everything sensitive lives server-side. The browser only ever receives:
- the credential metadata with `value` masked to `""` (`maskCredential`), and
- the `client_email` of the service account (for the "share your sheet" hint).

---

## 2. Data model & migrations

### Schema (`prisma/schema.prisma`)

Two enums gained new members (prisma/schema.prisma:79,120):

```prisma
enum CredentialType {
    GEMINI
    OPENAI_COMPATIBLE
    GOOGLE_SERVICE_ACCOUNT
}

enum NodeType {
    INITIAL
    MANUAL_TRIGGER
    HTTP_REQUEST
    GOOGLE_FORM_TRIGGER
    GEMINI
    OPENAI_COMPATIBLE
    DISCORD
    GOOGLE_SHEETS
}
```

The `Credential` model stores the service account key in `value` (encrypted string), plus optional `baseURL` — for `GOOGLE_SERVICE_ACCOUNT` the `baseURL` field is unused (vs. `OPENAI_COMPATIBLE` which needs it).

### Migration (`prisma/migrations/20260808084714_add_google_sheets_node/migration.sql`)

The migration is **non-destructive** — it only alters enums, it never drops tables or columns:

```sql
ALTER TYPE "NodeType" ADD VALUE 'GOOGLE_SHEETS';
ALTER TYPE "CredentialType" ADD VALUE 'GOOGLE_SERVICE_ACCOUNT';
```

Apply pending migrations with `npx prisma migrate deploy` (safe, replays only) or `npx prisma migrate dev`.

---

## 3. Credential creation flow

Files: `src/features/credentials/components/credential-form.tsx`, `src/features/credentials/components/credentials.tsx`, `src/features/credentials/server/router.ts`

### Google Cloud setup (UI guide)

When the user picks **Google Sheets** as provider, the sheet shows these steps (credential-form.tsx:96-105):

1. Go to Google Cloud Console and create a project
2. Enable the **Google Sheets API**
3. Create a **Service Account** and download its JSON key
4. Paste the full JSON key below
5. Share the spreadsheet with the service account email (**Editor**) — a banner in the node config shows this email with a copy button

### Input field behavior

- The key field label switches to "Service Account JSON" and renders a `Textarea` (not a password input like API keys) with a `{ "type": "service_account", "client_email": ... }` placeholder (credential-form.tsx:259-267).
- On edit, the value field is optional — "Leave blank to keep the existing key" (credential-form.tsx:254-258).

### Storage & encryption (`src/lib/credential-crypto.ts`)

The raw JSON never touches the DB. On `credentials.create` / `credentials.update` (router.ts:62-127) the value is encrypted:

- **Cipher:** AES-256-GCM (`aes-256-gcm`)
- **Key derivation:** `scryptSync(CREDENTIAL_ENCRYPTION_KEY, "triggerly-credential-encryption-v1", 32)` — 32-byte key from the env secret + fixed salt
- **IV:** 12 random bytes per encryption
- **Output format:** `base64(iv).base64(authTag).base64(ciphertext)` joined with dots
- **Auth tag** (GCM) is validated on decrypt — tampered ciphertext fails `decryptCredential`

```ts
return [iv.toString("base64"), tag.toString("base64"), encrypted.toString("base64")].join(".");
```

### Access rules

- `getAll` / `getOne` return credentials scoped to `ctx.user.id`, with `value` masked (router.ts:9-14).
- `create` / `update` / `delete` all filter by `userId` — a user cannot read, edit, or delete another user's credential.
- `GOOGLE_SERVICE_ACCOUNT_JSON` env var requires **no** saved credential (see §6).

---

## 4. tRPC endpoints used by the node

### `credentials.getServiceAccountEmail` (router.ts:42-60)

- Input: `{ id: string }` (credentialId)
- Decrypts `credential.value`, `JSON.parse`s it, returns `client_email` (or `null` on parse failure).
- Used by the node sheet for the "Share your sheet with <email>" banner + copy button (sheet.tsx:129-144).

### `googleSheets.getTabs` (`src/features/nodes/execution-nodes/google-sheets/server/router.ts`)

- Input: `{ credentialId, spreadsheetUrl }` — both validated with `z.string().min(1)`
- Resolves the service account (§6), fetches the spreadsheet **metadata only**:

```
GET https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}?fields=sheets.properties.title
Authorization: Bearer <token>
```

- Returns `{ ok: true, tabs: string[] }` (sheet titles) or `{ ok: false, error }`.
- Errors are wrapped via `parseGoogleApiError` (`NonRetriableError` inside the tRPC query — surface as a user-facing error string in the tab dropdown).
- Fired client-side whenever a credential + spreadsheet URL is present (sheet.tsx:150-154); fetches nothing if either is missing.

The browser never calls Google directly — all Sheets API traffic goes through these server endpoints.

---

## 5. Node UI & configuration

Files: `src/features/nodes/execution-nodes/google-sheets/sheet.tsx` (config sheet), `node.tsx` (canvas node), `range-utils.ts` (ID extraction)

### Registration

- `NodeType.GOOGLE_SHEETS` → `GoogleSheetsNode` in `src/utils/node-components.ts:20` (canvas rendering)
- `NodeType.GOOGLE_SHEETS` → `GoogleSheetsExecutor` in `src/features/nodes/lib/node-registry.ts:19` (runtime execution)
- Appears in the editor palette via `src/features/editor/components/node-selector.tsx:98`

### Form fields (`sheet.tsx`)

| Field | Validation | Notes |
|---|---|---|
| `variableName` | `/^[a-zA-Z_][a-zA-Z0-9_]*$/` | Output variable for the node result; used by downstream nodes via `{{variableName.path}}` |
| `credentialId` | optional, but the node needs one | Select is filtered to `CredentialType.GOOGLE_SERVICE_ACCOUNT` credentials only; "Add credential →" links to the credentials page |
| `spreadsheetUrl` | required, min 1 char | URL **or** plain ID; may contain Handlebars refs (`{{...}}`) |
| `operation` | `append` / `read` / `update` | Triple-toggle UI |
| `range` | regex-validated A1 notation | See below |
| `values` | free text | Required for `append`/`update`; hidden for `read` |

### Range validation regex (sheet.tsx:48-54)

```regex
^TabName(?:!Cell)?$|^Cell$          TabName = [A-Za-z0-9_.-]+ (or 'quoted')
Cell    = [A-Za-z]{1,3}[0-9]* | [0-9]+
```

Valid: `Sheet1`, `Sheet1!A1`, `Sheet1!A1:D10`, `A1`, `'My Tab'!B2`.
Error: "Invalid range. Use a tab name (e.g. Sheet1), a cell (Sheet1!A1), or a rectangle (Sheet1!A1:D10)."

### Tab dropdown behavior

- Picking a tab sets `range` to the tab name alone for **read** (reads all rows) or `${tab}!A1` for append/update (sheet.tsx:320-323).
- `extractSpreadsheetId` (range-utils.ts:1-5):

```ts
export const extractSpreadsheetId = (input: string): string => {
  const urlMatch = input.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (urlMatch) return urlMatch[1];
  return input.trim();
};
```

> **Note:** matches a `/d/<id>` pattern in a URL (e.g. `https://docs.google.com/spreadsheets/d/1AbC.../edit` → `1AbC...`); anything without that pattern (an ID, a Handlebars ref) is used as-is.

### Handlebars templating

The following node fields support `{{variable}}` references at runtime:
- `spreadsheetUrl` → `Handlebars.compile(...)(context)` (excutor.ts:102-104)
- `range` (excutor.ts:111-113)
- `values` (excutor.ts:118-120)

The context is built up from the `previous nodes' variableName outputs + the workflow trigger's initialData.

---

## 6. Runtime execution — the executor

File: `src/features/nodes/execution-nodes/google-sheets/excutor.ts`
Orchestration: `src/inngest/functions.ts`

### Dispatch

`executeWorkflow` (inngest/functions.ts:8-120):

1. Topologically sorts the workflow's nodes (`topologicalSort`).
2. For each node: `getExecutor(node.type)` → executor called with `{ data: node.data, nodeId, context, step, channel }`.
3. Each node's bound output replaces `context` (executors return `{ ...context, [variableName]: payload }`).
4. Success → `updateExecutionLogs`; failure → realtime `status: "error"` publish, error log, `NonRetriableError` (workflow fails).

Realtime status: the executor publishes `status: "loading"` before `step.run` and `status: "success"` after (excutor.ts:130-133, 198-201) on `nodeStatusChannel({ runId })` — this is what colors the node's status ring live.

### Service account resolution (excutor.ts:46-75)

```ts
const keyJson = (await resolveCredentialApiKey(credentialId)) || process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
```

- **Priority:** saved credential → env var fallback (`GOOGLE_SERVICE_ACCOUNT_JSON`)
- `resolveCredentialApiKey` (`src/lib/credential-crypto.ts:43-54`) loads `credential` by ID, then `decryptCredential(credential.value)`.
- Missing → `NonRetriableError("Google Sheets credential is required for this node")`
- Invalid JSON → `NonRetriableError("...not a valid service account JSON")`
- Missing `client_email`/`private_key` → `NonRetriableError("...JSON is missing client_email or private_key")`

### Authentication (JWT, `google-auth-library`)

```ts
const client = new JWT({ email, key, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
const { access_token } = await client.authorize();
```

- Service-account JWT auth: the client signs a JWT with the private key, sends it to Google's token endpoint, gets a short-lived access token.
- **Scope:** `https://www.googleapis.com/auth/spreadsheets` (full read+write+share) — consent not required for service accounts.

### The three Sheets REST operations

Base URL pattern (excutor.ts:128):

```
https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{encodedRange}
```

All requests use `Authorization: Bearer <access_token>`, via `ky`.

#### READ — `excutor.ts:141-151`

```
GET https://sheets.googleapis.com/v4/spreadsheets/{id}/values/{range}
```

Returns `{ values: string[][], range }` → exposed to downstream nodes as `{{variableName.values}}`.

#### APPEND — `excutor.ts:152-172`

```
POST https://sheets.googleapis.com/v4/spreadsheets/{id}/values/{range}:append
? valueInputOption=USER_ENTERED & insertDataOption=INSERT_ROWS
```

Body: `{ "values": [[...], ...] }`

- `valueInputOption=USER_ENTERED` → Google parses values as if typed by a user (dates, numbers, formulas).
- `insertDataOption=INSERT_ROWS` → grows the sheet instead of overwriting.
- Appending starts after the **last used row** of the range.
- Returns `{ spreadsheetId, tableRange, updates: { updatedRange, updatedRows } }` → `{{variableName.updatedRange}}`

#### UPDATE — `excutor.ts:173-190`

```
PUT https://sheets.googleapis.com/v4/spreadsheets/{id}/values/{range}
? valueInputOption=USER_ENTERED
```

Body: `{ "values": [[...], ...] }`

- Overwrites the cells in `range` (must match row/col dimensions).
- Returns `{ spreadsheetId, updatedRange?, updatedRows? }` → `{{variableName.updatedRange}}`.

### Values parsing (excutor.ts:33-44)

```
input: "John,{{orderEmail}},42"     →  [["John", "<compiled>", "42"]]
```

- Split on `\n` → one row per line.
- Each row split on `,` with whitespace-trimmed cells.
- Empty cells/lines are skipped.
- For `read` no `values` are sent (the body is empty).

### Error handling

- Google HTTP errors → `ky` throws `HTTPError` → `parseGoogleApiError` reads `res.error.message` + `res.error.status` → rethrown as `NonRetriableError("message (status)")` via `toGoogleApiError` (lib.ts:62-86). `NonRetriableError` tells Inngest **not** to retry.
- Missing required input → dedicated `NonRetriableError` messages (see §6).

---

## 7. Environment variables

| Variable | Purpose | Required? |
|---|---|---|
| `CREDENTIAL_ENCRYPTION_KEY` | scrypt seed for AES-256-GCM key — decrypting existing credentials fails if changed | Yes, for any credential-based flow |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Fallback service-key JSON when no credentialId is set | Optional (fallback) |
| `DATABASE_URL` | Postgres (Neon) |

> ⚠️ Rotating `CREDENTIAL_ENCRYPTION_KEY` invalidates all stored credentials (they are not re-encrypted).

---

## 8. Troubleshooting quick reference

| Symptom | Cause / fix |
|---|---|
| `Permission denied` (`The caller does not have permission`) | Share the spreadsheet with the service account `client_email` as **Editor** (copy button in the sheet) |
| `Sheets credential is not a valid service account JSON` | The JSON key was not pasted correctly, or the `credentialId` points to a non-service-account credential |
| `Sheets credential JSON is missing client_email or private_key` | Wrong JSON file (e.g. OAuth client credentials instead of a service account key) |
| No tabs in dropdown | Permission issue (see above), wrong spreadsheet ID, or not shared with the SA email |
| `CREDENTIAL_ENCRYPTION_KEY is not set` | Set it server-side, restart; key must **match** the one used when the credential was saved |
| Node fails without running | No credentialId and no `GOOGLE_SERVICE_ACCOUNT_JSON` env var → "credential is required" |
| Append but rows missing | Check `valueInputOption=USER_ENTERED` behavior for the given cells; verify `range` is a real tab on the same sheet |

---

## 9. Security notes

- Credential values are only decryptable with `CREDENTIAL_ENCRYPTION_KEY` — plaintext never leaves the server, never in logs, never in the browser.
- tRPC routes are `protectedProcedure` (user-session scoped) and always filter by `userId`.
- The Sheets API token is per-request, never persisted.
- Node config data (spreadsheet URL, ranges, credentials) is stored on the `node` row in plaintext **except** the credential id — the secret JSON itself lives only in `credential.value` (encrypted).
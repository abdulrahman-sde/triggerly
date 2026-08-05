    # How Credential Encryption Works

    This document explains — step by step, for beginners — how API keys are encrypted and used in Triggerly.

    ## The Problem

    Users store API keys (Gemini, OpenAI, etc.) so their workflows can call AI models. Without protection, those keys sit in the database as **plain text**. If the database leaks, attackers get every user's key for free.

    The fix: **encrypt the key before saving it**, and only ever **decrypt it inside the server**, at the exact moment it's needed.

    ## The Toolbox (what encryption actually means here)

    We use the `crypto` module that ships with Node.js — no external library. It gives us **AES-256-GCM**, which is two things at once:

    - **AES-256** — the encryption algorithm. It scrambles text using a secret `key`.
    - **GCM** — adds an **authentication tag**, a "signature" of the encrypted data. If anyone tampers with the ciphertext, the tag won't match and decryption fails. (This is why we don't use simpler libraries like `cryptr` — they're missing this.)

    Every time we encrypt, we also generate a random **IV** (Initialization Vector). Two identical keys encrypted twice produce *different* ciphertext, so an attacker can't tell if two users stored the same key.

    The secret `key` itself is **derived** from an environment variable (`CREDENTIAL_ENCRYPTION_KEY`) using `scrypt` — a deliberately slow hashing function that makes brute-force harder.

    > **Analogies:** The IV is like the random salt you put in a recipe — same recipe, different taste each time. The auth tag is like a tamper-evident seal on a medicine bottle. `scrypt` is like mixing the flour into the dough very slowly — making it fast to do once but slow to try millions of times.

    ## The Code (`src/lib/credential-crypto.ts`)

    ```ts
    import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
    import "server-only";                       // guards: this file can NEVER be imported by the browser
    import prisma from "@/lib/prisma";

    const SALT = "triggerly-credential-encryption-v1";

    // Turn the env secret into a 32-byte (256-bit) key. Runs once.
    const getEncryptionKey = (): Buffer => {
    const secret = process.env.CREDENTIAL_ENCRYPTION_KEY;
    if (!secret) throw new Error("CREDENTIAL_ENCRYPTION_KEY is not set");
    return scryptSync(secret, SALT, 32);
    };

    // "hello"  ->  "iv.tag.ciphertext"   (three base64 parts, joined by dots)
    export const encryptCredential = (plaintext: string): string => {
    const key = getEncryptionKey();
    const iv = randomBytes(12);                       // fresh random IV every time
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();                  // tamper-evident seal
    return [iv.toString("base64"), tag.toString("base64"), encrypted.toString("base64")].join(".");
    };

    // "iv.tag.ciphertext"  ->  "hello"
    export const decryptCredential = (payload: string): string => {
    const key = getEncryptionKey();
    const [iv, tag, encrypted] = payload.split(".");
    if (!iv || !tag || !encrypted) throw new Error("Invalid encrypted credential payload");
    const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(iv, "base64"));
    decipher.setAuthTag(Buffer.from(tag, "base64"));
    return Buffer.concat([decipher.update(Buffer.from(encrypted, "base64")), decipher.final()]).toString("utf8");
    };

    // Fetch a credential from the DB and decrypt it. Only called server-side.
    export const resolveCredentialApiKey = async (credentialId?: string | null): Promise<string | undefined> => {
    if (!credentialId) return undefined;
    const credential = await prisma.credential.findUnique({ where: { id: credentialId } });
    if (!credential) return undefined;
    return decryptCredential(credential.value);
    };
    ```

    Notes:

    - The `server-only` import is a **compile-time guarantee**: if a client component tries to import this file, the build fails. The encryption key never exists in the browser.
    - The output format is `iv.tag.ciphertext` — all three pieces are stored together, so decryption has everything it needs.
    - If `CREDENTIAL_ENCRYPTION_KEY` is missing, encrypting/decrypting throws. It's a "fail loudly" design — better than silently storing plaintext.

    ## The Flow, End to End

    ### 1. Creating a credential (write path)

    ```
    User types key in the form
            │
            ▼
    tRPC router  POST /credentials (server)
            │  input.value = "sk-abc123..."
            ▼
    encryptCredential("sk-abc123...")
            │  AES-256-GCM + random IV
            ▼
    "aGVsbG8=.dGFn...=.Y2lwaGVy..."   ← ciphertext
            │
            ▼
    saved to PostgreSQL column:  credential.value
    ```

    The database now holds ciphertext. A leaked DB dump is useless without the key.

    ### 2. Reading credentials (list / edit)

    ```ts
    // router.ts
    const maskCredential = <T extends { value: string }>(credential: T) => ({
    ...credential,
    value: "",          // ← always empty when sent to the browser
    });
    ```

    The tRPC `getAll` / `getOne` queries **replace the value with `""`** before the response leaves the server. The browser sees name, type, baseURL — but never the key.

    This is why the edit form has an *optional* API key field with "Leave blank to keep the existing key": the server can't pre-fill it, because the server is the only place that can decrypt.

    ### 3. Using the key in a workflow (read path)

    When a user picks a saved credential in the AI node config sheet, the node stores only the `credentialId` (an opaque ID) — **not** the key. The key is never copied into the workflow's node data (which is stored as plain JSON).

    ```
    Workflow runs  →  Inngest background job
                            │
                            ▼
                Gemini executor (server-side)
                            │  reads node.data.credentialId
                            ▼
            resolveCredentialApiKey(credentialId)
                            │  1. SELECT * FROM credential WHERE id = ?
                            │  2. decryptCredential(ciphertext)
                            ▼
                    "sk-abc123..."  (plaintext)
                            │
                            ▼
                used ONCE to call the AI provider
                            │
                            ▼
                        never stored anywhere
    ```

    Key facts about this step:

    - The key is decrypted **inside the execution engine**, which runs on the server (Inngest), never in the browser.
    - It lives in memory only for the duration of the API call, then the variable goes out of scope.
    - The executor falls back in this order: `data.apiKey` (legacy workflows saved before encryption) → saved credential → `process.env` key.

    ## Security Notes / Gotchas

    1. **`CREDENTIAL_ENCRYPTION_KEY` must exist everywhere the server runs** — local, Vercel, etc. It must also be **identical** everywhere, because the same key that encrypts must decrypt. Changing it makes all stored credentials undecryptable.
    2. **Old plaintext keys** — credentials created before this system exist are still plaintext in the DB. They get encrypted the next time the user edits them, or you'd need a one-off migration script to re-encrypt everything.
    3. **Nothing encrypts the key in transit** — TLS/HTTPS handles that. This system only protects data **at rest** (in the database).
    4. **The browser never needs the key** — if you ever see a flow that fetches `credential.value` on the client, that's a bug.

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import "server-only";
import prisma from "@/lib/prisma";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const SALT = "triggerly-credential-encryption-v1";

const getEncryptionKey = (): Buffer => {
  const secret = process.env.CREDENTIAL_ENCRYPTION_KEY;
  if (!secret) {
    throw new Error("CREDENTIAL_ENCRYPTION_KEY is not set");
  }
  return scryptSync(secret, SALT, 32);
};

export const encryptCredential = (plaintext: string): string => {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [iv.toString("base64"), tag.toString("base64"), encrypted.toString("base64")].join(".");
};

export const decryptCredential = (payload: string): string => {
  const key = getEncryptionKey();
  const [iv, tag, encrypted] = payload.split(".");
  if (!iv || !tag || !encrypted) {
    throw new Error("Invalid encrypted credential payload");
  }
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(iv, "base64"));
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, "base64")),
    decipher.final(),
  ]).toString("utf8");
};

export const resolveCredentialApiKey = async (
  credentialId?: string | null,
): Promise<string | undefined> => {
  if (!credentialId) return undefined;

  const credential = await prisma.credential.findUnique({
    where: { id: credentialId },
  });

  if (!credential) return undefined;

  return decryptCredential(credential.value);
};

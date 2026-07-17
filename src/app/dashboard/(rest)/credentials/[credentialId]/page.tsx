import { prefetchCredential } from "@/features/credentials/server/prefetch";
import { CredentialView } from "@/features/credentials/components/credential-form";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";

export default async function CredentialPage({
  params,
}: { params: Promise<{ credentialId: string }> }) {
  const { credentialId } = await params;
  prefetchCredential(credentialId);

  return (
    <HydrateClient>
      <Suspense fallback={<div>Loading credential…</div>}>
        <CredentialView credentialId={credentialId} />
      </Suspense>
    </HydrateClient>
  );
}

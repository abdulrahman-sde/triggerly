"use client";

import { authClient } from "@/lib/auth-clinet";

export function HeaderProfile() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <div className="flex size-8 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium text-sidebar-accent-foreground">
      {user.name?.charAt(0)?.toUpperCase() ||
        user.email?.charAt(0)?.toUpperCase() ||
        "?"}
    </div>
  );
}

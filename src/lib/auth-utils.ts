import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getServerSession = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return { session };
});

export const requireAuth = async () => {
  const { session } = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  return session;
};

export const requireUnAuth = async () => {
  const { session } = await getServerSession();
  if (session) {
    redirect("/dashboard");
  }
};

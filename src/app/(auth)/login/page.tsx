import { LoginForm } from "@/features/auth/components/login-form";
import { requireUnAuth } from "@/lib/auth-utils";

export default async function LoginPageRoute() {
  await requireUnAuth();
  return <LoginForm />;
}

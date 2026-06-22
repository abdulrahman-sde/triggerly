import LoginPage from "@/components/login";
import { requireUnAuth } from "@/lib/auth-utils";

export default async function LoginPageRoute() {
  await requireUnAuth();
  return <LoginPage />;
}

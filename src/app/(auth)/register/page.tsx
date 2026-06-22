import RegisterPage from "@/components/register";
import { requireUnAuth } from "@/lib/auth-utils";

export default async function RegisterPageRoute() {
  await requireUnAuth();
  return <RegisterPage />;
}

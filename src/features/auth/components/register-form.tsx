"use client";

import { useState } from "react";
import { Eye, EyeOff, CirclePower, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { authClient } from "@/lib/auth-clinet";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function onSubmit(data: RegisterData) {
    setIsSubmitting(true);
    await authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
          setIsSubmitting(false);
        },
        onError: (ctx) => {
          toast.error(
            ctx.error.message || "Something went wrong. Please try again.",
          );
          setIsSubmitting(false);
        },
      },
    );
  }

  return (
    <div
      className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-12 overflow-hidden"
      style={{ backgroundColor: "#09090B" }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "600px",
          background:
            "radial-gradient(ellipse at center, rgba(99, 102, 241, 0.06) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10 mb-10 flex items-center gap-2">
        <CirclePower className="w-5 h-5 text-white" />
        <span className="text-white font-semibold">Sprint</span>
      </div>

      <div className="relative z-10 w-full max-w-sm border border-zinc-800 p-8 rounded-xl">
        <div className="mb-6">
          <h1 className="text-white text-lg font-medium tracking-tight">
            Create account
          </h1>
          <p className="text-zinc-400 text-sm mt-1.5">Register for Sprint</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register("name")}
              type="text"
              placeholder="Full name"
              className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500 focus-visible:border-zinc-500 focus-visible:ring-0 rounded-lg h-10 px-3 text-sm"
              autoComplete="name"
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500 focus-visible:border-zinc-500 focus-visible:ring-0 rounded-lg h-10 px-3 text-sm"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <div className="relative">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="border-zinc-700 bg-zinc-800/50 pr-10 text-white placeholder:text-zinc-500 focus-visible:border-zinc-500 focus-visible:ring-0 rounded-lg h-10 px-3 text-sm"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 h-full px-3 text-zinc-500 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-white text-zinc-900 hover:bg-zinc-100 rounded-lg h-10 text-sm font-medium transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader className="animate-spin" /> : "Register"}
          </Button>
        </form>

        <div className="relative my-6">
          <Separator className="w-full bg-zinc-800" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-[#09090B] px-2 text-sm text-zinc-500">
              or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full border-zinc-700 bg-zinc-800/30 text-white hover:bg-zinc-800 rounded-lg h-10 text-sm font-medium transition-colors"
          onClick={() => {}}
          disabled={isSubmitting}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-4 mr-2 shrink-0"
            aria-hidden="true"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </Button>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-white hover:text-zinc-300 transition-colors font-medium"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

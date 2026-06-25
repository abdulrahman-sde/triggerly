"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogoIcon } from "@/components/logo"
import { authClient } from "@/lib/auth-clinet"
import { toast } from "sonner"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginData) {
    setIsSubmitting(true)
    await authClient.signIn.email(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          setIsSubmitting(false)
          router.push("/dashboard")
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Something went wrong")
          setIsSubmitting(false)
        },
      },
    )
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Link href="/" aria-label="go home">
            <LogoIcon />
          </Link>
          <h1 className="mt-4 text-xl font-semibold">Sign in to Triggerly</h1>
          <p className="mt-1 text-sm text-muted-foreground">Welcome back</p>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <Input
              {...register("email")}
              type="email"
              placeholder="Email"
              required
              autoComplete="email"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                autoComplete="current-password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute right-0 top-0 h-full rounded-l-none"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end">
            <Link
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Forgot?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader className="size-4 animate-spin" /> : "Sign in"}
          </Button>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-foreground underline underline-offset-4 hover:no-underline">
            Create account
          </Link>
        </p>
      </form>
    </div>
  )
}

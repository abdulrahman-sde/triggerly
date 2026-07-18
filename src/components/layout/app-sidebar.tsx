"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-clinet";
import { cn } from "@/lib/utils";
import { useSubscriptionStatus } from "@/features/subscriptions/hooks/use-subscription";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { LogoIcon } from "../logo";
import { History, Home, Logout6 } from "reicon-react";

function CredentialsIcon(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={props.className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
      />
    </svg>
  );
}

function WorkflowsIcon(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={props.className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
      />
    </svg>
  );
}

const navItems = [
  // { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/workflows", label: "Workflows", icon: WorkflowsIcon },
  { href: "/dashboard/executions", label: "Executions", icon: History },
  {
    href: "/dashboard/credentials",
    label: "Credentials",
    icon: CredentialsIcon,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { hasActiveSubscription, isLoading } = useSubscriptionStatus();

  function isActive(href: string) {
    return pathname.startsWith(href);
  }

  return (
    <Sidebar variant="sidebar" className=" p-0" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-1 px-2 pt-2.5  ">
          <div className="flex h-7 w-7 items-center justify-center rounded-md ">
            <LogoIcon className="size-5 rounded-sm" />
          </div>
          <span className="text-sm font-semibold">Triggerly</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="absolute top-0 z-[-2] h-screen w-20 bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href} className="mb-1">
                <SidebarMenuButton asChild isActive={isActive(item.href)}>
                  <Link href={item.href} prefetch>
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {!isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() =>
                  hasActiveSubscription
                    ? authClient.customer.portal()
                    : authClient.checkout({
                        slug: "Visual-Workflow-Automation",
                      })
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={cn(
                    "size-4",
                    !hasActiveSubscription && "text-amber-400",
                  )}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                  />
                </svg>
                <span>
                  {hasActiveSubscription ? "Billing Portal" : "Upgrade to Pro"}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["subscription"] });
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      queryClient.clear();
                      router.replace("/login");
                    },
                  },
                });
              }}
              className="text-destructive/60 mt-1.5 hover:bg-destructive/10 hover:text-destructive"
            >
              <Logout6 size={26} className="rotate-180" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

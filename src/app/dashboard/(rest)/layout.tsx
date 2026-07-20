import { HeaderProfile } from "@/components/ui/header-profile";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="flex h-13 bg-sidebar shrink-0 items-center gap-2 px-4  ">
        <SidebarTrigger className="-ml-1" />
        <div className="flex-1" />
        <ThemeToggle />
        <Suspense fallback={<div className="h-8 w-8 rounded-full bg-muted" />}>
          <HeaderProfile />
        </Suspense>
      </header>
      <div className="flex flex-1 flex-col gap-4 bg-muted/50 p-4 ">
        {children}
      </div>
    </>
  );
}

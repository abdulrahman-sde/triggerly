import { AppSidebar } from "@/components/layout/app-sidebar";
import { HeaderProfile } from "@/components/ui/header-profile";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { requireAuth } from "@/lib/auth-utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1" />
          <ThemeToggle />
          <HeaderProfile />
        </header>
        <div className="flex flex-1 flex-col gap-4 bg-muted/50 p-4 rounded-xl">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

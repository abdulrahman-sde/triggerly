import { AppSidebar } from "@/components/layout/app-sidebar";
import { HeaderProfile } from "@/components/ui/header-profile";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

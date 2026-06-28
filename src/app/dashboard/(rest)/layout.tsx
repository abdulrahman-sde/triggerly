import { AppSidebar } from "@/components/layout/app-sidebar";
import { HeaderProfile } from "@/components/ui/header-profile";
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
    <>
      <header className="flex h-13 shrink-0 items-center gap-2 px-4  ">
        <SidebarTrigger className="-ml-1" />
        <div className="flex-1" />
        <HeaderProfile />
      </header>
      <div className="flex flex-1 flex-col gap-4 bg-muted/50 p-4 rounded-xl">
        {children}
      </div>
    </>
  );
}

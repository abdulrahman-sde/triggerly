import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "@/trpc/client";
import { TooltipProvider } from "@/components/ui/tooltip";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ui.abdulrahmanasif.dev"),
  title: "Sprint — Product Planning & Building Tool",
  description:
    "A Linear-inspired dark landing page with 3D dashboard mockup, AI agents integration, project timeline visualization, and workflow carousel.",
};

export default function SprintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontSans.variable}`}>
      <body className="antialiased font-sans">
        <TRPCReactProvider>
          <TooltipProvider delayDuration={0}>
            <Toaster richColors />
            {children}
          </TooltipProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

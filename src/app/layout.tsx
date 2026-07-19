import type { Metadata } from "next";
import { Geist, Manrope, Space_Grotesk } from "next/font/google";
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
  title: "Triggerly — Visual Workflow Automation",
  description:
    "Connect apps, trigger actions, and automate processes with a drag-and-drop node-based editor.",
};

export default function TriggerlyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fontSans.variable} `}>
      <body className="antialiased font-sans ">
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

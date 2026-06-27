import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "@/trpc/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";

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
    <html lang="en" suppressHydrationWarning className={`${fontSans.variable}`}>
      <body className="antialiased font-sans">
        <TRPCReactProvider>
          <TooltipProvider delayDuration={0}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
            >
              <Toaster richColors />
              {children}
            </ThemeProvider>
          </TooltipProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

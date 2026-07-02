import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, ChevronRight } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-[#09090B]/80 backdrop-blur-md">
      <div className="w-full flex justify-center px-6 py-4">
        <div className="w-full max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoIcon className="size-5.5 rounded-sm  mr-1" />
            <span className="text-white font-semibold">Triggerly</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Product
            </a>
            <a
              href="#"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Integrations
            </a>
            <a
              href="#"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Templates
            </a>
            <a
              href="#"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Docs
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm flex items-center">
              <Button>Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

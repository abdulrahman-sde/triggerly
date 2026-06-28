import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: "#09090B" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <h2 className="text-3xl md:text4xl font-medium tracking-tight text-white">
            Automate the busywork. Ship the work that matters.
          </h2>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-zinc-700 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors text-sm">
              Contact sales
            </button>
            <Link
              href="/dashboard"
              className="font-medium rounded-lg  text-sm "
            >
              <Button size={"lg"} className=" px-5 py-2.5 ">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

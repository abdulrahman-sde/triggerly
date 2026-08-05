"use client"

import { motion } from "motion/react"
import { ArrowRight2, Chat, ChevronRight, GlobePointer, Key, Lock2, Sparkle3 } from "reicon-react"
import Link from "next/link"

function AppIcon({ src, className = "w-3.5 h-3.5" }: { src: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={className} aria-hidden="true" />
  )
}

function CanvasNode({
  icon,
  accent,
  title,
  subtitle,
  selected,
}: {
  icon: React.ReactNode;
  accent: "amber" | "violet" | "zinc";
  title: string;
  subtitle: string;
  selected?: boolean;
}) {
  const accentClass = {
    amber: "bg-amber-500/15 text-amber-400",
    violet: "bg-violet-500/15 text-violet-400",
    zinc: "bg-zinc-700/40 text-zinc-300",
  }[accent];
  return (
    <div
      className={`flex items-center gap-2.5 w-[210px] rounded-lg border bg-zinc-900/90 px-3 py-2.5 ${selected ? "border-violet-500/60 ring-2 ring-violet-500/20" : "border-zinc-700/60"}`}
    >
      <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${accentClass}`}>
        <span className="flex items-center justify-center w-4 h-4">{icon}</span>
      </div>
      <div className="min-w-0">
        <div className="text-xs font-medium text-zinc-100 truncate">{title}</div>
        <div className="text-[10px] text-zinc-500 truncate">{subtitle}</div>
      </div>
      <div className={`ml-auto w-1.5 h-1.5 rounded-full shrink-0 ${selected ? "bg-violet-400" : "bg-zinc-700"}`} />
    </div>
  );
}

function GeminiSheetMockup() {
  return (
    <div className="relative rounded-xl border border-zinc-700/70 bg-zinc-900/70 backdrop-blur-sm flex overflow-hidden shadow-2xl">
      {/* canvas */}
      <div className="flex-1 min-w-0 relative p-6">
        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
          <defs>
            <pattern id="ai-canvas-grid" width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.07)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ai-canvas-grid)" />
        </svg>
        <div className="relative z-10 flex flex-col items-start gap-0">
          <CanvasNode
            icon={<AppIcon src="/assets/icons/google-form.svg" />}
            accent="amber"
            title="New submission"
            subtitle="Google Form · Trigger"
          />
          <div className="h-6 w-px ml-5 bg-zinc-700/70" aria-hidden="true" />
          <CanvasNode
            icon={<Sparkle3 className="w-4 h-4" />}
            accent="violet"
            title="Summarize response"
            subtitle="Gemini · AI"
            selected
          />
          <div className="h-6 w-px ml-5 bg-zinc-700/70" aria-hidden="true" />
          <CanvasNode
            icon={<Chat className="w-4 h-4" />}
            accent="zinc"
            title="Notify channel"
            subtitle="Discord · Action"
          />
          <div className="mt-5 flex items-center gap-2 rounded-md border border-zinc-700/70 bg-zinc-800/70 px-2.5 py-1.5">
            <span className="font-mono text-[11px] text-emerald-300">{`{{aiResult}}`}</span>
            <ArrowRight2 className="w-3 h-3 text-zinc-500" />
            <Chat className="w-3 h-3 text-zinc-400" />
            <span className="text-[11px] text-zinc-400">Discord message</span>
          </div>
        </div>
      </div>

      {/* config sheet */}
      <div className="w-[280px] shrink-0 border-l border-zinc-800 bg-zinc-900/80 flex flex-col">
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-violet-500/15 flex items-center justify-center">
            <Sparkle3 className="w-3.5 h-3.5 text-violet-400" />
          </span>
          <div>
            <div className="text-xs font-medium text-zinc-100">AI Action</div>
            <div className="text-[10px] text-zinc-500">Run a prompt against a Gemini model and store the result.</div>
          </div>
        </div>
        <div className="px-4 py-4 space-y-4 flex-1">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400/70" />
              <span className="text-[10px] font-medium text-zinc-400">Variable name</span>
            </div>
            <div className="rounded-md border border-zinc-700/70 bg-zinc-800/60 px-2.5 py-1.5 font-mono text-[11px] text-zinc-200">
              aiResult
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400/70" />
              <span className="text-[10px] font-medium text-zinc-400">Credential</span>
            </div>
            <div className="rounded-md border border-zinc-700/70 bg-zinc-800/60 px-2.5 py-1.5 flex items-center gap-2">
              <Key className="w-3 h-3 text-amber-400" />
              <span className="text-[11px] text-zinc-200 flex-1 truncate">Google AI Studio</span>
              <span className="flex items-center gap-1 text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                <Lock2 className="w-2.5 h-2.5" /> Encrypted
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
              <span className="text-[10px] font-medium text-zinc-400">Model</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {["gemini-3.5-flash", "gemini-2.5-pro", "gemini-3-flash-preview"].map((m, i) => (
                <div
                  key={m}
                  className={`rounded-md px-1 py-1.5 text-center text-[9px] font-medium truncate ${i === 0 ? "bg-violet-500/15 text-violet-300 border border-violet-500/30" : "bg-zinc-800/60 text-zinc-500 border border-zinc-700/60"}`}
                >
                  {m}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
              <span className="text-[10px] font-medium text-zinc-400">User prompt</span>
            </div>
            <div className="rounded-md border border-zinc-700/70 bg-zinc-800/60 px-2.5 py-2 text-[11px] text-zinc-300 leading-relaxed">
              Summarize the data: <span className="font-mono text-emerald-300">{`{{form.response}}`}</span>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 border-t border-zinc-800">
          <div className="w-full rounded-md bg-violet-600 hover:bg-violet-500 transition-colors text-white text-[11px] font-medium py-2 text-center">
            Save
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: <Sparkle3 className="w-5 h-5 text-violet-400" />,
    title: "Any model, one node",
    text: "Gemini or any OpenAI-compatible API — pick the model per node. Swap models without touching the rest of the flow.",
  },
  {
    icon: <Key className="w-5 h-5 text-amber-400" />,
    title: "Your keys, encrypted",
    text: "Save credentials once in your workspace. Encrypted at rest and reused across every flow you build.",
  },
  {
    icon: <GlobePointer className="w-5 h-5 text-emerald-400" />,
    title: "Output goes anywhere",
    text: "Map the result into an HTTP request body, a Discord message, or the next prompt — with {{variables}}.",
  },
];

export function AISection() {
  return (
    <div className="relative z-20 py-40" style={{ backgroundColor: "#09090B" }}>
      <div className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{ height: "20%", background: "linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, transparent 100%)" }} />
      <div className="w-full flex justify-center px-6">
        <div className="w-full max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-violet-500" />
            <span className="text-zinc-400 text-sm">Artificial intelligence</span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-medium tracking-tight text-white max-w-3xl mb-8">
            Power any step with AI
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 max-w-md mb-8">
            <span className="text-white font-medium">Drop a Gemini or OpenAI-compatible node anywhere in your flow.</span> Bring your own credentials, write a prompt, and map the output into the next step.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700 hover:bg-zinc-700 transition-colors text-sm">
              Explore AI nodes <ArrowRight2 className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center mt-16 mb-24">
            <div style={{ perspective: "900px", userSelect: "none", WebkitUserSelect: "none", width: "100%", maxWidth: "760px", position: "relative" }}>
              <div style={{ transformOrigin: "top", willChange: "transform", transform: "translateY(0%) rotateX(30deg) scale(1.15)", position: "relative" }}>
                <div style={{ border: "1px solid rgba(66, 66, 66, 0.5)", background: "linear-gradient(rgba(255, 255, 255, 0.1) 40%, rgba(8, 9, 10, 0.1) 100%)", borderRadius: "14px", position: "absolute", top: 0, bottom: 0, left: 0, right: 0, boxShadow: "inset 0 1.503px 5.261px rgba(255, 255, 255, 0.04), inset 0 -0.752px 0.752px rgba(255, 255, 255, 0.1)", pointerEvents: "none", zIndex: 10 }} />
                <div style={{ background: "linear-gradient(180deg, transparent 0%, #09090B 100%)", height: "85%", position: "absolute", bottom: "-2px", left: "-180px", right: "-180px", pointerEvents: "none", zIndex: 11 }} />
                <GeminiSheetMockup />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
              {features.map((f) => (
                <div key={f.title}>
                  <div className="flex items-center gap-2 mb-3">
                    {f.icon}
                    <span className="text-zinc-200 font-medium">{f.title}</span>
                  </div>
                  <p className="text-zinc-500 text-sm leading-relaxed">{f.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.6 }} className="mt-16">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-6 py-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <GlobePointer className="w-4 h-4 text-blue-400" />
                  <span className="text-zinc-200 font-medium text-sm">Webhooks & API</span>
                </div>
                <p className="text-zinc-500 text-sm">
                  Trigger from Google Forms with a webhook, or send results anywhere with the HTTP node.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[11px] text-zinc-400 bg-zinc-800/70 border border-zinc-700/60 rounded-md px-2.5 py-1.5">
                  POST /api/webhooks/google-form
                </span>
                <span className="flex items-center gap-1.5 border border-zinc-700/60 text-zinc-500 text-xs px-2.5 py-1.5 rounded-full">
                  <GlobePointer className="w-3 h-3" /> HTTP
                </span>
                <span className="flex items-center gap-1.5 border border-zinc-700/60 text-zinc-500 text-xs px-2.5 py-1.5 rounded-full">
                  <Sparkle3 className="w-3 h-3" /> Gemini
                </span>
                <span className="flex items-center gap-1.5 border border-zinc-700/60 text-zinc-500 text-xs px-2.5 py-1.5 rounded-full">
                  <AppIcon src="/assets/icons/openai.svg" /> OpenAI
                </span>
                <span className="flex items-center gap-1.5 border border-zinc-700/60 text-zinc-500 text-xs px-2.5 py-1.5 rounded-full">
                  <Chat className="w-3 h-3" /> Discord
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

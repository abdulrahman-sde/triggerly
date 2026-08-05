"use client";

import { motion } from "motion/react";
import {
  ChevronRight,
  Sparkles,
  ClipboardList,
  RotateCcw,
  ScrollText,
  Check,
} from "lucide-react";

function AppIcon({
  src,
  className = "w-4 h-4",
}: {
  src: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={className} aria-hidden="true" />
  );
}

const timelineSteps = [
  {
    icon: <AppIcon src="/assets/icons/google-form.svg" />,
    accent: "bg-amber-500/15 text-amber-400",
    title: "Google Form trigger fired",
    subtitle: "Trigger · New response",
    status: "success" as const,
    statusText: "Success",
    time: "0.3s",
  },
  {
    icon: <AppIcon src="/assets/icons/http-request.svg" />,
    accent: "bg-blue-500/15 text-blue-400",
    title: "HTTP request sent",
    subtitle: "Action · POST /hook",
    status: "success" as const,
    statusText: "Success",
    time: "0.8s",
  },
  {
    icon: <AppIcon src="/assets/icons/gemini.svg" />,
    accent: "bg-violet-500/15 text-violet-400",
    title: "Gemini summary",
    subtitle: "AI · gemini-3-flash",
    status: "failed" as const,
    statusText: "Failed",
    time: "1.2s",
  },
  {
    icon: <AppIcon src="/assets/icons/discord.svg" />,
    accent: "bg-zinc-700/40 text-zinc-300",
    title: "Discord notified",
    subtitle: "Action · #automation",
    status: "success" as const,
    statusText: "Success",
    time: "0.4s",
  },
];

const timeLabels = [
  { time: "12:00", left: "4%", top: "92px" },
  { time: "12:05", left: "13%", top: "74px" },
  { time: "12:10", left: "23%", top: "56px" },
  { time: "12:15", left: "34%", top: "38px" },
  { time: "12:20", left: "46%", top: "20px", current: true },
  { time: "12:25", left: "60%", top: "6px" },
  { time: "12:30", left: "78%", top: "0px" },
];

const runs = [
  { id: "RUN-2041", status: "success", time: "2s ago" },
  { id: "RUN-2040", status: "success", time: "5m ago" },
  { id: "RUN-2039", status: "failed", time: "12m ago" },
  { id: "RUN-2038", status: "success", time: "15m ago" },
];

function StepChip({ step }: { step: (typeof timelineSteps)[number] }) {
  return (
    <div
      className={`flex items-center gap-3.5 rounded-lg border bg-zinc-800/90 px-4 py-3.5 w-full ${
        step.status === "failed" ? "border-red-500/50" : "border-zinc-700/60"
      }`}
    >
      <div
        className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${step.accent}`}
      >
        <span className="flex items-center justify-center w-4 h-4">
          {step.icon}
        </span>
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="text-sm font-medium text-zinc-200 truncate leading-snug">
          {step.title}
        </div>
        <div className="text-[10px] text-zinc-500 truncate">
          {step.subtitle}
        </div>
      </div>
      <span
        className={`text-[10px] font-medium px-2 py-1 rounded shrink-0 ${
          step.status === "failed"
            ? "text-red-400 bg-red-500/10"
            : "text-emerald-400 bg-emerald-500/10"
        }`}
      >
        {step.statusText}
      </span>
      <span className="text-[10px] text-zinc-600 font-mono shrink-0">
        {step.time}
      </span>
    </div>
  );
}

function TiltedTimeline() {
  return (
    <div
      className="relative w-full hidden md:block"
      style={{ perspective: "1200px" }}
    >
      <div
        className="relative"
        style={{
          transform: "rotateX(50deg) rotateZ(-35deg)",
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
      >
        <div className="relative h-[420px]">
          {/* now axis */}
          <div
            className="absolute w-[2px]"
            style={{
              left: "55%",
              top: 0,
              height: "100%",
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent, transparent 5px, rgba(113, 113, 122, 0.5) 5px, rgba(113, 113, 122, 0.5) 9px)",
            }}
          />

          {/* time labels */}
          {timeLabels.map((label) =>
            label.current ? (
              <div
                key={label.time}
                className="absolute px-3 py-1 rounded-md bg-zinc-700/80 text-zinc-300 text-sm font-medium flex items-center gap-2"
                style={{ left: label.left, top: label.top }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {label.time}
              </div>
            ) : (
              <div
                key={label.time}
                className="absolute text-zinc-500 text-sm"
                style={{ left: label.left, top: label.top }}
              >
                {label.time}
              </div>
            ),
          )}

          {/* execution nodes */}
          {timelineSteps.map((node, i) => {
            const position = [
              { left: "13%", top: "245px", width: "38%" },
              { left: "70%", top: "210px", width: "30%" },
              { left: "3%", top: "150px", width: "34%" },
              { left: "59%", top: "112px", width: "30%" },
            ][i];
            return (
              <div
                key={node.title}
                className="absolute"
                style={{
                  left: position.left,
                  top: position.top,
                  width: position.width,
                }}
              >
                <StepChip step={node} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CompactTimeline() {
  return (
    <div className="rounded-xl border border-zinc-700/70 bg-zinc-900/70 backdrop-blur-sm shadow-2xl overflow-hidden md:hidden">
      <div className="px-5 pt-4 pb-3 border-b border-zinc-800 flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </span>
        <span className="text-[11px] text-zinc-500 font-mono">
          RUN-2041 · 1.2s
        </span>
        <span className="ml-auto text-[11px] text-zinc-500 font-mono">
          12:20
        </span>
      </div>
      <div className="px-5 py-4 space-y-3">
        {timelineSteps.map((step) => (
          <StepChip key={step.title} step={step} />
        ))}
      </div>
    </div>
  );
}

const features = [
  {
    icon: <Sparkles className="w-5 h-5 text-violet-400" />,
    title: "AI nodes",
    text: "Gemini & OpenAI-compatible models in any step.",
  },
  {
    icon: <ClipboardList className="w-5 h-5 text-amber-400" />,
    title: "Google Form trigger",
    text: "Start a flow the moment a form is submitted.",
  },
  {
    icon: <RotateCcw className="w-5 h-5 text-emerald-400" />,
    title: "Retry policies",
    text: "Automatic retries with backoff on failure.",
  },
  {
    icon: <ScrollText className="w-5 h-5 text-blue-400" />,
    title: "Execution logs",
    text: "Full history with per-node timing and output.",
  },
];

export function ProductDirectionSection() {
  return (
    <section className="relative py-40" style={{ backgroundColor: "#09090B" }}>
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "20%",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, transparent 100%)",
        }}
      />
      <div className="w-full flex justify-center px-6">
        <div className="w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-zinc-400 text-sm">
              Monitoring & execution
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-medium tracking-tight text-white max-w-3xl mb-8"
          >
            Track every execution
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 max-w-md mb-8"
          >
            <span className="text-white font-medium">
              Start a flow on demand or from a Google Form.
            </span>{" "}
            Watch every execution in real time and debug failures instantly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mb-24"
          >
            <TiltedTimeline />
            <CompactTimeline />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2"
          >
            <div className="border-t border-r border-b border-zinc-800 pt-10 pr-10 pb-16">
              <h3 className="text-xl font-medium text-zinc-200 mb-3">
                Execution history
              </h3>
              <p className="text-zinc-500 text-base leading-relaxed mb-8">
                Browse past runs, filter by status or trigger, and drill into
                any execution to see per-node timing and output.
              </p>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                <h4 className="text-lg font-medium text-zinc-200 mb-5">
                  Recent runs
                </h4>
                <div className="space-y-2">
                  {runs.map((run) => (
                    <div
                      key={run.id}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-zinc-800/30 transition-colors"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          run.status === "success"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="text-zinc-300 text-sm flex-1 font-mono">
                        {run.id}
                      </span>
                      <span className="text-zinc-500 text-xs">{run.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-b border-zinc-800 pt-10 pl-10 pb-16">
              <h3 className="text-xl font-medium text-zinc-200 mb-3">
                Run details
              </h3>
              <p className="text-zinc-500 text-base leading-relaxed mb-8">
                Inspect every node in an execution. See inputs, outputs, timing,
                and error logs at a glance.
              </p>
              <div className="relative h-48">
                <div
                  className="absolute rounded-lg bg-zinc-800/40 border border-zinc-700/30 px-4 py-2"
                  style={{ top: 0, left: "10%", width: "80%" }}
                >
                  <span className="flex items-center gap-2 text-zinc-500 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Triggered by Google Form
                  </span>
                </div>
                <div
                  className="absolute rounded-lg bg-zinc-800/60 border border-zinc-700/40 px-4 py-2"
                  style={{ top: "30px", left: "5%", width: "85%" }}
                >
                  <span className="flex items-center gap-2 text-zinc-400 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                    Ran 3 nodes
                  </span>
                </div>
                <div
                  className="absolute rounded-xl bg-zinc-800/90 border border-zinc-700/50 px-5 py-4"
                  style={{ top: "60px", left: 0, width: "95%" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </span>
                    <span className="text-emerald-500 font-medium text-sm">
                      All nodes completed
                    </span>
                  </div>
                  <p className="text-zinc-300 text-sm mb-3">
                    RUN-2041 completed in 1.2s
                  </p>
                  <span className="text-zinc-500 text-xs">
                    Triggered 2s ago
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-16"
          >
            {features.map((f) => (
              <div key={f.title}>
                <div className="flex items-center gap-2 mb-3">
                  {f.icon}
                  <span className="text-zinc-200 font-medium">{f.title}</span>
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {f.text}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

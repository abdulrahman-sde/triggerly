"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Zap,
  Webhook,
  Code,
} from "lucide-react";

const carouselCards = [
  {
    id: 1,
    category: "Forms",
    title: "Google Form response to Discord alert",
    mockup: "form-discord",
  },
  {
    id: 2,
    category: "Forms",
    title: "Form submission to HTTP endpoint",
    mockup: "form-http",
  },
  {
    id: 3,
    category: "AI",
    title: "Manual run to Gemini draft",
    mockup: "manual-gemini",
  },
  {
    id: 4,
    category: "AI",
    title: "Webhook to OpenAI classification",
    mockup: "webhook-openai",
  },
  {
    id: 5,
    category: "Developer",
    title: "Manual run to AI summary and HTTP",
    mockup: "manual-ai-http",
  },
  {
    id: 6,
    category: "Developer",
    title: "Build your own with the API",
    mockup: "api",
  },
];

function appIcon(src: string, className = "w-3.5 h-3.5") {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={className} aria-hidden="true" />
  );
}

function MiniFlow({
  nodes,
}: {
  nodes: { icon: React.ReactNode; label: string }[];
}) {
  return (
    <div className="flex items-center gap-2">
      {nodes.map((node, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-zinc-600 text-xs">→</span>}
          <div className="flex items-center gap-1.5 bg-zinc-800/50 border border-zinc-700/30 rounded-md px-2 py-1.5 backdrop-blur-sm">
            <span className="flex items-center justify-center w-3.5 h-3.5">
              {node.icon}
            </span>
            <span className="text-xs text-zinc-300 text-nowrap">
              {node.label}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function CardMockup({ type }: { type: string }) {
  switch (type) {
    case "form-discord":
      return (
        <div className="flex flex-col gap-3 p-4">
          <MiniFlow
            nodes={[
              { icon: appIcon("/assets/icons/google-form.svg"), label: "Submission" },
              { icon: appIcon("/assets/icons/discord.svg"), label: "Alert" },
            ]}
          />
          <div className="mt-2 flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/20 rounded-lg px-3 py-2">
            <span className="text-[10px] text-zinc-500 bg-zinc-700/70 px-1.5 py-0.5 rounded">
              Trigger
            </span>
            <span className="text-xs text-zinc-400">New response submitted</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-emerald-400" />
            </span>
            <span className="text-xs text-zinc-300">Runs on every response</span>
          </div>
        </div>
      );
    case "form-http":
      return (
        <div className="flex flex-col gap-3 p-4">
          <MiniFlow
            nodes={[
              { icon: appIcon("/assets/icons/google-form.svg"), label: "Submission" },
              { icon: appIcon("/assets/icons/http-request.svg"), label: "Create record" },
            ]}
          />
          <div className="mt-2 flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/20 rounded-lg px-3 py-2">
            <span className="text-[10px] text-zinc-500 bg-zinc-700/70 px-1.5 py-0.5 rounded">
              Trigger
            </span>
            <span className="text-xs text-zinc-400">New response submitted</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-emerald-400" />
            </span>
            <span className="text-xs text-zinc-300">2 steps, linear</span>
          </div>
        </div>
      );
    case "manual-gemini":
      return (
        <div className="flex flex-col gap-3 p-4">
          <MiniFlow
            nodes={[
              { icon: appIcon("/assets/icons/manual-trigger.svg"), label: "Run" },
              { icon: appIcon("/assets/icons/gemini.svg"), label: "Draft" },
              { icon: appIcon("/assets/icons/discord.svg"), label: "Post" },
            ]}
          />
          <div className="mt-2 flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/20 rounded-lg px-3 py-2">
            <span className="text-[10px] text-zinc-500 bg-zinc-700/70 px-1.5 py-0.5 rounded">
              Trigger
            </span>
            <span className="text-xs text-zinc-400">Run on demand</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-emerald-400" />
            </span>
            <span className="text-xs text-zinc-300">Manual execution</span>
          </div>
        </div>
      );
    case "webhook-openai":
      return (
        <div className="flex flex-col gap-3 p-4">
          <MiniFlow
            nodes={[
              { icon: <Webhook className="w-3.5 h-3.5 text-zinc-400" />, label: "HTTP request" },
              { icon: appIcon("/assets/icons/openai.svg"), label: "Classify" },
              { icon: appIcon("/assets/icons/discord.svg"), label: "Alert" },
            ]}
          />
          <div className="mt-2 flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/20 rounded-lg px-3 py-2">
            <span className="text-[10px] text-zinc-500 bg-zinc-700/70 px-1.5 py-0.5 rounded">
              Trigger
            </span>
            <span className="text-xs text-zinc-400">Webhook received</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-emerald-400" />
            </span>
            <span className="text-xs text-zinc-300">3 steps, linear</span>
          </div>
        </div>
      );
    case "manual-ai-http":
      return (
        <div className="flex flex-col gap-3 p-4">
          <MiniFlow
            nodes={[
              { icon: appIcon("/assets/icons/manual-trigger.svg"), label: "Run" },
              { icon: appIcon("/assets/icons/gemini.svg"), label: "Summarize" },
              { icon: appIcon("/assets/icons/http-request.svg"), label: "Send" },
            ]}
          />
          <div className="mt-2 flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/20 rounded-lg px-3 py-2">
            <span className="text-[10px] text-zinc-500 bg-zinc-700/70 px-1.5 py-0.5 rounded">
              Trigger
            </span>
            <span className="text-xs text-zinc-400">Run on demand</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-emerald-400" />
            </span>
            <span className="text-xs text-zinc-300">3 steps, linear</span>
          </div>
        </div>
      );
    case "api":
      return (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-zinc-800/50 rounded-lg px-4 py-3 border border-zinc-700/30 backdrop-blur-sm">
              <Code className="w-6 h-6 text-zinc-400" />
            </div>
            <span className="text-xs font-mono text-zinc-500">
              POST /api/webhooks/google-form
            </span>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export function WorkflowsSection() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollLeft = () => setScrollPosition(Math.max(0, scrollPosition - 1));
  const scrollRight = () =>
    setScrollPosition(Math.min(carouselCards.length - 4, scrollPosition + 1));

  return (
    <section className="relative py-24" style={{ backgroundColor: "#09090B" }}>
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "20%",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)",
        }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-16">
          <div className="lg:max-w-xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-sm text-zinc-400">
                Templates & integrations
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </div>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white">
              Start from a template
            </h2>
          </div>
          <p className="text-zinc-400 lg:max-w-sm lg:pt-12">
            Pick a pre-built template, customize the nodes, and go live in
            minutes. No wiring from scratch.
          </p>
        </div>
        <div className="relative overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${scrollPosition * (100 / 4)}%)` }}
          >
            {carouselCards.map((card) => (
              <div
                key={card.id}
                className="flex-shrink-0 w-[calc(25%-12px)] min-w-[280px]"
              >
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden h-[340px] flex flex-col backdrop-blur-sm">
                  <div className="flex-1 relative overflow-hidden">
                    <CardMockup type={card.mockup} />
                    <div
                      className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(9,9,11,0.95), transparent)",
                      }}
                    />
                  </div>
                  <div className="p-4 border-t border-zinc-800">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-zinc-500 mb-1">
                          {card.category}
                        </p>
                        <p className="text-sm text-zinc-100 leading-snug font-medium">
                          {card.title}
                        </p>
                      </div>
                      <button className="flex-shrink-0 w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={scrollLeft}
            disabled={scrollPosition === 0}
            className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            disabled={scrollPosition >= carouselCards.length - 4}
            className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

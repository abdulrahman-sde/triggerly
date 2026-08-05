"use client"

import { motion } from "motion/react"
import { ChevronRight, Plus } from "lucide-react"

const featureCards = [
  {
    title: "Visual node editor",
    illustration: <NodeEditorIllustration />,
  },
  {
    title: "AI-powered flows",
    illustration: <AIFlowsIllustration />,
  },
  {
    title: "Execution monitoring",
    illustration: <ExecutionMonitoringIllustration />,
  },
]

// Mini canvas with dotted grid + a trigger -> action -> action chain.
function NodeEditorIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
      <svg width="100%" height="100%" viewBox="0 0 360 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-full max-h-full">
        <defs>
          <pattern id="node-grid" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="white" fillOpacity="0.08" />
          </pattern>
        </defs>
        <rect width="360" height="300" fill="url(#node-grid)" />

        {/* connectors */}
        <path d="M120 110 C 165 110, 165 150, 210 150" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M250 150 C 250 190, 150 190, 150 210" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* trigger node (Google Form) */}
        <g>
          <rect x="30" y="80" width="90" height="46" rx="8" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.45)" strokeWidth="1" />
          <rect x="45" y="97" width="10" height="10" rx="2.5" stroke="rgba(245,158,11,0.9)" strokeWidth="1.2" />
          <rect x="48" y="100" width="4" height="1.5" rx="0.75" fill="rgba(245,158,11,0.9)" />
          <rect x="48" y="103.5" width="4" height="1.5" rx="0.75" fill="rgba(245,158,11,0.6)" />
          <rect x="62" y="93" width="48" height="7" rx="2" fill="white" fillOpacity="0.5" />
          <rect x="62" y="105" width="34" height="5" rx="2" fill="white" fillOpacity="0.22" />
        </g>

        {/* action node (HTTP request, selected) */}
        <g>
          <rect x="210" y="125" width="90" height="50" rx="8" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.7)" strokeWidth="1.2" />
          <rect x="210" y="125" width="90" height="50" rx="8" stroke="rgba(59,130,246,0.25)" strokeWidth="4" />
          <circle cx="232" cy="145" r="5.5" stroke="rgba(147,197,253,0.9)" strokeWidth="1.2" />
          <line x1="227" y1="145" x2="237" y2="145" stroke="rgba(147,197,253,0.9)" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="246" y="139" width="42" height="7" rx="2" fill="white" fillOpacity="0.55" />
          <rect x="246" y="151" width="30" height="5" rx="2" fill="white" fillOpacity="0.22" />
        </g>

        {/* action node (Discord) */}
        <g>
          <rect x="105" y="210" width="90" height="46" rx="8" fill="rgba(255,255,255,0.03)" stroke="white" strokeOpacity="0.18" strokeWidth="1" />
          <rect x="121" y="223" width="12" height="12" rx="3.5" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
          <circle cx="125" cy="229" r="1.2" fill="white" fillOpacity="0.7" />
          <circle cx="129" cy="229" r="1.2" fill="white" fillOpacity="0.7" />
          <rect x="141" y="226" width="42" height="7" rx="2" fill="white" fillOpacity="0.4" />
          <rect x="141" y="238" width="30" height="5" rx="2" fill="white" fillOpacity="0.18" />
        </g>
      </svg>
    </div>
  )
}

// Prompt -> Gemini node -> Discord node: AI as a step in the flow.
function AIFlowsIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
      <svg width="100%" height="100%" viewBox="0 0 360 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-full max-h-full">
        <defs>
          <pattern id="ai-grid" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="white" fillOpacity="0.08" />
          </pattern>
        </defs>
        <rect width="360" height="300" fill="url(#ai-grid)" />

        {/* prompt bar */}
        <rect x="80" y="28" width="200" height="30" rx="8" fill="rgba(255,255,255,0.03)" stroke="white" strokeOpacity="0.16" strokeWidth="1" />
        <rect x="94" y="38" width="110" height="6" rx="3" fill="white" fillOpacity="0.35" />
        <rect x="94" y="48" width="70" height="5" rx="2.5" fill="white" fillOpacity="0.18" />
        <path d="M266 38 L268.2 43 L273 45.2 L268.2 47.4 L266 52.4 L263.8 47.4 L259 45.2 L263.8 43 Z" fill="rgba(167,139,250,0.9)" />

        {/* connector */}
        <path d="M180 58 L180 96" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" />

        {/* Gemini node */}
        <g>
          <rect x="145" y="96" width="70" height="44" rx="10" fill="rgba(139,92,246,0.08)" stroke="rgba(139,92,246,0.55)" strokeWidth="1.2" />
          <path d="M160 104 L162.2 109 L167 111.2 L162.2 113.4 L160 118.4 L157.8 113.4 L153 111.2 L157.8 109 Z" fill="rgba(167,139,250,0.95)" />
          <rect x="175" y="108" width="28" height="6" rx="3" fill="white" fillOpacity="0.55" />
          <rect x="175" y="119" width="20" height="5" rx="2.5" fill="white" fillOpacity="0.22" />
        </g>

        {/* connector */}
        <path d="M180 140 L180 178" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" />

        {/* Discord node */}
        <g>
          <rect x="145" y="178" width="70" height="44" rx="10" fill="rgba(255,255,255,0.03)" stroke="white" strokeOpacity="0.18" strokeWidth="1" />
          <rect x="158" y="192" width="12" height="12" rx="3.5" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
          <circle cx="162" cy="198" r="1.2" fill="white" fillOpacity="0.7" />
          <circle cx="166" cy="198" r="1.2" fill="white" fillOpacity="0.7" />
          <rect x="178" y="196" width="24" height="6" rx="3" fill="white" fillOpacity="0.4" />
          <rect x="178" y="207" width="18" height="5" rx="2.5" fill="white" fillOpacity="0.18" />
        </g>

        {/* status pill */}
        <rect x="222" y="246" width="96" height="20" rx="10" fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.35)" strokeWidth="1" />
        <rect x="236" y="253" width="44" height="6" rx="3" fill="rgba(167,139,250,0.8)" />
      </svg>
    </div>
  )
}

// Linear chain with per-node status + execution history ticks.
function ExecutionMonitoringIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
      <svg width="100%" height="100%" viewBox="0 0 360 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-full max-h-full">
        <defs>
          <pattern id="run-grid" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="white" fillOpacity="0.08" />
          </pattern>
        </defs>
        <rect width="360" height="300" fill="url(#run-grid)" />

        {/* connectors */}
        <line x1="104" y1="144" x2="134" y2="144" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="222" y1="144" x2="252" y2="144" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />

        {/* node 1: trigger (success) */}
        <g>
          <rect x="20" y="120" width="84" height="48" rx="8" fill="rgba(52,211,153,0.06)" stroke="rgba(52,211,153,0.45)" strokeWidth="1.2" />
          <rect x="32" y="130" width="10" height="10" rx="2.5" stroke="rgba(52,211,153,0.9)" strokeWidth="1.2" />
          <path d="M34.5 135 L36.5 137 L39.5 133.5" stroke="rgba(52,211,153,0.9)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <rect x="48" y="132" width="44" height="6" rx="3" fill="white" fillOpacity="0.5" />
          <rect x="48" y="143" width="32" height="5" rx="2.5" fill="white" fillOpacity="0.22" />
        </g>

        {/* node 2: action (running) */}
        <g>
          <rect x="138" y="120" width="84" height="48" rx="8" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.6)" strokeWidth="1.2" />
          <circle cx="150" cy="135" r="5" stroke="rgba(147,197,253,0.9)" strokeWidth="1.2" />
          <line x1="146" y1="135" x2="154" y2="135" stroke="rgba(147,197,253,0.9)" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="162" y="132" width="48" height="6" rx="3" fill="white" fillOpacity="0.5" />
          <rect x="162" y="143" width="36" height="5" rx="2.5" fill="white" fillOpacity="0.22" />
        </g>

        {/* node 3: action (failed) */}
        <g>
          <rect x="256" y="120" width="84" height="48" rx="8" fill="rgba(248,113,113,0.06)" stroke="rgba(248,113,113,0.5)" strokeWidth="1.2" />
          <rect x="268" y="130" width="10" height="10" rx="3.5" stroke="rgba(248,113,113,0.9)" strokeWidth="1.2" />
          <circle cx="272" cy="135" r="1.2" fill="rgba(248,113,113,0.9)" />
          <circle cx="276" cy="135" r="1.2" fill="rgba(248,113,113,0.9)" />
          <rect x="284" y="132" width="44" height="6" rx="3" fill="white" fillOpacity="0.5" />
          <rect x="284" y="143" width="32" height="5" rx="2.5" fill="white" fillOpacity="0.22" />
        </g>

        {/* execution history ticks */}
        <line x1="32" y1="212" x2="328" y2="212" stroke="white" strokeOpacity="0.14" strokeWidth="1.5" strokeLinecap="round" />
        {[40, 105, 170, 235, 300].map((x, i) => (
          <rect
            key={x}
            x={x}
            y="204"
            width="12"
            height="16"
            rx="3"
            fill={i === 2 ? "rgba(248,113,113,0.5)" : "rgba(52,211,153,0.4)"}
          />
        ))}
      </svg>
    </div>
  )
}

export function FeatureCardsSection() {
  return (
    <div className="relative z-20 py-40" style={{ backgroundColor: "#09090B" }}>
      <div className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{ height: "20%", background: "linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, transparent 100%)" }} />
      <div className="w-full flex justify-center px-6">
        <div className="w-full max-w-5xl">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl font-medium tracking-tight text-white max-w-md">
              Everything you need to automate
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-md">
              <p className="text-zinc-400 leading-relaxed">
                Triggerly is built around a drag-and-drop node editor, AI-powered nodes for any language model, and linear, predictable flows you can trace end to end.{" "}
                <a href="/dashboard" className="text-white inline-flex items-center gap-1 hover:underline">See how it works <ChevronRight className="w-4 h-4" /></a>
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featureCards.map((card, index) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors group overflow-hidden relative flex flex-col justify-end"
                style={{ aspectRatio: "336 / 360", borderRadius: "30px", height: "360px", isolation: "isolate" }}>
                <div className="absolute top-0 left-0 w-full flex"
                  style={{ maskImage: "linear-gradient(#000 70%, transparent 90%)", WebkitMaskImage: "linear-gradient(#000 70%, transparent 90%)" }}>
                  {card.illustration}
                </div>
                <div className="relative z-10 flex items-center justify-between w-full" style={{ padding: "0 24px 40px", gap: "16px" }}>
                  <h3 className="text-white font-medium text-lg leading-tight">{card.title}</h3>
                  <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 group-hover:border-zinc-500 group-hover:text-zinc-300 transition-colors flex-shrink-0">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

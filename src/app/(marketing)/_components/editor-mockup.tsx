"use client"

import type React from "react"
import { motion } from "motion/react"
import {
  Workflow, Activity, KeyRound, ChevronDown, ChevronRight, CirclePower,
  Zap, GitBranch, Filter, Play, Plus, Search,
} from "lucide-react"
import { Slack } from "../../../../public/assets/icons/slack"
import { GitHub } from "../../../../public/assets/icons/github"
import { Stripe } from "../../../../public/assets/icons/stripe"
import { Notion } from "../../../../public/assets/icons/notion"

export function EditorMockup() {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.3, delayChildren: 0.5 } },
  }
  const panelVariants = {
    hidden: { opacity: 0, x: 100, y: -80 },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const } },
  }

  return (
    <motion.div className="w-full h-full bg-zinc-950 flex overflow-hidden" variants={containerVariants} initial="hidden" animate="visible">
      {/* Node palette */}
      <motion.div className="w-[220px] h-full bg-zinc-900/80 border-r border-zinc-800/50 flex flex-col shrink-0" variants={panelVariants}>
        <div className="p-3 border-b border-zinc-800/50">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <CirclePower className="w-5 h-5 text-white" />
            <span className="text-white font-semibold text-sm">Sprint</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 ml-auto" />
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-800/50 rounded-md text-zinc-500 text-xs">
            <Search className="w-3.5 h-3.5" />
            <span>Search nodes...</span>
            <span className="ml-auto text-[10px] bg-zinc-700/50 px-1.5 py-0.5 rounded">⌘K</span>
          </div>
        </div>
        <div className="px-3 space-y-0.5">
          <NavItem icon={Workflow} label="Editor" active />
          <NavItem icon={Activity} label="Executions" />
          <NavItem icon={KeyRound} label="Credentials" />
        </div>
        <div className="mt-5 px-3">
          <div className="px-2 py-1 text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Nodes</div>
          <div className="space-y-0.5 mt-1">
            <NavItem icon={Zap} label="Triggers" hasSubmenu color="text-amber-400" />
            <NavItem icon={GitBranch} label="Actions" hasSubmenu color="text-emerald-400" />
            <NavItem icon={Filter} label="Logic" hasSubmenu color="text-blue-400" />
          </div>
        </div>
        <div className="mt-5 px-3 flex-1">
          <div className="px-2 py-1 text-[10px] text-zinc-500 font-medium uppercase tracking-wider flex items-center gap-1">Apps</div>
          <div className="space-y-0.5 mt-1">
            <AppNavItem icon={Slack} label="Slack" />
            <AppNavItem icon={GitHub} label="GitHub" />
            <AppNavItem icon={Stripe} label="Stripe" />
            <AppNavItem icon={Notion} label="Notion" />
          </div>
        </div>
        <div className="p-3 border-t border-zinc-800/50">
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-emerald-500/10 rounded-md text-emerald-400 text-xs">
            <Play className="w-3.5 h-3.5" />
            <span className="font-medium">Run workflow</span>
          </div>
        </div>
      </motion.div>

      {/* Canvas */}
      <motion.div className="relative flex-1 h-full bg-zinc-950 overflow-hidden" variants={panelVariants}>
        <CanvasGrid />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[640px] h-[420px]">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 640 420" fill="none">
              <path d="M150 70 C 230 70, 230 210, 310 210" stroke="rgba(113,113,122,0.6)" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M400 190 C 460 190, 460 110, 520 110" stroke="rgba(113,113,122,0.6)" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M400 230 C 460 230, 460 320, 520 320" stroke="rgba(113,113,122,0.6)" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
            <CanvasNode x={20} y={30} icon={Slack} accent="amber" title="New message" subtitle="Slack · Trigger" />
            <CanvasNode x={280} y={170} icon={Filter} accent="blue" title="Filter" subtitle="If channel = #ops" selected />
            <CanvasNode x={500} y={70} icon={GitHub} accent="zinc" title="Create issue" subtitle="GitHub · Action" />
            <CanvasNode x={500} y={280} icon={Notion} accent="zinc" title="Add page" subtitle="Notion · Action" />
          </div>
        </div>
      </motion.div>

      {/* Inspector */}
      <motion.div className="w-[300px] h-full bg-zinc-900/40 border-l border-zinc-800/50 flex flex-col shrink-0" variants={panelVariants}>
        <div className="px-4 py-3 border-b border-zinc-800/50 flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-400" />
          <span className="text-white text-sm font-medium">Filter</span>
          <span className="ml-auto text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">Logic</span>
        </div>
        <div className="p-4 space-y-4 overflow-auto scrollbar-hide">
          <FieldRow label="Condition">
            <span className="text-zinc-300 text-[11px]">channel equals #ops</span>
          </FieldRow>
          <FieldRow label="Operator">
            <span className="text-zinc-300 text-[11px]">AND</span>
          </FieldRow>
          <FieldRow label="Retry on fail">
            <span className="text-emerald-400 text-[11px]">3 attempts</span>
          </FieldRow>
          <div className="pt-3 border-t border-zinc-800/50">
            <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mb-2">Input mapping</div>
            <div className="bg-zinc-950 rounded-lg p-3 space-y-2 font-mono text-[11px]">
              <div><span className="text-zinc-500">value</span><span className="text-zinc-400">: </span><span className="text-emerald-300">{"{{message.text}}"}</span></div>
              <div><span className="text-zinc-500">user</span><span className="text-zinc-400">: </span><span className="text-emerald-300">{"{{message.author}}"}</span></div>
              <div><span className="text-zinc-500">ts</span><span className="text-zinc-400">: </span><span className="text-emerald-300">{"{{message.ts}}"}</span></div>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 border border-zinc-700/60 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 text-xs py-2 rounded-md transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add condition
          </button>
        </div>
        <div className="px-4 py-3 border-t border-zinc-800/50">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Healthy</span>
            <span className="text-zinc-600 ml-auto">saved 2s ago</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function NavItem({ icon: Icon, label, active, hasSubmenu, color }: {
  icon: React.ElementType; label: string; active?: boolean; hasSubmenu?: boolean; color?: string
}) {
  return (
    <div className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${active ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300"}`}>
      <Icon className={`w-4 h-4 ${color || ""}`} />
      <span className="flex-1 text-xs">{label}</span>
      {hasSubmenu && <ChevronRight className="w-3 h-3 text-zinc-600" />}
    </div>
  )
}

function AppNavItem({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300">
      <Icon className="w-4 h-4" />
      <span className="flex-1 text-xs">{label}</span>
    </div>
  )
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-zinc-500">{label}</span>
      {children}
    </div>
  )
}

function CanvasGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="editor-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.06)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#editor-grid)" />
    </svg>
  )
}

function CanvasNode({ x, y, icon: Icon, accent, title, subtitle, selected }: {
  x: number; y: number; icon: React.ElementType; accent: "amber" | "blue" | "zinc"; title: string; subtitle: string; selected?: boolean
}) {
  const accentClass = {
    amber: "bg-amber-500/15 text-amber-400",
    blue: "bg-blue-500/15 text-blue-400",
    zinc: "bg-zinc-700/40 text-zinc-300",
  }[accent]
  return (
    <div
      className={`absolute w-[120px] rounded-lg border bg-zinc-900/90 px-3 py-2.5 backdrop-blur-sm transition-colors ${selected ? "border-blue-500 ring-2 ring-blue-500/30" : "border-zinc-700/60 hover:border-zinc-600"}`}
      style={{ left: x, top: y }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className={`w-5 h-5 rounded flex items-center justify-center ${accentClass}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="text-white text-xs font-medium">{title}</span>
      </div>
      <div className="text-[10px] text-zinc-500">{subtitle}</div>
      <div className={`absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${selected ? "bg-blue-500" : "bg-zinc-600"}`} />
      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-600" />
    </div>
  )
}

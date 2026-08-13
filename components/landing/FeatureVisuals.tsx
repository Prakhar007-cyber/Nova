"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "motion/react";
import { FileText, Sparkles, GitBranch, Mail, Database, Bell, TrendingUp } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

/* ---------- 1. AI Workspace: doc generation ---------- */
export function WorkspaceVisual() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-15%" });
  const lines = [
    { w: "70%", d: 0.2 },
    { w: "92%", d: 0.35 },
    { w: "84%", d: 0.5 },
    { w: "60%", d: 0.65 },
    { w: "78%", d: 0.8 },
  ];
  return (
    <div ref={ref} className="relative h-full min-h-75 w-full overflow-hidden rounded-2xl border border-mist-100/8 bg-ink-850/60 p-5">
      <div className="flex items-center gap-2 text-[12px] text-mist-400">
        <FileText className="h-4 w-4" /> Product Brief — Draft
        <span className="ml-auto flex items-center gap-1 rounded-full bg-iris-500/12 px-2 py-0.5 text-[10px] text-iris-300">
          <Sparkles className="h-2.5 w-2.5" /> Generating
        </span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease }}
        className="mt-5 text-[17px] font-semibold text-mist-100"
      >
        NOVA Mobile — Beta Launch
      </motion.div>
      <div className="mt-4 space-y-2.5">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            className="h-2.5 rounded-full bg-linear-to-r from-mist-100/18 to-mist-100/5"
            initial={{ width: 0, opacity: 0 }}
            animate={inView ? { width: l.w, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: l.d, ease }}
          />
        ))}
      </div>
      <motion.div
        className="mt-5 inline-flex items-center gap-2 rounded-lg border border-iris-400/20 bg-iris-500/[0.07] px-3 py-2 text-[12px] text-iris-200"
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1, duration: 0.6, ease }}
      >
        <Sparkles className="h-3.5 w-3.5" /> NOVA added 3 sections & 6 tasks
      </motion.div>
    </div>
  );
}

/* ---------- 2. Automation: node graph ---------- */
export function AutomationVisual() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-15%" });
  const nodes = [
    { icon: Mail, label: "New email", x: 12, y: 30 },
    { icon: Sparkles, label: "AI triage", x: 42, y: 55 },
    { icon: Database, label: "Save to CRM", x: 74, y: 26 },
    { icon: Bell, label: "Notify team", x: 74, y: 74 },
  ];
  const edges = [
    ["12,30", "42,55"],
    ["42,55", "74,26"],
    ["42,55", "74,74"],
  ];
  return (
    <div ref={ref} className="relative h-full min-h-75 w-full overflow-hidden rounded-2xl border border-mist-100/8 bg-ink-850/60 p-5">
      <div className="flex items-center gap-2 text-[12px] text-mist-400">
        <GitBranch className="h-4 w-4" /> Flow — Inbox automation
        <span className="ml-auto flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[10px] text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-glow" /> Live
        </span>
      </div>
      <svg viewBox="0 0 100 100" className="mt-2 h-60 w-full" preserveAspectRatio="none">
        {edges.map(([a, b], i) => {
          const [x1, y1] = a.split(",").map(Number);
          const [x2, y2] = b.split(",").map(Number);
          const mx = (x1 + x2) / 2;
          return (
            <motion.path
              key={i}
              d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
              fill="none"
              stroke="url(#edge)"
              strokeWidth="0.6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 + i * 0.25, ease }}
            />
          );
        })}
        <defs>
          <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7c66ff" />
            <stop offset="1" stopColor="#52d9f0" />
          </linearGradient>
        </defs>
      </svg>
      {nodes.map((n, i) => (
        <motion.div
          key={i}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-lg border border-mist-100/12 bg-ink-800/90 px-2.5 py-1.5 text-[11px] text-mist-200 backdrop-blur"
          style={{ left: `${n.x}%`, top: `${18 + n.y * 0.62}%` }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2 + i * 0.2, duration: 0.5, ease }}
        >
          <n.icon className="h-3.5 w-3.5 text-iris-300" />
          {n.label}
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- 3. Insights: chart + counters ---------- */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease,
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to]);
  return (
    <span ref={ref}>
      {Number.isInteger(to) ? Math.round(val) : val.toFixed(1)}
      {suffix}
    </span>
  );
}

export function InsightsVisual() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-15%" });
  const bars = [38, 55, 44, 68, 60, 82, 74, 95];
  return (
    <div ref={ref} className="relative h-full min-h-75 w-full overflow-hidden rounded-2xl border border-mist-100/8 bg-ink-850/60 p-5">
      <div className="flex items-center gap-2 text-[12px] text-mist-400">
        <TrendingUp className="h-4 w-4" /> Insights — Productivity
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { label: "Tasks / day", to: 42 },
          { label: "Focus hrs", to: 6.4 },
          { label: "Automated", to: 87, suffix: "%" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-mist-100/8 bg-ink-800/50 p-3">
            <div className="text-[19px] font-semibold text-mist-50">
              <Counter to={s.to} suffix={s.suffix} />
            </div>
            <div className="mt-0.5 text-[10px] text-mist-400">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex h-28 items-end gap-2">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t bg-linear-to-t from-iris-500/30 via-iris-400/60 to-cyan-400/80"
            initial={{ height: 0 }}
            animate={inView ? { height: `${h}%` } : {}}
            transition={{ duration: 0.8, delay: i * 0.05, ease }}
          />
        ))}
      </div>
    </div>
  );
}

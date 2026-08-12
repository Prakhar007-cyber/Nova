"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import {
  Sparkles,
  LayoutGrid,
  CheckSquare,
  FileText,
  BarChart3,
  Search,
  Bell,
  Plus,
  Command,
  Zap,
  Circle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { icon: LayoutGrid, label: "Workspace", active: true },
  { icon: CheckSquare, label: "Tasks" },
  { icon: FileText, label: "Documents" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Zap, label: "Automations" },
];

const initialTasks = [
  { label: "Draft Q3 launch brief", done: true },
  { label: "Summarize user interviews", done: true },
  { label: "Generate roadmap outline", done: false },
  { label: "Review automation flow", done: false },
];

const chat =
  "Draft a launch plan for the NOVA mobile beta, then create tasks for each milestone.";

/** A living product surface: typing AI, self-completing tasks, animated chart. */
export default function DashboardMock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-20%" });
  const [typed, setTyped] = useState("");
  const [tasks, setTasks] = useState(initialTasks);
  const [replying, setReplying] = useState(false);

  // typing loop
  useEffect(() => {
    if (!inView) return;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const type = () => {
      if (i <= chat.length) {
        setTyped(chat.slice(0, i));
        i++;
        timer = setTimeout(type, 34 + Math.random() * 40);
      } else {
        setReplying(true);
        timer = setTimeout(() => {
          setReplying(false);
          setTyped("");
          i = 0;
          type();
        }, 4200);
      }
    };
    type();
    return () => clearTimeout(timer);
  }, [inView]);

  // task auto-complete loop
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      setTasks((prev) => {
        const next = prev.map((t) => ({ ...t }));
        const idx = next.findIndex((t) => !t.done);
        if (idx === -1) {
          return initialTasks.map((t) => ({ ...t }));
        }
        next[idx].done = true;
        return next;
      });
    }, 1900);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden rounded-2xl border border-mist-100/10 bg-ink-900/80 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl"
    >
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-mist-100/8 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]/80" />
        <div className="mx-auto flex items-center gap-2 rounded-md border border-mist-100/8 bg-ink-800/60 px-3 py-1 text-[11px] text-mist-400">
          <Command className="h-3 w-3" /> nova.app / workspace
        </div>
      </div>

      <div className="grid grid-cols-[180px_1fr] max-md:grid-cols-1">
        {/* sidebar */}
        <aside className="border-r border-mist-100/8 p-3 max-md:hidden">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-linear-to-br from-iris-400 to-cyan-400 text-ink-950">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-mist-100">Atlas Labs</span>
          </div>
          <nav className="mt-4 space-y-1">
            {nav.map((n) => (
              <div
                key={n.label}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors",
                  n.active
                    ? "bg-mist-50/[0.07] text-mist-50"
                    : "text-mist-400 hover:text-mist-200"
                )}
              >
                <n.icon className="h-4 w-4" strokeWidth={1.8} />
                {n.label}
              </div>
            ))}
          </nav>
          <div className="mt-6 rounded-xl border border-iris-400/20 bg-iris-500/6 p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-iris-300">
              <Sparkles className="h-3 w-3" /> AI credits
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
              <div className="h-full w-2/3 rounded-full bg-linear-to-r from-iris-400 to-cyan-400" />
            </div>
            <div className="mt-1.5 text-[10px] text-mist-400">6,400 left this month</div>
          </div>
        </aside>

        {/* main */}
        <div className="min-w-0 p-4">
          {/* top bar */}
          <div className="flex items-center gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-mist-100/8 bg-ink-800/50 px-3 py-2 text-[12px] text-mist-400">
              <Search className="h-3.5 w-3.5" /> Search or ask NOVA…
            </div>
            <div className="grid h-8 w-8 place-items-center rounded-lg border border-mist-100/8 text-mist-400">
              <Bell className="h-3.5 w-3.5" />
            </div>
            <div className="h-8 w-8 rounded-full bg-linear-to-br from-violet-500 to-cyan-400" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 max-lg:grid-cols-1">
            {/* AI assistant */}
            <div className="col-span-2 rounded-xl border border-mist-100/8 bg-ink-850/60 p-3.5 max-lg:col-span-1">
              <div className="flex items-center gap-2 text-[12px] font-medium text-mist-200">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-iris-500/15 text-iris-300">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                NOVA Assistant
                <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-300/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-glow" /> online
                </span>
              </div>
              <div className="mt-3 flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-mist-50/6 px-3 py-2 text-[12px] leading-relaxed text-mist-200">
                  {typed}
                  <span className="ml-0.5 inline-block h-3 w-px translate-y-0.5 bg-iris-300 animate-pulse" />
                </div>
              </div>
              {replying && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex justify-start"
                >
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-iris-400/20 bg-iris-500/[0.07] px-3 py-2 text-[12px] leading-relaxed text-mist-200">
                    Here&apos;s a 4-phase launch plan. I&apos;ve created{" "}
                    <span className="text-iris-300">6 tasks</span> and a shared doc
                    for the beta rollout.
                  </div>
                </motion.div>
              )}
            </div>

            {/* tasks */}
            <div className="rounded-xl border border-mist-100/8 bg-ink-850/60 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-mist-200">Tasks</span>
                <Plus className="h-3.5 w-3.5 text-mist-400" />
              </div>
              <div className="mt-3 space-y-2">
                {tasks.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-[12px]">
                    {t.done ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-mist-500" />
                    )}
                    <span
                      className={cn(
                        "truncate transition-colors",
                        t.done ? "text-mist-500 line-through" : "text-mist-200"
                      )}
                    >
                      {t.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* analytics */}
            <div className="rounded-xl border border-mist-100/8 bg-ink-850/60 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-mist-200">This week</span>
                <span className="text-[11px] text-emerald-300">+24%</span>
              </div>
              <div className="mt-4 flex h-20 items-end gap-1.5">
                {[40, 62, 48, 78, 56, 90, 72].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t bg-linear-to-t from-iris-500/40 to-cyan-400/70"
                    initial={{ height: 0 }}
                    animate={inView ? { height: `${h}%` } : { height: 0 }}
                    transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[9px] text-mist-500">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <span key={i}>{d}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import {
  Sparkles,
  Users,
  Search,
  Workflow,
  BarChart3,
  BookOpen,
} from "lucide-react";
import { Reveal, MaskText } from "@/components/ui/Reveal";
import SectionFX from "./SectionFX";
import { cn } from "@/lib/utils";

/* --- tilt wrapper: subtle depth on hover --- */
function TiltCard({
  children,
  className,
  span,
}: {
  children: React.ReactNode;
  className?: string;
  span?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0 });
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setT({ rx: -py * 6, ry: px * 6 });
  };
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setT({ rx: 0, ry: 0 })}
      style={{ transform: `perspective(900px) rotateX(${t.rx}deg) rotateY(${t.ry}deg)` }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-mist-100/8 bg-ink-850/50 p-6 transition-[border-color,box-shadow] duration-300 hover:border-mist-100/16 hover:shadow-[0_30px_80px_-40px_rgba(124,102,255,0.5)]",
        span,
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(300px_circle_at_var(--x,50%)_var(--y,50%),rgba(124,102,255,0.1),transparent)]" />
      {children}
    </motion.div>
  );
}

function Head({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="relative z-10">
      <div className="inline-flex items-center gap-2 text-mist-100">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-mist-50/6 text-iris-300">
          <Icon className="h-4 w-4" strokeWidth={1.8} />
        </span>
        <span className="text-[15px] font-medium">{title}</span>
      </div>
      <p className="mt-2 max-w-[34ch] text-[13px] leading-relaxed text-mist-400">{desc}</p>
    </div>
  );
}

/* --- mini visuals --- */
function Waveform() {
  return (
    <div className="mt-7">
      <div className="flex h-20 items-center gap-1">
        {Array.from({ length: 30 }).map((_, i) => {
          // smooth bell-ish envelope so the middle reads louder
          const env = 0.35 + Math.sin((i / 29) * Math.PI) * 0.65;
          return (
            <motion.span
              key={i}
              className="h-full w-1 flex-1 rounded-full bg-linear-to-t from-iris-500/40 via-iris-400/70 to-cyan-300/90"
              animate={{ scaleY: [0.18 * env, env, 0.4 * env, 0.85 * env, 0.18 * env] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.045,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: "bottom" }}
            />
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-2 text-[12px] text-mist-400">
        <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-iris-400" />
        Listening — “summarize today&apos;s standup”
      </div>
    </div>
  );
}

function Avatars() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-10%" });
  const grad = [
    "from-iris-400 to-cyan-400",
    "from-violet-500 to-iris-400",
    "from-cyan-400 to-emerald-400",
    "from-rose-400 to-violet-500",
    "from-amber-400 to-rose-400",
  ];
  return (
    <div ref={ref} className="mt-6 flex items-center">
      {grad.map((g, i) => (
        <motion.div
          key={i}
          className={cn(
            "-ml-2 h-9 w-9 rounded-full border-2 border-ink-850 bg-linear-to-br first:ml-0",
            g
          )}
          initial={{ opacity: 0, scale: 0, x: -8 }}
          animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
          transition={{ delay: i * 0.12, type: "spring", stiffness: 300, damping: 20 }}
        />
      ))}
      <span className="ml-3 text-[12px] text-mist-400">+12 online</span>
    </div>
  );
}

function SearchResults() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-10%" });
  const results = ["Launch plan.doc", "Q3 metrics", "Design tokens"];
  return (
    <div ref={ref} className="mt-6">
      <div className="flex items-center gap-2 rounded-lg border border-mist-100/10 bg-ink-800/60 px-3 py-2 text-[12px] text-mist-300">
        <Search className="h-3.5 w-3.5" /> launch
        <span className="ml-0.5 h-3 w-px bg-iris-300 animate-pulse" />
      </div>
      <div className="mt-2 space-y-1.5">
        {results.map((r, i) => (
          <motion.div
            key={r}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[12px] text-mist-300 hover:bg-mist-50/5"
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 + i * 0.15 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-iris-400" /> {r}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MiniFlow() {
  return (
    <svg viewBox="0 0 120 60" className="mt-5 h-20 w-full">
      {[
        "M8 30 H40",
        "M40 30 C 52 30, 52 14, 68 14",
        "M40 30 C 52 30, 52 46, 68 46",
        "M92 14 H112",
        "M92 46 H112",
      ].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke="#7c66ff"
          strokeWidth="1.4"
          strokeLinecap="round"
          animate={{ pathLength: [0, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
      {[
        [40, 30],
        [68, 14],
        [68, 46],
        [92, 14],
        [92, 46],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.4" className="fill-cyan-400" />
      ))}
    </svg>
  );
}

function MiniChart() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-10%" });
  return (
    <div ref={ref} className="mt-6 flex h-16 items-end gap-1.5">
      {[45, 62, 40, 78, 66, 90].map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t bg-linear-to-t from-iris-500/40 to-cyan-400/70"
          initial={{ height: 0 }}
          animate={inView ? { height: `${h}%` } : {}}
          transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  );
}

function DocsStack() {
  return (
    <div className="mt-6 space-y-2">
      {["Onboarding", "Brand guide", "API reference"].map((d, i) => (
        <div
          key={d}
          className="flex items-center gap-2.5 rounded-lg border border-mist-100/8 bg-ink-800/50 px-3 py-2 text-[12px] text-mist-300 transition-transform duration-300 group-hover:translate-x-1"
          style={{ transitionDelay: `${i * 40}ms` }}
        >
          <BookOpen className="h-3.5 w-3.5 text-iris-300" /> {d}
        </div>
      ))}
    </div>
  );
}

export default function Bento() {
  return (
    <section id="bento" className="relative isolate overflow-hidden py-32">
      <SectionFX variant="grid" className="mask-fade-b" opacity={0.7} />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <span className="text-[13px] font-medium uppercase tracking-[0.2em] text-iris-300/80">
            Solutions
          </span>
        </Reveal>
        <h2 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-mist-50">
          <MaskText text="A complete system, beautifully connected." />
        </h2>
      </div>

      <div className="mt-16 grid auto-rows-[minmax(200px,auto)] grid-cols-1 gap-4 md:grid-cols-3">
        <TiltCard span="md:col-span-2">
          <Head icon={Sparkles} title="AI Assistant" desc="A copilot that understands your workspace and drafts, plans, and answers in your voice." />
          <Waveform />
        </TiltCard>
        <TiltCard>
          <Head icon={Users} title="Team Collaboration" desc="Presence, comments, and shared context — in real time." />
          <Avatars />
        </TiltCard>
        <TiltCard>
          <Head icon={Search} title="Smart Search" desc="Find anything the instant you think of it." />
          <SearchResults />
        </TiltCard>
        <TiltCard>
          <Head icon={Workflow} title="Workflow Automation" desc="Chain steps that run themselves." />
          <MiniFlow />
        </TiltCard>
        <TiltCard>
          <Head icon={BarChart3} title="Analytics" desc="Signal, in real time." />
          <MiniChart />
        </TiltCard>
        <TiltCard span="md:col-span-2">
          <Head icon={BookOpen} title="Knowledge Base" desc="Every doc, decision, and detail — searchable and always in context for your whole team." />
          <DocsStack />
        </TiltCard>
      </div>
      </div>
    </section>
  );
}

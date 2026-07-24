"use client";

import { motion } from "motion/react";
import { Reveal, MaskText } from "@/components/ui/Reveal";
import SectionFX from "./SectionFX";
import { WorkspaceVisual, AutomationVisual, InsightsVisual } from "./FeatureVisuals";
import { cn } from "@/lib/utils";

const features = [
  {
    eyebrow: "AI Workspace",
    title: "Draft, refine, and ship in one place.",
    body: "Turn a single prompt into structured docs, tasks, and plans. NOVA drafts alongside you — you stay in control of every word.",
    points: ["Context-aware drafting", "Inline task creation", "Shared team memory"],
    Visual: WorkspaceVisual,
  },
  {
    eyebrow: "Smart Automation",
    title: "Workflows that build themselves.",
    body: "Describe an outcome and NOVA wires the steps — triggers, actions, and conditions connect automatically, no flow-charting required.",
    points: ["Natural-language flows", "200+ integrations", "Runs 24/7"],
    Visual: AutomationVisual,
    flip: true,
  },
  {
    eyebrow: "Instant Insights",
    title: "See the signal, skip the noise.",
    body: "Live analytics surface what moved and why. NOVA highlights trends before they become problems — or opportunities.",
    points: ["Real-time metrics", "Anomaly alerts", "Weekly AI summaries"],
    Visual: InsightsVisual,
  },
];

export default function Features() {
  return (
    <section id="features" className="relative isolate overflow-hidden py-32">
      <SectionFX variant="aurora" className="mask-fade-b" opacity={0.85} />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <span className="text-[13px] font-medium uppercase tracking-[0.2em] text-iris-300/80">
            The workspace
          </span>
        </Reveal>
        <h2 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-mist-50">
          <MaskText text="One surface for every part of your work." />
        </h2>
      </div>

      <div className="mt-24 space-y-28">
        {features.map((f) => (
          <div
            key={f.eyebrow}
            className={cn(
              "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
              f.flip && "lg:[&>*:first-child]:order-2"
            )}
          >
            <div className={cn(f.flip && "lg:pl-8")}>
              <Reveal>
                <span className="inline-flex items-center gap-2 text-[13px] font-medium text-iris-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-iris-400" />
                  {f.eyebrow}
                </span>
              </Reveal>
              <Reveal delay={0.05}>
                <h3 className="mt-4 text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold leading-tight tracking-tight text-mist-50">
                  {f.title}
                </h3>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-4 max-w-md text-[16px] leading-relaxed text-mist-300">
                  {f.body}
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <ul className="mt-6 space-y-2.5">
                  {f.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-[14px] text-mist-200">
                      <span className="grid h-4 w-4 place-items-center rounded-full bg-iris-500/15 text-iris-300">
                        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-none stroke-current" strokeWidth="2">
                          <path d="M2.5 6.5 5 9l4.5-5.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="pointer-events-none absolute -inset-6 -z-10 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(124,102,255,0.12),transparent_70%)]" />
              <f.Visual />
            </motion.div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}

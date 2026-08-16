"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles, ArrowUp, FileText, CheckSquare, Calendar } from "lucide-react";
import { Reveal, MaskText } from "@/components/ui/Reveal";
import SectionFX from "./SectionFX";
import { cn } from "@/lib/utils";

type Demo = {
  prompt: string;
  answer: string;
  chips: { icon: React.ElementType; label: string }[];
};

const demos: Demo[] = [
  {
    prompt: "Plan a product launch for next month",
    answer:
      "Here's a 4-week launch plan. I've broken it into phases, drafted the announcement, and created a task list with owners and due dates.",
    chips: [
      { icon: FileText, label: "Launch brief.doc" },
      { icon: CheckSquare, label: "14 tasks created" },
      { icon: Calendar, label: "Timeline scheduled" },
    ],
  },
  {
    prompt: "Summarize this week's customer feedback",
    answer:
      "Across 132 messages, three themes stand out: onboarding friction, requests for a mobile app, and love for automations. I've grouped quotes by theme.",
    chips: [
      { icon: FileText, label: "Feedback summary" },
      { icon: CheckSquare, label: "3 themes tagged" },
      { icon: Calendar, label: "Follow-ups set" },
    ],
  },
  {
    prompt: "Automate my weekly status report",
    answer:
      "Done. Every Friday at 4pm, NOVA will pull metrics, draft a report in your tone, and post it to #updates for review before sending.",
    chips: [
      { icon: FileText, label: "Report template" },
      { icon: CheckSquare, label: "Trigger enabled" },
      { icon: Calendar, label: "Fridays · 4:00pm" },
    ],
  },
];

export default function Showcase() {
  const [active, setActive] = useState<number | null>(null);
  const [streamed, setStreamed] = useState("");
  const [showChips, setShowChips] = useState(false);
  const [input, setInput] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const run = (i: number) => {
    clearTimers();
    setActive(i);
    setInput(demos[i].prompt);
    setStreamed("");
    setShowChips(false);
    const words = demos[i].answer.split(" ");
    words.forEach((_, w) => {
      timers.current.push(
        setTimeout(() => {
          setStreamed(words.slice(0, w + 1).join(" "));
        }, 500 + w * 45)
      );
    });
    timers.current.push(
      setTimeout(() => setShowChips(true), 500 + words.length * 45 + 200)
    );
  };

  useEffect(() => () => clearTimers(), []);

  return (
    <section id="showcase" className="relative isolate overflow-hidden py-32">
      <SectionFX variant="pulse" className="mask-fade-b" opacity={0.8} />
      <div className="relative z-10 mx-auto max-w-4xl px-6">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <span className="text-[13px] font-medium uppercase tracking-[0.2em] text-iris-300/80">
            Try it
          </span>
        </Reveal>
        <h2 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-mist-50">
          <MaskText text="Ask NOVA anything." />
        </h2>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-md text-[16px] text-mist-300">
            Pick a prompt and watch NOVA turn intent into action.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="relative mt-12 overflow-hidden rounded-3xl border border-mist-100/10 bg-ink-900/70 p-5 backdrop-blur-xl sm:p-7">
          <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(50%_100%_at_50%_100%,rgba(124,102,255,0.18),transparent)]" />

          {/* prompt chips */}
          <div className="flex flex-wrap gap-2">
            {demos.map((d, i) => (
              <button
                key={i}
                onClick={() => run(i)}
                data-cursor="hover"
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-[13px] transition-colors",
                  active === i
                    ? "border-iris-400/40 bg-iris-500/12 text-iris-200"
                    : "border-mist-100/10 text-mist-300 hover:border-mist-100/20 hover:text-mist-100"
                )}
              >
                {d.prompt}
              </button>
            ))}
          </div>

          {/* response area */}
          <div className="relative mt-6 min-h-45 rounded-2xl border border-mist-100/8 bg-ink-850/50 p-5">
            <AnimatePresence mode="wait">
              {active === null ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full min-h-35 flex-col items-center justify-center text-center text-mist-500"
                >
                  <Sparkles className="h-6 w-6 text-iris-400/60" />
                  <p className="mt-3 text-[13px]">Select a prompt above to see NOVA respond</p>
                </motion.div>
              ) : (
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-linear-to-br from-iris-400 to-cyan-400 text-ink-950">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <p className="text-[14.5px] leading-relaxed text-mist-200">
                      {streamed}
                      {streamed.length < demos[active].answer.length && (
                        <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-iris-300 animate-pulse" />
                      )}
                    </p>
                  </div>

                  <AnimatePresence>
                    {showChips && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-5 flex flex-wrap gap-2 border-t border-mist-100/8 pt-4"
                      >
                        {demos[active].chips.map((c, ci) => (
                          <motion.div
                            key={c.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: ci * 0.1 }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-mist-100/10 bg-ink-800/60 px-2.5 py-1.5 text-[12px] text-mist-200"
                          >
                            <c.icon className="h-3.5 w-3.5 text-iris-300" />
                            {c.label}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* fake input */}
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-mist-100/10 bg-ink-800/60 px-4 py-3">
            <Sparkles className="h-4 w-4 shrink-0 text-iris-300" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message NOVA…"
              className="flex-1 bg-transparent text-[14px] text-mist-100 placeholder:text-mist-500 focus:outline-none"
            />
            <button
              onClick={() => {
                const match = demos.findIndex((d) => d.prompt === input);
                run(match >= 0 ? match : 0);
              }}
              data-cursor="hover"
              className="grid h-8 w-8 place-items-center rounded-lg bg-mist-50 text-ink-950 transition-transform active:scale-90"
              aria-label="Send"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Reveal>
      </div>
    </section>
  );
}

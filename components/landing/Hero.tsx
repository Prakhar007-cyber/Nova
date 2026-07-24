"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { Sparkles, Play } from "lucide-react";
import HeroBackground from "./HeroBackground";
import DashboardMock from "./DashboardMock";
import Button from "@/components/ui/Button";
import { scrollTo } from "@/components/providers/SmoothScroll";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const dashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !dashRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        dashRef.current,
        { rotateX: 34, scale: 0.9, y: 40 },
        {
          rotateX: 0,
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top 78%",
            end: "top 12%",
            scrub: 1,
          },
        }
      );
    }, stageRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden pt-32">
      <HeroBackground />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
        <motion.button
          onClick={() => scrollTo("#showcase")}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          data-cursor="hover"
          className="group inline-flex items-center gap-2 rounded-full border border-mist-100/12 bg-mist-50/[0.04] px-3.5 py-1.5 text-[13px] text-mist-300 backdrop-blur-md transition-colors hover:text-mist-100"
        >
          <span className="grid h-4 w-4 place-items-center rounded-full bg-gradient-to-br from-iris-400 to-cyan-400 text-ink-950">
            <Sparkles className="h-2.5 w-2.5" />
          </span>
          Introducing NOVA 2.0 — the AI-native workspace
          <span className="text-mist-500 transition-transform group-hover:translate-x-0.5">→</span>
        </motion.button>

        <h1 className="mt-7 text-[clamp(2.75rem,8vw,6rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
          <motion.span
            className="block text-mist-50"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.05 }}
          >
            Think faster.
          </motion.span>
          <motion.span
            className="block bg-[linear-gradient(100deg,#b9aeff,#a066ff_45%,#52d9f0)] bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.16 }}
          >
            Build smarter.
          </motion.span>
        </h1>

        <motion.p
          className="mt-6 max-w-xl text-balance text-[17px] leading-relaxed text-mist-300"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.28 }}
        >
          Your intelligent workspace for turning ideas into action — powered by
          AI, designed for focus.
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.38 }}
        >
          <Button href="/signup" size="lg" arrow>
            Start Building
          </Button>
          <Button
            variant="secondary"
            size="lg"
            magnetic
            onClick={() => scrollTo("#showcase")}
          >
            <Play className="h-4 w-4 fill-current" /> See NOVA in Action
          </Button>
        </motion.div>
      </div>

      {/* dashboard stage */}
      <div ref={stageRef} className="relative z-10 mt-20 px-6 pb-10">
        <div style={{ perspective: 1600 }} className="mx-auto max-w-5xl">
          <div ref={dashRef} style={{ transformStyle: "preserve-3d" }}>
            <div className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(124,102,255,0.22),transparent_70%)]" />
            <DashboardMock />
          </div>
        </div>
      </div>
    </section>
  );
}

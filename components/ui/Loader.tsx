"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LogoMark } from "./Logo";
import { useReducedMotion } from "@/lib/hooks";

/**
 * First-visit intro: a counter races to 100 while the NOVA mark breathes,
 * then the black curtain lifts to reveal the page. Shown once per session.
 */
export default function Loader() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("nova-loaded") || reduce) {
      // Skip the intro after first visit / for reduced-motion — post-hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDone(true);
      return;
    }
    document.documentElement.style.overflow = "hidden";
    const start = performance.now();
    const dur = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        sessionStorage.setItem("nova-loaded", "1");
        setTimeout(() => setDone(true), 380);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, [reduce]);

  useEffect(() => {
    if (done) document.documentElement.style.overflow = "";
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-200 flex flex-col items-center justify-center bg-ink-950"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.83, 0, 0.17, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute -inset-10 rounded-full bg-iris-500/20 blur-3xl animate-pulse-glow" />
            <LogoMark className="relative h-14 w-14 animate-spin-slow" />
          </motion.div>
          <div className="mt-8 flex items-baseline gap-1 font-mono text-sm text-mist-400">
            <span className="tabular-nums text-mist-100">{String(count).padStart(3, "0")}</span>
            <span>/ 100</span>
          </div>
          <div className="mt-4 h-px w-40 overflow-hidden bg-mist-500/20">
            <motion.div
              className="h-full bg-linear-to-r from-iris-400 to-cyan-400"
              style={{ width: `${count}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

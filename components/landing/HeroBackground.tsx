"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";
import SectionFX from "./SectionFX";

/**
 * Cinematic hero backdrop, layered back-to-front:
 *  1. a flowing particle field (canvas) tracing an organic vector field,
 *  2. a faint perspective dot-grid fading toward the horizon,
 *  3. slow aurora blobs (pure CSS) for colour depth,
 *  4. a soft light that follows the pointer (rAF-eased, desktop only).
 * Deliberately low-contrast so it never competes with the headline.
 */
export default function HeroBackground() {
  const glowRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const el = glowRef.current;
    if (!el) return;
    let tx = 50;
    let ty = 40;
    let cx = 50;
    let cy = 40;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth) * 100;
      ty = (e.clientY / window.innerHeight) * 100;
    };
    const loop = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      el.style.background = `radial-gradient(600px circle at ${cx}% ${cy}%, rgba(124,102,255,0.14), transparent 60%)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [reduce]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* flowing particle field */}
      <SectionFX variant="flow" opacity={0.7} className="mask-fade-b" />

      {/* perspective dot grid */}
      <div
        className="absolute inset-x-0 top-0 h-[120%] opacity-[0.3]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(199,202,216,0.12) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage:
            "radial-gradient(120% 80% at 50% 0%, black 20%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(120% 80% at 50% 0%, black 20%, transparent 72%)",
        }}
      />

      {/* aurora blobs */}
      <div className="absolute left-1/2 top-[-10%] h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-iris-500/25 blur-[120px] animate-float" />
      <div
        className="absolute left-[18%] top-[10%] h-[42vh] w-[42vh] rounded-full bg-violet-500/20 blur-[110px] animate-float"
        style={{ animationDelay: "-3s" }}
      />
      <div
        className="absolute right-[14%] top-[6%] h-[40vh] w-[40vh] rounded-full bg-cyan-400/15 blur-[120px] animate-float"
        style={{ animationDelay: "-5s" }}
      />

      {/* pointer-follow light */}
      <div ref={glowRef} className="absolute inset-0" />

      {/* horizon line + fade to canvas */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-ink-950 to-transparent" />
    </div>
  );
}

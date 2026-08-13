"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";
import { MaskText, Reveal } from "@/components/ui/Reveal";
import SectionFX from "./SectionFX";
import Button from "@/components/ui/Button";

export default function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return;
    const el = ref.current;
    let raf = 0;
    let t = 0;
    const loop = () => {
      t += 0.004;
      const x = 50 + Math.sin(t) * 18;
      const y = 45 + Math.cos(t * 0.8) * 14;
      el.style.setProperty("--gx", `${x}%`);
      el.style.setProperty("--gy", `${y}%`);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <section id="cta" className="relative px-6 py-32">
      <div
        ref={ref}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-mist-100/10 px-6 py-24 text-center"
        style={{
          background:
            "radial-gradient(120% 120% at var(--gx,50%) var(--gy,45%), rgba(124,102,255,0.28), rgba(80,60,200,0.06) 40%, transparent 70%)",
        }}
      >
        <SectionFX variant="rays" opacity={0.9} />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, rgba(199,202,216,0.1) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
            maskImage: "radial-gradient(70% 70% at 50% 50%, black, transparent)",
            WebkitMaskImage: "radial-gradient(70% 70% at 50% 50%, black, transparent)",
          }}
        />
        <div className="relative">
          <h2 className="mx-auto max-w-3xl text-[clamp(2.2rem,6vw,4.5rem)] font-semibold leading-none tracking-[-0.03em] text-mist-50">
            <MaskText text="Your next great idea starts here." />
          </h2>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-6 max-w-md text-[17px] text-mist-300">
              Join thousands of teams building faster with NOVA. Free to start —
              no credit card required.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button href="/signup" size="lg" arrow>
                Start Building with NOVA
              </Button>
              <Button href="/signin" variant="secondary" size="lg">
                Sign In
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

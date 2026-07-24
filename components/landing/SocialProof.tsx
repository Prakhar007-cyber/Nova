"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import SectionFX from "./SectionFX";

const brands = [
  "Northwind", "Lumen", "Vertex", "Halcyon", "Monolith",
  "Cobalt", "Everest", "Aperture", "Meridian", "Quantia",
];

const testimonials = [
  { q: "NOVA replaced five tools and made our team feel twice as fast.", a: "Ava Chen", r: "Head of Product, Lumen" },
  { q: "The automations alone save me a full day every week.", a: "Marcus Reid", r: "Founder, Cobalt" },
  { q: "It finally feels like software that thinks with you.", a: "Priya Nair", r: "Design Lead, Vertex" },
  { q: "We onboarded the whole company in an afternoon.", a: "Tom Alvarez", r: "COO, Meridian" },
];

function Stat({ to, suffix, label }: { to: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: setV });
    return () => c.stop();
  }, [inView, to]);
  return (
    <div ref={ref} className="text-center">
      <div className="text-[clamp(2.4rem,6vw,4rem)] font-semibold tracking-tight text-gradient">
        {to >= 1000 ? Math.round(v / 1000) : Math.round(v * 10) / 10}
        {suffix}
      </div>
      <div className="mt-1 text-[14px] text-mist-400">{label}</div>
    </div>
  );
}

export default function SocialProof() {
  return (
    <section className="relative isolate overflow-hidden py-28">
      <SectionFX variant="stars" opacity={0.9} />
      <div className="relative z-10">
      <Reveal className="text-center">
        <p className="text-[13px] uppercase tracking-[0.2em] text-mist-500">
          Trusted by fast-moving teams
        </p>
      </Reveal>

      {/* logo marquee */}
      <div className="mask-fade-x mt-10 flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee items-center gap-16 pr-16">
          {[...brands, ...brands].map((b, i) => (
            <span
              key={i}
              className="whitespace-nowrap text-[22px] font-semibold tracking-tight text-mist-500/70 transition-colors hover:text-mist-200"
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* stats */}
      <div className="mx-auto mt-24 grid max-w-4xl grid-cols-1 gap-12 px-6 sm:grid-cols-3">
        <Stat to={10} suffix="k+" label="Creators building daily" />
        <Stat to={1000} suffix="M+" label="Tasks automated" />
        <Stat to={99.9} suffix="%" label="Uptime, guaranteed" />
      </div>

      {/* testimonial marquee */}
      <div className="mask-fade-x mt-24 flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee-slow items-stretch gap-4 pr-4">
          {[...testimonials, ...testimonials].map((t, i) => (
            <figure
              key={i}
              className="w-[340px] shrink-0 rounded-2xl border border-mist-100/8 bg-ink-850/50 p-5"
            >
              <blockquote className="text-[14.5px] leading-relaxed text-mist-200">
                “{t.q}”
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="h-8 w-8 rounded-full bg-gradient-to-br from-iris-400 to-cyan-400" />
                <span className="text-[12px]">
                  <span className="block text-mist-100">{t.a}</span>
                  <span className="text-mist-500">{t.r}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}

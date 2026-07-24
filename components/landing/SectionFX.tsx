"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * SectionFX — a single, viewport-gated canvas that renders one of several
 * bespoke animated backgrounds. Each landing section gets a distinct one so
 * the whole page feels continuously alive without any two areas looking the
 * same. All variants:
 *   • run on a shared rAF that PAUSES when the section scrolls out of view,
 *   • cap DPR + particle counts (and thin out on mobile) for 60fps,
 *   • render a single static frame under prefers-reduced-motion.
 */

export type FXVariant = "flow" | "aurora" | "grid" | "pulse" | "stars" | "rays";

const IRIS: [number, number, number] = [124, 102, 255];
const CYAN: [number, number, number] = [82, 217, 240];
const VIOLET: [number, number, number] = [160, 102, 255];

const mix = (a: number[], b: number[], t: number) =>
  [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t] as const;
const rgba = (c: readonly number[], a: number) => `rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a})`;

// cheap organic flow field angle
const field = (x: number, y: number, t: number) =>
  (Math.sin(x * 0.0016 + t * 0.25) +
    Math.cos(y * 0.0019 - t * 0.2) +
    Math.sin((x + y) * 0.001 + t * 0.14)) *
  Math.PI;

interface State {
  parts: Record<string, number>[];
  extra: Record<string, unknown>;
}

export default function SectionFX({
  variant,
  className,
  opacity = 1,
  interactive = true,
}: {
  variant: FXVariant;
  className?: string;
  opacity?: number;
  interactive?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 768;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5);

    const mouse = { x: 0.5, y: 0.5, active: false };
    let state: State = { parts: [], extra: {} };

    const trail = variant === "flow";

    // ---- per-variant init ----
    const init = () => {
      state = { parts: [], extra: {} };
      if (variant === "flow") {
        const n = mobile ? 55 : 130;
        for (let i = 0; i < n; i++) {
          const x = Math.random() * w;
          const y = Math.random() * h;
          state.parts.push({ x, y, px: x, py: y, life: Math.random() * 100 });
        }
      } else if (variant === "stars") {
        const n = mobile ? 70 : 160;
        for (let i = 0; i < n; i++) {
          state.parts.push({
            x: Math.random() * w,
            y: Math.random() * h,
            z: 0.25 + Math.random() * 0.75,
            r: Math.random() * 1.6 + 0.3,
            tw: Math.random() * Math.PI * 2,
          });
        }
      } else if (variant === "grid") {
        const pulses = mobile ? 5 : 10;
        state.parts = Array.from({ length: pulses }).map(() => spawnPulse(w, h));
      } else if (variant === "pulse") {
        const orb = mobile ? 6 : 12;
        for (let i = 0; i < orb; i++) {
          state.parts.push({
            a: Math.random() * Math.PI * 2,
            rad: 0.2 + Math.random() * 0.7,
            spd: (Math.random() * 0.5 + 0.3) * (Math.random() > 0.5 ? 1 : -1),
            size: Math.random() * 1.6 + 0.6,
            hue: Math.random(),
          });
        }
      }
    };

    function spawnPulse(W: number, H: number) {
      const vertical = Math.random() > 0.5;
      const g = 46;
      return {
        vertical: vertical ? 1 : 0,
        pos: vertical ? Math.round((Math.random() * W) / g) * g : Math.round((Math.random() * H) / g) * g,
        t: -Math.random(),
        speed: 0.15 + Math.random() * 0.35,
        hue: Math.random(),
      };
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = (e.clientY - rect.top) / rect.height;
      mouse.active = true;
    };
    if (interactive && !mobile) window.addEventListener("mousemove", onMove, { passive: true });

    // ---- per-variant frame ----
    const frame = (t: number) => {
      if (!trail) ctx.clearRect(0, 0, w, h);

      if (variant === "flow") {
        // fade previous frame for silky trails
        ctx.fillStyle = "rgba(5,6,9,0.10)";
        ctx.fillRect(0, 0, w, h);
        ctx.lineWidth = 1.1;
        for (const p of state.parts) {
          const a = field(p.x, p.y, t);
          p.px = p.x;
          p.py = p.y;
          const spd = 0.9;
          p.x += Math.cos(a) * spd * 1.6;
          p.y += Math.sin(a) * spd * 1.6;
          p.life -= 1;
          if (p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20 || p.life < 0) {
            p.x = Math.random() * w;
            p.y = Math.random() * h;
            p.px = p.x;
            p.py = p.y;
            p.life = 120 + Math.random() * 120;
          }
          const c = mix(IRIS, CYAN, p.x / w);
          ctx.strokeStyle = rgba(c, 0.55);
          ctx.beginPath();
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      } else if (variant === "aurora") {
        ctx.globalCompositeOperation = "lighter";
        const bands = [
          { c: IRIS, base: 0.32, amp: 0.14, speed: 0.18, freq: 1.1, phase: 0 },
          { c: VIOLET, base: 0.5, amp: 0.18, speed: -0.14, freq: 0.8, phase: 2 },
          { c: CYAN, base: 0.66, amp: 0.12, speed: 0.11, freq: 1.4, phase: 4 },
        ];
        for (const b of bands) {
          const yBase = h * b.base;
          const thick = h * 0.16;
          const grad = ctx.createLinearGradient(0, yBase - thick, 0, yBase + thick);
          grad.addColorStop(0, rgba(b.c, 0));
          grad.addColorStop(0.5, rgba(b.c, 0.16));
          grad.addColorStop(1, rgba(b.c, 0));
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(0, h);
          const step = Math.max(14, w / 60);
          for (let x = 0; x <= w; x += step) {
            const y =
              yBase +
              Math.sin(x * 0.004 * b.freq + t * b.speed + b.phase) * b.amp * h +
              Math.sin(x * 0.011 + t * b.speed * 1.7) * 12;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(w, h);
          ctx.closePath();
          ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      } else if (variant === "grid") {
        const g = 46;
        const ox = ((t * 6) % g);
        ctx.strokeStyle = "rgba(199,202,216,0.05)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = -g + (ox % g); x <= w; x += g) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
        }
        for (let y = 0; y <= h; y += g) {
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
        }
        ctx.stroke();
        // traveling light pulses along grid lines
        for (const p of state.parts) {
          p.t += p.speed * 0.008;
          if (p.t > 1.2) Object.assign(p, spawnPulse(w, h));
          const along = p.t * (p.vertical ? h : w);
          const cx = p.vertical ? p.pos : along;
          const cy = p.vertical ? along : p.pos;
          const c = mix(IRIS, CYAN, p.hue);
          const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 26);
          glow.addColorStop(0, rgba(c, 0.5));
          glow.addColorStop(1, rgba(c, 0));
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(cx, cy, 26, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = rgba(c, 0.9);
          ctx.beginPath();
          ctx.arc(cx, cy, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (variant === "pulse") {
        const cx = w * 0.5;
        const cy = h * 0.42;
        // sonar rings
        const period = 3.4;
        for (let k = 0; k < 4; k++) {
          const prog = ((t / period + k / 4) % 1);
          const rad = prog * Math.min(w, h) * 0.7;
          const alpha = (1 - prog) * 0.22;
          ctx.strokeStyle = rgba(mix(IRIS, CYAN, prog), alpha);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(cx, cy, rad, 0, Math.PI * 2);
          ctx.stroke();
        }
        // orbiters
        ctx.globalCompositeOperation = "lighter";
        for (const p of state.parts) {
          p.a += p.spd * 0.01;
          const r = p.rad * Math.min(w, h) * 0.5;
          const x = cx + Math.cos(p.a) * r;
          const y = cy + Math.sin(p.a) * r * 0.7;
          const c = mix(IRIS, CYAN, p.hue);
          const glow = ctx.createRadialGradient(x, y, 0, x, y, p.size * 6);
          glow.addColorStop(0, rgba(c, 0.7));
          glow.addColorStop(1, rgba(c, 0));
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, p.size * 6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      } else if (variant === "stars") {
        const mx = interactive ? (mouse.x - 0.5) * 40 : 0;
        const my = interactive ? (mouse.y - 0.5) * 40 : 0;
        for (const p of state.parts) {
          p.y += p.z * 0.15;
          p.x += p.z * 0.05;
          if (p.y > h + 4) p.y = -4;
          if (p.x > w + 4) p.x = -4;
          const tw = 0.5 + 0.5 * Math.sin(t * 1.4 + p.tw);
          const x = p.x + mx * p.z;
          const y = p.y + my * p.z;
          const c = mix(IRIS, CYAN, p.z);
          ctx.fillStyle = rgba(c, 0.35 + tw * 0.5);
          ctx.beginPath();
          ctx.arc(x, y, p.r * p.z, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (variant === "rays") {
        const cx = w * 0.5;
        const cy = h * 0.5;
        ctx.globalCompositeOperation = "lighter";
        const count = 14;
        for (let i = 0; i < count; i++) {
          const ang = (i / count) * Math.PI * 2 + t * 0.06;
          const len = Math.max(w, h);
          const spread = 0.08;
          const c = mix(IRIS, CYAN, (i % 5) / 5);
          const grad = ctx.createLinearGradient(cx, cy, cx + Math.cos(ang) * len, cy + Math.sin(ang) * len);
          grad.addColorStop(0, rgba(c, 0.05 + 0.05 * Math.sin(t + i)));
          grad.addColorStop(1, rgba(c, 0));
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(ang - spread) * len, cy + Math.sin(ang - spread) * len);
          ctx.lineTo(cx + Math.cos(ang + spread) * len, cy + Math.sin(ang + spread) * len);
          ctx.closePath();
          ctx.fill();
        }
        // core glow
        const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.4);
        core.addColorStop(0, rgba(VIOLET, 0.12));
        core.addColorStop(1, rgba(VIOLET, 0));
        ctx.fillStyle = core;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";
      }
    };

    // ---- rAF gated by visibility ----
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let clock = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;
      frame(clock);
      raf = requestAnimationFrame(loop);
    };

    if (reduce) {
      frame(0.6); // single representative frame
      return () => {
        ro.disconnect();
        window.removeEventListener("mousemove", onMove);
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) {
          last = performance.now();
          raf = requestAnimationFrame(loop);
        } else if (!visible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
    };
  }, [variant, interactive]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      style={{ opacity }}
    />
  );
}

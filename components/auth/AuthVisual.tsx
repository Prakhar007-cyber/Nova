"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";

type Mode = "signin" | "signup";

/**
 * The NOVA universe. A canvas particle field that:
 *  - drifts as a loose nebula in "signin" (scattered),
 *  - converges into the NOVA spark constellation in "signup" (formed),
 *    drawing links between neighbours as it settles.
 * The whole field parallaxes gently toward the pointer; particles near
 * the cursor are nudged away. Pointer work is skipped on coarse pointers
 * and the field freezes for reduced-motion users.
 */
export default function AuthVisual({ mode, interactive = true }: { mode: Mode; interactive?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<Mode>(mode);
  const reduce = useReducedMotion();

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // build the spark formation target points (unit space, centered)
    const spark = (t: number): [number, number] => {
      // 4-point star radial curve
      const a = t * Math.PI * 2;
      const petal = Math.pow(Math.abs(Math.cos(2 * a)), 0.55);
      const r = 0.18 + petal * 0.62;
      return [Math.cos(a) * r, Math.sin(a) * r];
    };

    const N = window.innerWidth < 768 ? 70 : 120;
    type P = {
      x: number; y: number; vx: number; vy: number;
      hx: number; hy: number; // scattered home (unit)
      tx: number; ty: number; // formation target (unit)
      r: number; hue: number;
    };
    const parts: P[] = [];
    for (let i = 0; i < N; i++) {
      const [sx, sy] = spark((i / N) + (Math.random() - 0.5) * 0.01);
      parts.push({
        x: 0, y: 0, vx: 0, vy: 0,
        hx: (Math.random() - 0.5) * 1.7,
        hy: (Math.random() - 0.5) * 1.7,
        tx: sx + (Math.random() - 0.5) * 0.05,
        ty: sy + (Math.random() - 0.5) * 0.05,
        r: 0.6 + Math.random() * 1.6,
        hue: Math.random(),
      });
    }

    const mouse = { x: 0.5, y: 0.5, active: false };
    const parallax = { x: 0, y: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
    const onLeave = () => (mouse.active = false);
    if (interactive) {
      window.addEventListener("mousemove", onMove, { passive: true });
      canvas.addEventListener("mouseleave", onLeave);
    }

    const toPx = (ux: number, uy: number): [number, number] => {
      const scale = Math.min(w, h) * 0.42;
      return [w / 2 + ux * scale, h / 2 + uy * scale];
    };

    const colorFor = (hue: number, a: number) => {
      // blend iris → cyan
      const r = Math.round(124 + hue * (146 - 124));
      const g = Math.round(102 + hue * (217 - 102));
      const b = Math.round(255 + hue * (240 - 255));
      return `rgba(${r},${g},${b},${a})`;
    };

    let raf = 0;
    let t0 = performance.now();
    const render = (now: number) => {
      const dt = Math.min(2, (now - t0) / 16.67);
      t0 = now;
      ctx.clearRect(0, 0, w, h);

      // parallax easing
      const px = interactive && mouse.active ? (mouse.x - 0.5) * 30 : 0;
      const py = interactive && mouse.active ? (mouse.y - 0.5) * 30 : 0;
      parallax.x += (px - parallax.x) * 0.05;
      parallax.y += (py - parallax.y) * 0.05;

      const formed = modeRef.current === "signup";
      const time = now * 0.0004;

      const px2: number[] = [];
      const py2: number[] = [];

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        let targetUX: number;
        let targetUY: number;
        if (formed) {
          targetUX = p.tx;
          targetUY = p.ty;
        } else {
          // drifting nebula home with slow noise
          targetUX = p.hx + Math.sin(time + i) * 0.06;
          targetUY = p.hy + Math.cos(time * 0.9 + i * 1.3) * 0.06;
        }
        if (reduce) {
          p.x = targetUX;
          p.y = targetUY;
        } else {
          const k = formed ? 0.06 : 0.03;
          p.vx += (targetUX - p.x) * k;
          p.vy += (targetUY - p.y) * k;
          p.vx *= 0.86;
          p.vy *= 0.86;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
        }

        let [sx, sy] = toPx(p.x, p.y);
        sx += parallax.x;
        sy += parallax.y;

        // pointer repulsion
        if (interactive && mouse.active) {
          const mxPx = mouse.x * w;
          const myPx = mouse.y * h;
          const dx = sx - mxPx;
          const dy = sy - myPx;
          const d2 = dx * dx + dy * dy;
          if (d2 < 9000) {
            const f = (9000 - d2) / 9000;
            sx += (dx / Math.sqrt(d2 + 0.01)) * f * 14;
            sy += (dy / Math.sqrt(d2 + 0.01)) * f * 14;
          }
        }

        px2.push(sx);
        py2.push(sy);
      }

      // links when formed
      if (formed) {
        ctx.lineWidth = 0.6;
        for (let i = 0; i < parts.length; i++) {
          for (let j = i + 1; j < parts.length; j++) {
            const dx = px2[i] - px2[j];
            const dy = py2[i] - py2[j];
            const d2 = dx * dx + dy * dy;
            if (d2 < 2600) {
              const a = (1 - d2 / 2600) * 0.35;
              ctx.strokeStyle = colorFor((parts[i].hue + parts[j].hue) / 2, a);
              ctx.beginPath();
              ctx.moveTo(px2[i], py2[i]);
              ctx.lineTo(px2[j], py2[j]);
              ctx.stroke();
            }
          }
        }
      }

      // particles
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        ctx.beginPath();
        ctx.arc(px2[i], py2[i], p.r, 0, Math.PI * 2);
        ctx.fillStyle = colorFor(p.hue, formed ? 0.9 : 0.6);
        ctx.shadowBlur = 8;
        ctx.shadowColor = colorFor(p.hue, 0.7);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [interactive, reduce]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

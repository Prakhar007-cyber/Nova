"use client";

import { useEffect, useRef } from "react";
import { useIsDesktop, useReducedMotion } from "@/lib/hooks";

/**
 * Custom two-part cursor: a crisp dot that tracks 1:1 and a soft ring
 * that eases behind it. The ring expands and inverts over interactive
 * elements (anything with [data-cursor="hover"], links, or buttons).
 * Desktop-only; falls back to the native cursor otherwise.
 */
export default function Cursor() {
  const isDesktop = useIsDesktop();
  const reduce = useReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDesktop || reduce) return;
    document.documentElement.classList.add("custom-cursor-active");

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let scale = 1;
    let targetScale = 1;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const el = (e.target as HTMLElement)?.closest?.(
        'a, button, [data-cursor="hover"], input, textarea, [role="button"]'
      );
      targetScale = el ? 2.6 : 1;
      ring.dataset.hover = el ? "true" : "false";
    };
    const onDown = () => (targetScale *= 0.7);
    const onUp = () => {};
    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      scale += (targetScale - scale) * 0.14;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [isDesktop, reduce]);

  if (!isDesktop || reduce) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-mist-50 mix-blend-difference"
      />
      <div
        ref={ringRef}
        data-hover="false"
        className="pointer-events-none fixed left-0 top-0 z-[100] h-8 w-8 rounded-full border border-mist-200/60 mix-blend-difference transition-[background-color,border-color] duration-300 data-[hover=true]:border-transparent data-[hover=true]:bg-mist-50/90"
      />
    </>
  );
}

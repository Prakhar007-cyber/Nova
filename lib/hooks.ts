"use client";

import { useEffect, useState } from "react";

/** Returns true once the component has mounted on the client. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  // Intentional: flips after hydration to keep SSR/CSR markup identical.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** Tracks a media query. SSR-safe (returns `false` until mounted). */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = () => setMatches(mql.matches);
    handler(); // sync the real match after mount (SSR always starts `false`)
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

/** True when the user prefers reduced motion. */
export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True on desktop-class pointer devices (fine pointer + hover). */
export function useIsDesktop() {
  return useMediaQuery("(hover: hover) and (pointer: fine) and (min-width: 768px)");
}

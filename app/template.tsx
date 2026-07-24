"use client";

import { motion } from "motion/react";

/**
 * App Router template re-mounts on every navigation, so this gives each
 * route a branded entrance: a soft blur-lift with a faint gradient sweep.
 * Respects reduced-motion via the CSS override in globals.css.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(8px)", y: 8 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

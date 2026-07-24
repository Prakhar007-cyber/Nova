"use client";

import { motion, type Variants } from "motion/react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

const easing = [0.16, 1, 0.3, 1] as const;

/** Fade + rise element, triggered once when it enters the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "span" | "li";
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.9, delay, ease: easing }}
    >
      {children}
    </MotionTag>
  );
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const word: Variants = {
  hidden: { opacity: 0, y: "110%", rotate: 2 },
  show: { opacity: 1, y: "0%", rotate: 0, transition: { duration: 0.85, ease: easing } },
};

/**
 * Word-by-word masked reveal. Each word rises out of an overflow-hidden
 * mask on scroll, producing the "type-set" cinematic entrance.
 */
export function MaskText({
  text,
  className,
  wordClassName,
  delay = 0,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
}) {
  return (
    <motion.span
      className={cn("inline", className)}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ delayChildren: delay }}
    >
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-flex overflow-hidden pb-[0.12em] align-bottom">
          <motion.span variants={word} className={cn("inline-block", wordClassName)}>
            {w}
            {i < text.split(" ").length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

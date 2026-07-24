"use client";

import Link from "next/link";
import { forwardRef, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import Magnetic from "./MagneticButton";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-[transform,background-color,border-color,box-shadow] duration-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-iris-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "text-ink-950 bg-mist-50 hover:bg-white shadow-[0_1px_0_0_rgba(255,255,255,0.4)_inset,0_10px_40px_-12px_rgba(124,102,255,0.65)]",
  secondary:
    "text-mist-100 glass hover:bg-mist-50/10 hover:border-mist-100/20",
  ghost: "text-mist-200 hover:text-mist-50 hover:bg-mist-50/[0.06]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-7 text-base",
};

export interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  magnetic?: boolean;
  arrow?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, variant = "primary", size = "md", href, className, magnetic = true, arrow = false, onClick, type = "button", disabled },
  ref
) {
  const content = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {arrow && (
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </span>
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(120px_circle_at_var(--x,50%)_50%,rgba(124,102,255,0.25),transparent)]" />
      )}
    </>
  );

  const cls = cn(base, variants[variant], sizes[size], className);

  const inner = href ? (
    <Link href={href} className={cls} onClick={onClick}>
      {content}
    </Link>
  ) : (
    <button ref={ref} type={type} onClick={onClick} disabled={disabled} className={cls}>
      {content}
    </button>
  );

  return magnetic ? <Magnetic strength={0.25}>{inner}</Magnetic> : inner;
});

export default Button;

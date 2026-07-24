"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

/** The NOVA spark mark — a four-point star inside an orbit ring. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-7 w-7", className)} fill="none" aria-hidden>
      <defs>
        <linearGradient id="nova-mark" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#b9aeff" />
          <stop offset="0.55" stopColor="#7c66ff" />
          <stop offset="1" stopColor="#52d9f0" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="12.5" stroke="url(#nova-mark)" strokeOpacity="0.35" strokeWidth="1.2" />
      <path
        d="M16 3.5c.9 6.6 2.9 8.6 9.5 9.5C18.9 13.9 16.9 15.9 16 22.5c-.9-6.6-2.9-8.6-9.5-9.5C13.1 12.1 15.1 10.1 16 3.5Z"
        fill="url(#nova-mark)"
      />
      <path
        d="M16 15c.35 2.6 1.15 3.4 3.75 3.75C17.15 19.1 16.35 19.9 16 22.5c-.35-2.6-1.15-3.4-3.75-3.75C14.85 18.4 15.65 17.6 16 15Z"
        fill="#050609"
        fillOpacity="0.55"
      />
    </svg>
  );
}

/** Full lockup: mark + wordmark. */
export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      data-cursor="hover"
      className={cn(
        "group inline-flex items-center gap-2.5 text-mist-50",
        className
      )}
    >
      <span className="transition-transform duration-500 group-hover:rotate-[90deg]">
        <LogoMark />
      </span>
      <span className="text-[19px] font-semibold tracking-tight">
        NOVA
      </span>
    </Link>
  );
}

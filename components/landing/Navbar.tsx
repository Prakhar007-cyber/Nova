"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { scrollTo } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/utils";

const links = [
  { label: "Product", href: "#features" },
  { label: "Solutions", href: "#bento" },
  { label: "Features", href: "#showcase" },
  { label: "Pricing", href: "#cta" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={cn(
          "flex w-full max-w-6xl items-center justify-between rounded-full px-3 py-2.5 transition-all duration-500",
          scrolled
            ? "glass-strong shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)]"
            : "border border-transparent bg-transparent"
        )}
      >
        <div className="pl-2">
          <Logo />
        </div>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => scrollTo(l.href)}
              data-cursor="hover"
              className="group relative px-3.5 py-2 text-[14px] text-mist-300 transition-colors hover:text-mist-50"
            >
              {l.label}
              <span className="absolute inset-x-3.5 bottom-1.5 h-px origin-left scale-x-0 bg-gradient-to-r from-iris-400 to-cyan-400 transition-transform duration-300 group-hover:scale-x-100" />
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button href="/signin" variant="ghost" size="sm" magnetic={false}>
            Sign In
          </Button>
          <Button href="/signup" size="sm" arrow>
            Get Started
          </Button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-full text-mist-100 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* mobile sheet */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong absolute inset-x-4 top-20 rounded-3xl p-4 md:hidden"
        >
          <div className="flex flex-col">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => {
                  scrollTo(l.href);
                  setOpen(false);
                }}
                className="rounded-xl px-3 py-3 text-left text-[15px] text-mist-200 hover:bg-mist-50/5"
              >
                {l.label}
              </button>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button href="/signin" variant="secondary" size="sm" magnetic={false}>
                Sign In
              </Button>
              <Button href="/signup" size="sm" magnetic={false}>
                Get Started
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AuthVisual from "./AuthVisual";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { Logo, LogoMark } from "@/components/ui/Logo";
import { useIsDesktop } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup";

const panelTransition = { duration: 0.8, ease: [0.83, 0, 0.17, 1] as const };

const statements: Record<Mode, { title: string; sub: string }> = {
  signin: {
    title: "One workspace.\nInfinite possibilities.",
    sub: "Pick up your ideas exactly where you left them.",
  },
  signup: {
    title: "Bring the ideas.\nWe bring the intelligence.",
    sub: "Watch scattered thoughts converge into something real.",
  },
};

/**
 * Shared, stateful authentication surface. Sign In and Sign Up are two
 * states of ONE interface: switching slides the visual panel and the form
 * panel past each other (framer `layout`), morphs the brand mark, and
 * cross-fades the copy. The URL updates silently via history API so the
 * component never remounts mid-transition.
 */
export default function AuthExperience({ initialMode }: { initialMode: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const isDesktop = useIsDesktop();

  const switchTo = (m: Mode) => {
    if (m === mode) return;
    setMode(m);
    window.history.replaceState(null, "", m === "signup" ? "/signup" : "/signin");
  };

  useEffect(() => {
    const onPop = () =>
      setMode(window.location.pathname.includes("signup") ? "signup" : "signin");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const visualOnRight = mode === "signup";

  const VisualPanel = (
    <motion.div
      layout={isDesktop}
      transition={{ layout: panelTransition }}
      className={cn(
        "relative overflow-hidden",
        isDesktop
          ? cn("w-1/2", visualOnRight ? "order-2" : "order-1")
          : "h-44 w-full sm:h-56"
      )}
    >
      {/* shifting gradient wash */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: visualOnRight
            ? "radial-gradient(120% 100% at 80% 20%, rgba(160,102,255,0.35), rgba(20,16,40,0.4) 45%, #07080d 80%)"
            : "radial-gradient(120% 100% at 20% 30%, rgba(124,102,255,0.35), rgba(16,20,45,0.4) 45%, #07080d 80%)",
        }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      />
      <AuthVisual mode={mode} interactive={isDesktop} />

      {/* subtle grain + vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_100%_at_50%_50%,transparent_55%,rgba(5,6,9,0.7))]" />

      {/* brand statement (desktop) */}
      {isDesktop && (
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <div className="flex items-center gap-2.5">
            <motion.div
              animate={{ rotate: visualOnRight ? 90 : 0 }}
              transition={panelTransition}
            >
              <LogoMark className="h-8 w-8" />
            </motion.div>
            <span className="text-[19px] font-semibold tracking-tight text-mist-50">NOVA</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="whitespace-pre-line text-[clamp(1.8rem,2.6vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-mist-50">
                {statements[mode].title}
              </h2>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-mist-300">
                {statements[mode].sub}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );

  const FormPanel = (
    <motion.div
      layout={isDesktop}
      transition={{ layout: panelTransition }}
      className={cn(
        "relative flex items-center justify-center px-6 py-12 sm:px-10",
        isDesktop ? cn("w-1/2", visualOnRight ? "order-1" : "order-2") : "w-full flex-1"
      )}
    >
      <div className="w-full max-w-sm">
        {/* top row: back home + mobile logo */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            data-cursor="hover"
            className="group inline-flex items-center gap-1.5 text-[13px] text-mist-400 transition-colors hover:text-mist-100"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Home
          </Link>
          {!isDesktop && <Logo />}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: visualOnRight ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: visualOnRight ? 20 : -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {mode === "signin" ? (
              <SignInForm onSwitch={() => switchTo("signup")} />
            ) : (
              <SignUpForm onSwitch={() => switchTo("signin")} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );

  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden bg-ink-950 md:flex-row">
      {VisualPanel}
      {FormPanel}
    </main>
  );
}

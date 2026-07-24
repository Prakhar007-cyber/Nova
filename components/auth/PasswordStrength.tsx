"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const rules = [
  { label: "8+ characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase & lowercase", test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { label: "A number", test: (p: string) => /\d/.test(p) },
  { label: "A symbol", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export function scorePassword(p: string) {
  return rules.reduce((acc, r) => acc + (r.test(p) ? 1 : 0), 0);
}

const meta = [
  { label: "", color: "" },
  { label: "Weak", color: "#f87171" },
  { label: "Fair", color: "#fbbf24" },
  { label: "Good", color: "#818cf8" },
  { label: "Strong", color: "#34d399" },
];

/** Segmented strength meter + smoothly expanding requirement checklist. */
export default function PasswordStrength({ value }: { value: string }) {
  const score = scorePassword(value);
  return (
    <AnimatePresence>
      {value.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="pt-2.5">
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-ink-700">
                  <motion.div
                    className="h-full rounded-full"
                    initial={false}
                    animate={{
                      width: i < score ? "100%" : "0%",
                      backgroundColor: meta[score].color || "#4d5164",
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              ))}
              <span className="w-12 text-right text-[11px]" style={{ color: meta[score].color }}>
                {meta[score].label}
              </span>
            </div>

            <ul className="mt-3 grid grid-cols-2 gap-1.5">
              {rules.map((r) => {
                const ok = r.test(value);
                return (
                  <li
                    key={r.label}
                    className={cn(
                      "flex items-center gap-1.5 text-[11.5px] transition-colors",
                      ok ? "text-mist-200" : "text-mist-500"
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-3.5 w-3.5 place-items-center rounded-full transition-colors",
                        ok ? "bg-emerald-500/20 text-emerald-400" : "bg-mist-500/15 text-mist-500"
                      )}
                    >
                      {ok ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : <X className="h-2.5 w-2.5" strokeWidth={3} />}
                    </span>
                    {r.label}
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

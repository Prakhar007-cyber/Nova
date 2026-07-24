"use client";

import { useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Eye, EyeOff, Check, type LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  icon?: ComponentType<LucideProps>;
  autoComplete?: string;
  error?: string;
  valid?: boolean;
}

/**
 * Floating-label field with an animated gradient focus underline,
 * inline validity tick, error shake, and (for passwords) a reveal toggle.
 */
export default function AuthInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  icon: Icon,
  autoComplete,
  error,
  valid,
}: AuthInputProps) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const active = focused || value.length > 0;
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div className="w-full">
      <motion.div
        animate={error ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className={cn(
          "group relative rounded-xl border bg-ink-800/40 transition-colors duration-300",
          error
            ? "border-rose-400/50"
            : focused
            ? "border-transparent"
            : "border-mist-100/10 hover:border-mist-100/18"
        )}
      >
        {/* animated gradient border on focus */}
        <span
          className={cn(
            "pointer-events-none absolute inset-0 rounded-xl p-px opacity-0 transition-opacity duration-300 [background:linear-gradient(120deg,#9a86ff,#52d9f0)] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]",
            focused && !error && "opacity-100"
          )}
        />

        <div className="flex items-center px-3.5">
          {Icon && (
            <Icon
              className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                focused ? "text-iris-300" : "text-mist-500"
              )}
            />
          )}
          <div className="relative flex-1">
            <label
              htmlFor={id}
              className={cn(
                "pointer-events-none absolute left-2.5 origin-left text-mist-500 transition-all duration-200",
                active
                  ? "top-1.5 text-[11px] text-mist-400"
                  : "top-1/2 -translate-y-1/2 text-[14px]"
              )}
            >
              {label}
            </label>
            <input
              id={id}
              type={inputType}
              value={value}
              autoComplete={autoComplete}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full bg-transparent px-2.5 pb-2 pt-6 text-[14px] text-mist-50 outline-none"
            />
          </div>

          {isPassword && value.length > 0 && (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-mist-400 transition-colors hover:text-mist-100"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
          {!isPassword && valid && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-400"
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </motion.span>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden pl-1 pt-1.5 text-[12px] text-rose-300"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

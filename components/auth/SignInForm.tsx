"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Loader2 } from "lucide-react";
import AuthInput from "./AuthInput";
import { GoogleIcon } from "@/components/ui/BrandIcons";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export default function SignInForm({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!emailValid) errs.email = "Enter a valid email address";
    if (password.length < 6) errs.password = "Password must be at least 6 characters";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1600); // visual-only
  };

  return (
    <motion.form
      onSubmit={submit}
      variants={stagger}
      initial="hidden"
      animate="show"
      className="w-full"
    >
      <motion.h1 variants={item} className="text-[clamp(1.9rem,4vw,2.5rem)] font-semibold tracking-tight text-mist-50">
        Welcome back
      </motion.h1>
      <motion.p variants={item} className="mt-2 text-[15px] text-mist-400">
        Sign in to pick up right where you left off.
      </motion.p>

      <motion.button
        variants={item}
        type="button"
        data-cursor="hover"
        className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-xl border border-mist-100/12 bg-mist-50/[0.03] py-3 text-[14px] font-medium text-mist-100 transition-colors hover:bg-mist-50/[0.07] active:scale-[0.99]"
      >
        <GoogleIcon className="h-4 w-4" /> Continue with Google
      </motion.button>

      <motion.div variants={item} className="my-6 flex items-center gap-4 text-[12px] text-mist-500">
        <span className="h-px flex-1 bg-mist-100/10" />
        or sign in with email
        <span className="h-px flex-1 bg-mist-100/10" />
      </motion.div>

      <motion.div variants={item}>
        <AuthInput
          id="signin-email"
          label="Email address"
          type="email"
          icon={Mail}
          value={email}
          onChange={(v) => {
            setEmail(v);
            if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
          }}
          autoComplete="email"
          error={errors.email}
          valid={emailValid}
        />
      </motion.div>

      <motion.div variants={item} className="mt-3.5">
        <AuthInput
          id="signin-password"
          label="Password"
          type="password"
          icon={Lock}
          value={password}
          onChange={(v) => {
            setPassword(v);
            if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
          }}
          autoComplete="current-password"
          error={errors.password}
        />
      </motion.div>

      <motion.div variants={item} className="mt-3 flex justify-end">
        <button type="button" className="text-[13px] text-mist-400 transition-colors hover:text-iris-300">
          Forgot password?
        </button>
      </motion.div>

      <motion.button
        variants={item}
        type="submit"
        disabled={loading}
        data-cursor="hover"
        className={cn(
          "mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-mist-50 text-[15px] font-medium text-ink-950 transition-transform active:scale-[0.98] disabled:opacity-80",
          "shadow-[0_10px_40px_-12px_rgba(124,102,255,0.7)]"
        )}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
      </motion.button>

      <motion.p variants={item} className="mt-6 text-center text-[14px] text-mist-400">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          data-cursor="hover"
          className="font-medium text-iris-300 transition-colors hover:text-iris-200"
        >
          Create one
        </button>
      </motion.p>
    </motion.form>
  );
}

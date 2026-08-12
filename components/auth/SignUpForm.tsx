"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import AuthInput from "./AuthInput";
import PasswordStrength, { scorePassword } from "./PasswordStrength";
import { GoogleIcon } from "@/components/ui/BrandIcons";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export default function SignUpForm({ onSwitch }: { onSwitch: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const nameValid = name.trim().length >= 2;
  const confirmValid = confirm.length > 0 && confirm === password;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!nameValid) errs.name = "Please enter your name";
    if (!emailValid) errs.email = "Enter a valid email address";
    if (scorePassword(password) < 2) errs.password = "Choose a stronger password";
    if (!confirmValid) errs.confirm = "Passwords don't match";
    if (!agree) errs.agree = "Please accept the terms to continue";
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
        Create your workspace
      </motion.h1>
      <motion.p variants={item} className="mt-2 text-[15px] text-mist-400">
        Start free — bring your team when you&apos;re ready.
      </motion.p>

      <motion.button
        variants={item}
        type="button"
        data-cursor="hover"
        className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl border border-mist-100/12 bg-mist-50/3 py-3 text-[14px] font-medium text-mist-100 transition-colors hover:bg-mist-50/[0.07] active:scale-[0.99]"
      >
        <GoogleIcon className="h-4 w-4" /> Sign up with Google
      </motion.button>

      <motion.div variants={item} className="my-5 flex items-center gap-4 text-[12px] text-mist-500">
        <span className="h-px flex-1 bg-mist-100/10" />
        or use your email
        <span className="h-px flex-1 bg-mist-100/10" />
      </motion.div>

      <motion.div variants={item}>
        <AuthInput
          id="signup-name"
          label="Full name"
          icon={User}
          value={name}
          onChange={(v) => {
            setName(v);
            if (errors.name) setErrors((e) => ({ ...e, name: "" }));
          }}
          autoComplete="name"
          error={errors.name}
          valid={nameValid}
        />
      </motion.div>

      <motion.div variants={item} className="mt-3">
        <AuthInput
          id="signup-email"
          label="Email address"
          type="email"
          icon={Mail}
          value={email}
          onChange={(v) => {
            setEmail(v);
            if (errors.email) setErrors((e) => ({ ...e, email: "" }));
          }}
          autoComplete="email"
          error={errors.email}
          valid={emailValid}
        />
      </motion.div>

      <motion.div variants={item} className="mt-3">
        <AuthInput
          id="signup-password"
          label="Password"
          type="password"
          icon={Lock}
          value={password}
          onChange={(v) => {
            setPassword(v);
            if (errors.password) setErrors((e) => ({ ...e, password: "" }));
          }}
          autoComplete="new-password"
          error={errors.password}
        />
        <PasswordStrength value={password} />
      </motion.div>

      <motion.div variants={item} className="mt-3">
        <AuthInput
          id="signup-confirm"
          label="Confirm password"
          type="password"
          icon={Lock}
          value={confirm}
          onChange={(v) => {
            setConfirm(v);
            if (errors.confirm) setErrors((e) => ({ ...e, confirm: "" }));
          }}
          autoComplete="new-password"
          error={errors.confirm}
          valid={confirmValid}
        />
      </motion.div>

      <motion.label
        variants={item}
        className="mt-4 flex cursor-pointer items-start gap-2.5 text-[13px] text-mist-400"
      >
        <button
          type="button"
          role="checkbox"
          aria-checked={agree}
          onClick={() => {
            setAgree((a) => !a);
            if (errors.agree) setErrors((e) => ({ ...e, agree: "" }));
          }}
          className={cn(
            "mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-md border transition-colors",
            agree ? "border-iris-400 bg-iris-500" : "border-mist-100/20 bg-transparent",
            errors.agree && "border-rose-400/60"
          )}
          style={{ height: 18, width: 18 }}
        >
          <motion.svg
            viewBox="0 0 12 12"
            className="h-3 w-3 stroke-ink-950"
            fill="none"
            strokeWidth={2.4}
            initial={false}
            animate={{ pathLength: agree ? 1 : 0, opacity: agree ? 1 : 0 }}
          >
            <motion.path d="M2 6.2 4.6 9 10 3" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </button>
        <span>
          I agree to NOVA&apos;s{" "}
          <span className="text-mist-200 underline underline-offset-2">Terms</span> and{" "}
          <span className="text-mist-200 underline underline-offset-2">Privacy Policy</span>.
        </span>
      </motion.label>

      <motion.button
        variants={item}
        type="submit"
        disabled={loading}
        data-cursor="hover"
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-mist-50 text-[15px] font-medium text-ink-950 shadow-[0_10px_40px_-12px_rgba(124,102,255,0.7)] transition-transform active:scale-[0.98] disabled:opacity-80"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
      </motion.button>

      <motion.p variants={item} className="mt-5 text-center text-[14px] text-mist-400">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          data-cursor="hover"
          className="font-medium text-iris-300 transition-colors hover:text-iris-200"
        >
          Sign in
        </button>
      </motion.p>
    </motion.form>
  );
}

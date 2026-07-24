import type { Metadata } from "next";
import AuthExperience from "@/components/auth/AuthExperience";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your NOVA workspace.",
};

export default function SignInPage() {
  return <AuthExperience initialMode="signin" />;
}

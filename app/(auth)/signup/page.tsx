import type { Metadata } from "next";
import AuthExperience from "@/components/auth/AuthExperience";

export const metadata: Metadata = {
  title: "Create your workspace",
  description: "Create your NOVA workspace — free to start.",
};

export default function SignUpPage() {
  return <AuthExperience initialMode="signup" />;
}

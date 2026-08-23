import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Start free with LifeOS AI — your life, organized by AI.",
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}

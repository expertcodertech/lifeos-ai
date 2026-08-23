import Link from "next/link";
import type { ReactNode } from "react";
import { Quote, Sparkles } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">{children}</div>
        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to the{" "}
          <Link href="/pricing" className="underline underline-offset-4">
            terms
          </Link>{" "}
          and privacy policy.
        </p>
      </div>

      <aside className="relative hidden overflow-hidden border-l border-border/70 bg-gradient-to-br from-primary/10 via-background to-chart-5/10 lg:flex lg:flex-col lg:justify-center lg:px-14">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative max-w-md space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1 text-xs font-medium">
            <Sparkles className="size-3.5 text-primary" />
            Plans generated every morning
          </span>
          <p className="text-3xl leading-tight font-semibold tracking-tight text-balance">
            Your life, organized by AI — before your first coffee.
          </p>
          <figure className="glass rounded-2xl p-5">
            <Quote className="size-5 text-primary" />
            <blockquote className="mt-3 text-sm leading-relaxed">
              I stopped starting my day by deciding what to do. LifeOS hands me a plan that already
              respects my calendar, my goals and my energy.
            </blockquote>
            <figcaption className="mt-4 text-xs text-muted-foreground">
              Priya Raman · Head of Product, Northwind
            </figcaption>
          </figure>
          <dl className="grid grid-cols-3 gap-4">
            {[
              { label: "plan adherence", value: "91%" },
              { label: "focus reclaimed", value: "6.4h" },
              { label: "rating", value: "4.9/5" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-xl font-semibold">{stat.value}</dd>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </dl>
        </div>
      </aside>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock, ServerCog, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { AiPlanningDemo } from "@/components/marketing/ai-planning-demo";
import { FinalCta } from "@/components/marketing/final-cta";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Tasks, notes, calendar, goals, habits, finances and AI daily planning — every LifeOS AI capability in one place.",
};

const security = [
  {
    icon: ShieldCheck,
    title: "Row-level security",
    body: "Every row in Postgres is scoped to your user id and enforced by the database, not the application layer.",
  },
  {
    icon: Lock,
    title: "Encrypted end to end",
    body: "TLS 1.3 in transit, AES-256 at rest, and secrets isolated per environment with rotation on a 90-day cycle.",
  },
  {
    icon: ServerCog,
    title: "Your data stays yours",
    body: "We never train models on your content. Export everything as JSON or Markdown whenever you want.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 h-80 w-[720px] -translate-x-1/2 rounded-full bg-primary/15 blur-[110px]" />
        </div>
        <div className="container-page flex flex-col items-center text-center">
          <span className="rounded-full border border-border/70 bg-card px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Features
          </span>
          <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Every part of your life, finally talking to each other
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
            LifeOS is not another task list with an AI button bolted on. Context flows
            between tasks, calendar, goals, habits and notes — which is exactly what a
            planner needs to be useful.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 rounded-xl px-6 text-base"
              render={
                <Link href="/planner">
                  Try the AI planner
                  <ArrowRight data-icon="inline-end" />
                </Link>
              }
            />
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-xl px-6 text-base"
              render={<Link href="/dashboard">See the dashboard</Link>}
            />
          </div>
        </div>
      </section>

      <FeatureGrid showHeading={false} />
      <AiPlanningDemo />
      <HowItWorks />

      <section id="security" className="scroll-mt-24 py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Security"
            title="Built for the most personal data you own"
            description="Your plan contains your health, money and relationships. We architect for that."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {security.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.07} className="h-full">
                <div className="surface h-full p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}

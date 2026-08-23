import type { Metadata } from "next";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { FinalCta } from "@/components/marketing/final-cta";
import { Reveal } from "@/components/shared/reveal";
import { Check, Minus } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free forever, Pro at $9/month billed yearly, and Team for shared goals. Compare every LifeOS AI plan.",
};

const comparison: { feature: string; free: boolean | string; pro: boolean | string; team: boolean | string }[] = [
  { feature: "Tasks, notes and habits", free: "Unlimited", pro: "Unlimited", team: "Unlimited" },
  { feature: "Connected calendars", free: "1", pro: "Unlimited", team: "Unlimited" },
  { feature: "AI daily plan", free: "3 / week", pro: "Unlimited", team: "Unlimited" },
  { feature: "Replan during the day", free: false, pro: true, team: true },
  { feature: "Notes → task extraction", free: false, pro: true, team: true },
  { feature: "Finance tracking", free: false, pro: true, team: true },
  { feature: "Analytics history", free: "7 days", pro: "Unlimited", team: "Unlimited" },
  { feature: "Shared goals and dashboards", free: false, pro: false, team: true },
  { feature: "SSO and audit logs", free: false, pro: false, team: true },
  { feature: "Support", free: "Community", pro: "Priority", team: "Dedicated CSM" },
];

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "string") return <span className="text-sm">{value}</span>;
  return value ? (
    <Check className="mx-auto size-4 text-primary" aria-label="Included" />
  ) : (
    <Minus className="mx-auto size-4 text-muted-foreground/50" aria-label="Not included" />
  );
}

export default function PricingPage() {
  return (
    <>
      <section className="pt-20 pb-4 sm:pt-24">
        <div className="container-page flex flex-col items-center text-center">
          <span className="rounded-full border border-border/70 bg-card px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Pricing
          </span>
          <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            One subscription. Your whole life, organized.
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
            Less than the productivity apps it replaces, and it actually plans your day.
          </p>
        </div>
      </section>

      <PricingSection showHeading={false} />

      <section className="pb-8">
        <div className="container-page">
          <Reveal className="surface overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-left">
                <caption className="sr-only">Feature comparison across LifeOS AI plans</caption>
                <thead>
                  <tr className="border-b border-border/60 bg-muted/40">
                    <th scope="col" className="px-6 py-4 text-sm font-semibold">Feature</th>
                    <th scope="col" className="px-6 py-4 text-center text-sm font-semibold">Free</th>
                    <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-primary">Pro</th>
                    <th scope="col" className="px-6 py-4 text-center text-sm font-semibold">Team</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.feature} className="border-b border-border/50 last:border-0">
                      <th scope="row" className="px-6 py-3.5 text-sm font-normal">{row.feature}</th>
                      <td className="px-6 py-3.5 text-center text-muted-foreground"><Cell value={row.free} /></td>
                      <td className="bg-primary/[0.04] px-6 py-3.5 text-center"><Cell value={row.pro} /></td>
                      <td className="px-6 py-3.5 text-center text-muted-foreground"><Cell value={row.team} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <FaqSection />
      <FinalCta />
    </>
  );
}

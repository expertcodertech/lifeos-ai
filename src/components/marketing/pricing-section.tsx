"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { pricingPlans } from "@/lib/data/marketing";
import { cn } from "@/lib/utils";

export function PricingSection({ showHeading = true }: { showHeading?: boolean }) {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-page">
        {showHeading ? (
          <SectionHeading
            eyebrow="Pricing"
            title="Priced like a tool you use every day"
            description="Start free, upgrade when the daily plan becomes part of how you work. Cancel in two clicks."
          />
        ) : null}

        <div className="mt-10 flex items-center justify-center">
          <div
            role="group"
            aria-label="Billing period"
            className="inline-flex items-center rounded-full border border-border/70 bg-card p-1"
          >
            {[
              { id: "monthly", label: "Monthly" },
              { id: "yearly", label: "Yearly" },
            ].map((option) => {
              const active = (option.id === "yearly") === yearly;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setYearly(option.id === "yearly")}
                  aria-pressed={active}
                  className={cn(
                    "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {option.label}
                  {option.id === "yearly" ? (
                    <span
                      className={cn(
                        "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                        active ? "bg-primary-foreground/15" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                      )}
                    >
                      −25%
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid items-start gap-5 lg:grid-cols-3">
          {pricingPlans.map((plan, i) => {
            const price = yearly ? Math.round(plan.yearly / 12) : plan.monthly;
            return (
              <Reveal key={plan.name} delay={i * 0.07} className="h-full">
                <div
                  className={cn(
                    "surface relative flex h-full flex-col p-7",
                    plan.highlighted &&
                      "border-primary/40 shadow-[0_24px_60px_-30px_rgba(88,28,235,0.55)] lg:-mt-4 lg:pb-11",
                  )}
                >
                  {plan.highlighted ? (
                    <span className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                      <Sparkles className="size-3" />
                      Most popular
                    </span>
                  ) : null}

                  <h3 className="text-lg font-semibold tracking-tight">{plan.name}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{plan.tagline}</p>

                  <p className="mt-6 flex items-baseline gap-1.5">
                    <span className="text-4xl font-semibold tracking-tight tabular-nums">
                      ${price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {plan.monthly === 0 ? "forever" : "/ month"}
                    </span>
                  </p>
                  {plan.monthly > 0 ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {yearly ? `Billed $${plan.yearly} yearly` : "Billed monthly"}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-muted-foreground">No card required</p>
                  )}

                  <Button
                    size="lg"
                    variant={plan.highlighted ? "default" : "outline"}
                    className="mt-6 h-11 w-full rounded-xl text-sm"
                    render={<Link href={plan.name === "Team" ? "/signup?plan=team" : "/signup"}>{plan.cta}</Link>}
                  />

                  <ul className="mt-7 flex flex-col gap-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          All plans include end-to-end encryption, data export and row-level security.
        </p>
      </div>
    </section>
  );
}

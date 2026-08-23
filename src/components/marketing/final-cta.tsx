import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";

export function FinalCta() {
  return (
    <section className="pb-24">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/12 via-card to-chart-5/10 px-6 py-16 text-center sm:px-16">
            <div
              aria-hidden
              className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_70%_at_50%_50%,black,transparent)]"
            />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="size-3" />
                Takes 90 seconds to set up
              </span>
              <h2 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
                Stop managing your system.
                <br className="hidden sm:block" /> Start living your plan.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                Join 38,000 people who wake up to a day that is already organized. Free
                forever plan, no credit card, cancel anytime.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="h-12 w-full rounded-xl px-6 text-base shadow-lg shadow-primary/20 sm:w-auto"
                  render={
                    <Link href="/signup">
                      Build My Plan
                      <ArrowRight data-icon="inline-end" />
                    </Link>
                  }
                />
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 w-full rounded-xl px-6 text-base sm:w-auto"
                  render={<Link href="/pricing">Compare plans</Link>}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

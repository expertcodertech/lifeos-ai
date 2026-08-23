import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { howItWorks } from "@/lib/data/marketing";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-24 overflow-hidden py-20 sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-muted/40" />
      <div className="container-page">
        <SectionHeading
          eyebrow="How it works"
          title="Capture → Understand → Plan → Execute"
          description="A loop that runs every day, gets sharper every week, and never asks you to maintain a system."
        />

        <ol className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.08} className="h-full">
              <li className="surface relative h-full p-6">
                <span
                  aria-hidden
                  className="absolute top-5 right-5 text-4xl font-semibold tracking-tight text-foreground/[0.06]"
                >
                  {step.step}
                </span>
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <step.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
                {i < howItWorks.length - 1 ? (
                  <span
                    aria-hidden
                    className="absolute top-11 -right-2 hidden h-px w-4 bg-border lg:block"
                  />
                ) : null}
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { features } from "@/lib/data/marketing";
import { cn } from "@/lib/utils";

export function FeatureGrid({
  showHeading = true,
  limit,
}: {
  showHeading?: boolean;
  limit?: number;
}) {
  const items = limit ? features.slice(0, limit) : features;

  return (
    <section id="features" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-page">
        {showHeading ? (
          <SectionHeading
            eyebrow="Everything in one place"
            title="One command center instead of seven apps"
            description="Each surface is useful on its own — together they give the AI enough context to plan a day that reflects your whole life, not just your inbox."
          />
        ) : null}

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.05}>
              <article
                className={cn(
                  "group surface h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-24px_rgba(76,29,149,0.35)]",
                  feature.accent && "border-primary/25 bg-primary/[0.04]",
                )}
              >
                <span
                  className={cn(
                    "grid size-11 place-items-center rounded-xl transition-colors",
                    feature.accent
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
                  )}
                >
                  <feature.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

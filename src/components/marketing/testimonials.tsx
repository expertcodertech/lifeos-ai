import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { testimonials } from "@/lib/data/marketing";

export function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Loved by people who plan"
          title="From blank page to booked day"
          description="Operators, founders and makers who replaced five tools and a Sunday-night ritual."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 0.07} className="h-full">
              <figure className="surface flex h-full flex-col gap-5 p-6">
                <blockquote className="text-sm leading-relaxed text-foreground/90">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {t.initials}
                  </span>
                  <span className="text-sm">
                    <span className="block font-medium">{t.name}</span>
                    <span className="block text-xs text-muted-foreground">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

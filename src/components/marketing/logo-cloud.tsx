import { logos } from "@/lib/data/marketing";

export function LogoCloud() {
  return (
    <section aria-label="Companies using LifeOS AI" className="py-12">
      <div className="container-page">
        <p className="text-center text-sm text-muted-foreground">
          Trusted by operators, founders and makers at
        </p>
        <div className="relative mt-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="animate-marquee flex w-max items-center gap-14">
            {[...logos, ...logos].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="text-lg font-semibold tracking-tight text-muted-foreground/70"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

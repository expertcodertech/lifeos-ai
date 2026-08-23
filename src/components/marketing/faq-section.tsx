import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/shared/section-heading";
import { faqs } from "@/lib/data/marketing";

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeading
          align="left"
          eyebrow="FAQ"
          title="Questions people ask before switching"
          description="Everything else is one message away — we answer in under an hour on weekdays."
        />

        <div>
          <Accordion className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="mt-6 text-sm text-muted-foreground">
            Still deciding?{" "}
            <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
              Try the free plan
            </Link>{" "}
            — it stays free.
          </p>
        </div>
      </div>
    </section>
  );
}

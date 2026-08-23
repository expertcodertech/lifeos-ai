import { Hero } from "@/components/marketing/hero";
import { LogoCloud } from "@/components/marketing/logo-cloud";
import { AiPlanningDemo } from "@/components/marketing/ai-planning-demo";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { AnalyticsSection } from "@/components/marketing/analytics-section";
import { Testimonials } from "@/components/marketing/testimonials";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { FinalCta } from "@/components/marketing/final-cta";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <LogoCloud />
      <AiPlanningDemo />
      <FeatureGrid />
      <HowItWorks />
      <AnalyticsSection />
      <Testimonials />
      <PricingSection />
      <FaqSection />
      <FinalCta />
    </>
  );
}

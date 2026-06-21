import { AISection } from "./_components/ai-section";
import { CTASection } from "./_components/cta-section";
import { FeatureCardsSection } from "./_components/feature-cards-section";
import { Footer } from "./_components/footer";
import { Hero } from "./_components/hero";
import { LogoCloud } from "./_components/logo-cloud";
import { Navbar } from "./_components/navbar";
import { ProductDirectionSection } from "./_components/product-direction-section";
import { WorkflowsSection } from "./_components/workflows-section";

export default function SprintPage() {
  return (
    <div
      className="w-full overflow-x-hidden"
      style={{ backgroundColor: "#09090B" }}
    >
      <Navbar />
      <Hero />
      <LogoCloud />
      <FeatureCardsSection />
      <AISection />
      <ProductDirectionSection />
      <WorkflowsSection />
      <CTASection />
      <Footer />
    </div>
  );
}

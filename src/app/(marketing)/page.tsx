import { auth } from "@/lib/auth";
import { AISection } from "./_components/ai-section";
import { CTASection } from "./_components/cta-section";
import { FeatureCardsSection } from "./_components/feature-cards-section";
import { Footer } from "./_components/footer";
import { Hero } from "./_components/hero";
import { LogoCloud } from "./_components/logo-cloud";
import { Navbar } from "./_components/navbar";
import { ProductDirectionSection } from "./_components/product-direction-section";
import { WorkflowsSection } from "./_components/workflows-section";
import { headers } from "next/headers";
export default async function SprintPage() {
  const data = await auth.api.getSession({
    headers: await headers(),
  });
  console.log("data", data);
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

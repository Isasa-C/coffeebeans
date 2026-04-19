import { CoffeeCaseHero } from "@/components/coffee-case-hero";
import { CoffeeDesignSection } from "@/components/coffee-design-section";
import { CoffeeFeatures } from "@/components/coffee-features";
import { CoffeeLogicSection } from "@/components/coffee-logic-section";

export function CoffeeCaseStudyPage() {
  return (
    <main className="grain min-h-screen py-6 sm:py-8">
      <div className="page-shell animate-rise space-y-6 sm:space-y-8">
        <CoffeeCaseHero />
        <CoffeeFeatures />
        <CoffeeDesignSection />
        <CoffeeLogicSection />
      </div>
    </main>
  );
}

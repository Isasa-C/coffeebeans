import type { Metadata } from "next";

import { CoffeeCaseStudyPage } from "@/components/coffee-case-study-page";

export const metadata: Metadata = {
  title: "Coffee Beans Case Study",
  description:
    "A premium product case study for Coffee Beans, a guided coffee education and roast matching experience.",
};

export default function CaseStudyPage() {
  return <CoffeeCaseStudyPage />;
}

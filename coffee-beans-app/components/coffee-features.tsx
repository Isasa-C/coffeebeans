import type { ReactNode } from "react";

import {
  BeanDecoration,
  CaseStudySection,
  IconBadge,
  SectionHeading,
  SectionLabel,
} from "@/components/case-study-primitives";
import { coffeeCaseStudyContent } from "@/content/coffee-case-study";

export function CoffeeFeatures() {
  const { features } = coffeeCaseStudyContent;

  return (
    <CaseStudySection className="bg-[linear-gradient(180deg,rgba(255,250,244,0.95)_0%,rgba(248,239,229,0.92)_100%)]">
      <BeanDecoration className="absolute top-12 right-20 opacity-50" />
      <div className="space-y-8">
        <div className="space-y-4">
          <SectionLabel index={features.sectionIndex} title={features.sectionTitle} />
          <SectionHeading title={features.title} description={features.description} />
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {features.cards.map((feature) => {
            const { key, ...card } = feature;

            return <FeatureCard key={key} {...card} icon={getFeatureIcon(key)} />;
          })}
        </div>
      </div>
    </CaseStudySection>
  );
}

function FeatureCard({
  title,
  description,
  previewTitle,
  previewAccent,
  badge,
  icon,
}: {
  title: string;
  description: string;
  previewTitle: string;
  previewAccent: string;
  badge: string;
  icon: ReactNode;
}) {
  return (
    <article className="group rounded-[1.7rem] border border-[rgba(109,78,55,0.12)] bg-white/78 p-5 shadow-[0_22px_45px_rgba(87,55,34,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_50px_rgba(87,55,34,0.12)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <IconBadge>{icon}</IconBadge>
        <span className="rounded-full bg-[#f4e8dd] px-3 py-1 text-[0.68rem] font-semibold tracking-[0.18em] text-[#8a6b57] uppercase">
          {badge}
        </span>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#412c20]">{title}</h3>
        <p className="text-sm leading-7 text-[#735c4c]">{description}</p>
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-[rgba(115,84,61,0.1)] bg-[#fbf6f0] p-4">
        <div className={`h-28 rounded-[1.2rem] bg-gradient-to-br ${previewAccent} p-3`}>
          <div className="flex h-full flex-col justify-between rounded-[1rem] border border-white/35 bg-white/20 p-3 backdrop-blur-sm">
            <div className="text-[0.72rem] font-semibold tracking-[0.18em] text-white/90 uppercase">
              {previewTitle}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-10 rounded-xl bg-white/75" />
              <div className="h-10 rounded-xl bg-white/55" />
              <div className="h-10 rounded-xl bg-white/35" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function getFeatureIcon(key: string) {
  if (key === "roasts") return <RoastIcon />;
  if (key === "drinks") return <DrinkIcon />;
  return <MatchIcon />;
}

function RoastIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <path d="M12 4c2.5 0 4.5 1.8 4.5 4.1 0 3.1-4.5 7.9-4.5 7.9S7.5 11.2 7.5 8.1C7.5 5.8 9.5 4 12 4Z" />
      <path d="M12 5.8c-1.2 1.4-1.2 4 0 5.5" />
    </svg>
  );
}

function DrinkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <path d="M6 9h9v4.5A3.5 3.5 0 0 1 11.5 17h-2A3.5 3.5 0 0 1 6 13.5V9Z" />
      <path d="M15 10h1.5A2.5 2.5 0 0 1 19 12.5v0A2.5 2.5 0 0 1 16.5 15H15" />
      <path d="M8 20h8" />
      <path d="M9 5c0 1 .8 1.4.8 2.4" />
      <path d="M12 4.5c0 1 .8 1.4.8 2.4" />
    </svg>
  );
}

function MatchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <path d="M8 6h8" />
      <path d="M6 12h12" />
      <path d="M9 18h6" />
      <circle cx="16" cy="6" r="2" fill="currentColor" stroke="none" />
      <circle cx="8" cy="12" r="2" fill="currentColor" stroke="none" />
      <circle cx="13" cy="18" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

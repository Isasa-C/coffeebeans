import type { ReactNode } from "react";

import {
  CaseStudySection,
  IconBadge,
  SectionHeading,
  SectionLabel,
} from "@/components/case-study-primitives";
import { coffeeCaseStudyContent } from "@/content/coffee-case-study";

export function CoffeeLogicSection() {
  const { logic } = coffeeCaseStudyContent;

  return (
    <CaseStudySection>
      <div className="space-y-8">
        <div className="space-y-4">
          <SectionLabel index={logic.sectionIndex} title={logic.sectionTitle} />
          <SectionHeading title={logic.title} description={logic.description} />
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-[980px] items-start gap-3">
            {logic.steps.map((step, index) => (
              <StepCard
                key={step.key}
                title={step.title}
                description={step.description}
                index={index + 1}
                icon={getStepIcon(step.key)}
                isLast={index === logic.steps.length - 1}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.7rem] border border-[rgba(109,78,55,0.12)] bg-[#fbf6f0] p-6 shadow-[0_22px_45px_rgba(87,55,34,0.08)]">
            <h3 className="text-lg font-semibold text-[#422d20]">{logic.factorsTitle}</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {logic.factors.map((factor) => (
                <div
                  key={factor}
                  className="rounded-[1.2rem] border border-[rgba(114,83,60,0.1)] bg-white/80 px-4 py-3 text-sm text-[#6e5746]"
                >
                  {factor}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.7rem] border border-[rgba(85,61,44,0.14)] bg-[#2e221d] p-6 text-[#f6ede4] shadow-[0_26px_55px_rgba(56,34,22,0.22)]">
            <div className="text-[0.72rem] font-semibold tracking-[0.2em] text-[#d4b395] uppercase">
              {logic.outputTitle}
            </div>
            <pre className="mt-4 overflow-x-auto text-sm leading-7 text-[#f8efe7]">{logic.output}</pre>
          </div>
        </div>
      </div>
    </CaseStudySection>
  );
}

function getStepIcon(key: string) {
  if (key === "input") return <InputIcon />;
  if (key === "mapping") return <MapIcon />;
  if (key === "logic") return <LogicIcon />;
  if (key === "selection") return <SelectIcon />;
  return <ResultIcon />;
}

function StepCard({
  title,
  description,
  index,
  icon,
  isLast,
}: {
  title: string;
  description: string;
  index: number;
  icon: ReactNode;
  isLast: boolean;
}) {
  return (
    <>
      <article className="w-[180px] shrink-0 rounded-[1.6rem] border border-[rgba(109,78,55,0.12)] bg-white/80 p-4 shadow-[0_18px_36px_rgba(87,55,34,0.08)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <IconBadge>{icon}</IconBadge>
          <span className="text-sm font-semibold text-[#8a6d5a]">0{index}</span>
        </div>
        <h3 className="text-base font-semibold text-[#442e22]">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#735c4c]">{description}</p>
      </article>

      {!isLast ? (
        <div className="flex h-[150px] shrink-0 items-center px-1 text-[#b18c73]">
          <ArrowIcon />
        </div>
      ) : null}
    </>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 56 24" className="h-6 w-14 fill-none stroke-current" strokeWidth="1.8">
      <path d="M3 12h48" />
      <path d="m42 5 8 7-8 7" />
    </svg>
  );
}

function InputIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2.5 2.5" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <path d="M5 7.5 9.5 5l5 2.5L19 5v11.5L14.5 19l-5-2.5L5 19V7.5Z" />
      <path d="M9.5 5v11.5" />
      <path d="M14.5 7.5V19" />
    </svg>
  );
}

function LogicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <path d="M6 16V9" />
      <path d="M12 16V6" />
      <path d="M18 16v-4" />
      <path d="M4 18h16" />
    </svg>
  );
}

function SelectIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <path d="m12 4 2.5 4.5 5 .7-3.6 3.7.8 5.1-4.7-2.2-4.7 2.2.8-5.1L4.5 9.2l5-.7L12 4Z" />
    </svg>
  );
}

function ResultIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <path d="M8 7.5a4 4 0 1 1 8 0c0 3-4 6.5-4 6.5S8 10.5 8 7.5Z" />
      <path d="M7 18h10" />
    </svg>
  );
}

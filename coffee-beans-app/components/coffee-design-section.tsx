import {
  BeanDecoration,
  CaseStudySection,
  IconBadge,
  SectionHeading,
  SectionLabel,
} from "@/components/case-study-primitives";
import { coffeeCaseStudyContent } from "@/content/coffee-case-study";

export function CoffeeDesignSection() {
  const { design } = coffeeCaseStudyContent;

  return (
    <CaseStudySection className="bg-[linear-gradient(135deg,rgba(244,232,218,0.95)_0%,rgba(255,249,243,0.92)_48%,rgba(236,220,204,0.9)_100%)]">
      <BeanDecoration className="absolute top-14 right-14 opacity-65" />
      <BeanDecoration className="absolute bottom-18 left-[54%] h-5 w-3 opacity-40" />

      <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="space-y-6">
          <SectionLabel index={design.sectionIndex} title={design.sectionTitle} />
          <SectionHeading title={design.title} description={design.description} />

          <div className="grid gap-4">
            {design.points.map((point) => (
              <div
                key={point.key}
                className="flex gap-4 rounded-[1.5rem] border border-[rgba(109,78,55,0.1)] bg-white/72 p-4 shadow-[0_18px_36px_rgba(87,55,34,0.06)]"
              >
                <IconBadge className="h-11 w-11 rounded-xl">{getDesignIcon(point.key)}</IconBadge>
                <div className="space-y-1">
                  <h3 className="font-semibold text-[#432d20]">{point.title}</h3>
                  <p className="text-sm leading-6 text-[#745d4d]">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[430px]">
          <div className="absolute left-0 top-10 w-[72%] rounded-[2rem] border border-[rgba(96,64,43,0.18)] bg-[#33251d] p-3 shadow-[0_35px_90px_rgba(63,39,23,0.25)]">
            <div className="rounded-[1.6rem] bg-[#fbf5ee] p-5">
              <div className="mb-5 flex gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#e4b189]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#d3c1ad]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#e9ddd1]" />
              </div>
              <div className="grid gap-4">
                <div className="flex gap-2 rounded-full bg-[#f1e4d6] p-1 text-xs font-medium text-[#7a5f4d]">
                  {design.tabs.map((tab, index) => (
                    <span
                      key={tab}
                      className={`rounded-full px-3 py-1.5 ${index === 2 ? "bg-white text-[#503426] shadow-sm" : ""}`}
                    >
                      {tab}
                    </span>
                  ))}
                </div>
                <div className="grid gap-3 rounded-[1.4rem] bg-white p-4 shadow-[0_16px_32px_rgba(89,58,36,0.07)]">
                  <div className="h-2 w-28 rounded-full bg-[#d2b090]" />
                  <div className="h-2 w-40 rounded-full bg-[#ead8c8]" />
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="h-24 rounded-[1.2rem] bg-[linear-gradient(180deg,#edd6bc_0%,#cf9f77_100%)]" />
                    <div className="h-24 rounded-[1.2rem] bg-[linear-gradient(180deg,#e4c9a8_0%,#9f6c48_100%)]" />
                    <div className="h-24 rounded-[1.2rem] bg-[linear-gradient(180deg,#8b6448_0%,#3f271b_100%)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute right-[8%] top-20 z-10 w-[26%] rounded-[2rem] border border-[rgba(99,68,46,0.16)] bg-[#fffaf5]/95 p-3 shadow-[0_28px_45px_rgba(63,39,23,0.16)]">
            <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-[#d8c0aa]" />
            <div className="space-y-3 rounded-[1.5rem] bg-[#fcf5ee] p-3">
              <div className="h-20 rounded-[1.2rem] bg-[linear-gradient(180deg,#dcb894_0%,#98623e_100%)]" />
              <div className="h-2 w-14 rounded-full bg-[#c99d77]" />
              <div className="h-2 w-20 rounded-full bg-[#ead7c7]" />
              <div className="h-9 rounded-2xl bg-white shadow-sm" />
            </div>
          </div>

          <div className="absolute right-0 bottom-0 z-20 w-[30%] rounded-[2rem] border border-[rgba(99,68,46,0.16)] bg-[#fffaf5]/95 p-3 shadow-[0_28px_45px_rgba(63,39,23,0.16)]">
            <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-[#d8c0aa]" />
            <div className="space-y-3 rounded-[1.5rem] bg-[#fcf5ee] p-3">
              <div className="h-12 rounded-[1.1rem] bg-white shadow-sm" />
              <div className="h-12 rounded-[1.1rem] bg-white shadow-sm" />
              <div className="h-12 rounded-[1.1rem] bg-[linear-gradient(180deg,#8e6243_0%,#593828_100%)]" />
            </div>
          </div>
        </div>
      </div>
    </CaseStudySection>
  );
}

function getDesignIcon(key: string) {
  if (key === "guide") return <GuideIcon />;
  if (key === "tabs") return <TabsIcon />;
  if (key === "visuals") return <PaletteIcon />;
  return <ResponsiveIcon />;
}

function GuideIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <path d="M7 5.5h8A2.5 2.5 0 0 1 17.5 8v10.5H9A2.5 2.5 0 0 0 6.5 21V8A2.5 2.5 0 0 1 9 5.5Z" />
      <path d="M9 8.5h5" />
      <path d="M9 11.5h5" />
    </svg>
  );
}

function TabsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <rect x="4.5" y="6.5" width="15" height="11" rx="2.5" />
      <path d="M4.5 10.5h15" />
      <path d="M9 6.5v4" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <path d="M12 4.5a7.5 7.5 0 1 0 0 15h1.2a1.8 1.8 0 0 0 0-3.6h-.8a1.9 1.9 0 0 1-1.9-1.9c0-1 .8-1.8 1.8-1.8H15a4.5 4.5 0 0 0 0-9Z" />
      <circle cx="8.5" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="11.5" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ResponsiveIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <rect x="4" y="5" width="11" height="9" rx="2" />
      <rect x="16.5" y="8" width="3.5" height="8" rx="1" />
      <path d="M8 18.5h3" />
    </svg>
  );
}

import Link from "next/link";

import {
  BeanDecoration,
  CaseStudySection,
  SectionLabel,
} from "@/components/case-study-primitives";
import { coffeeCaseStudyContent } from "@/content/coffee-case-study";

export function CoffeeCaseHero() {
  const { hero } = coffeeCaseStudyContent;

  return (
    <CaseStudySection className="isolate">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(240,222,201,0.85),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(139,92,56,0.14),transparent_30%)]" />
      <BeanDecoration className="absolute top-9 right-16 h-7 w-5 rotate-[28deg] opacity-80" />
      <BeanDecoration className="absolute bottom-16 left-[48%] h-5 w-3 -rotate-[18deg] opacity-55" />

      <div className="relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-7">
          <SectionLabel index={hero.sectionIndex} title={hero.sectionTitle} />

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-[-0.05em] text-[#3b261b] sm:text-5xl lg:text-6xl">
              {hero.title} <span className="align-[0.06em] text-[#7a4a2c]">{hero.emoji}</span>
            </h1>
            <p className="text-lg font-medium text-[#6e4f3c] sm:text-xl">{hero.subtitle}</p>
            <p className="max-w-xl text-sm leading-7 text-[#755d4b] sm:text-base">
              {hero.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {hero.techStack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[rgba(110,78,56,0.14)] bg-white/80 px-4 py-2 text-sm font-medium text-[#6d513f] shadow-[0_10px_30px_rgba(87,55,34,0.06)]"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={hero.liveSiteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-[#5b3824] px-5 py-3 text-sm font-semibold text-[#fff7f0] transition hover:bg-[#4b2c1b]"
            >
              {hero.ctaLabel}
            </Link>
            <div className="text-sm text-[#806452]">
              <div className="font-semibold text-[#5c3c2a]">{hero.liveSiteLabel}</div>
              <div>{hero.liveSiteDisplay}</div>
            </div>
          </div>
        </div>

        <div className="relative flex min-h-[460px] items-center justify-center px-2 sm:px-6 lg:min-h-[520px]">
          <div className="absolute right-0 bottom-0 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(147,96,60,0.22),transparent_70%)] blur-2xl" />

          <div className="relative w-full max-w-[680px]">
            <div className="mx-auto w-[92%] rounded-[2rem] border border-[rgba(87,56,37,0.2)] bg-[#2f221b] p-3 shadow-[0_35px_90px_rgba(63,39,23,0.28)]">
              <div className="rounded-[1.4rem] bg-[#fbf5ee] p-5 sm:p-6">
                <div className="mb-6 flex items-center justify-between text-[0.72rem] font-medium text-[#8b6d58]">
                  <span>{hero.mockup.appName}</span>
                  <span>{hero.mockup.appMode}</span>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="h-2 w-28 rounded-full bg-[#dcc3a9]" />
                      <div className="h-2 w-44 rounded-full bg-[#eedecf]" />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                      {hero.mockup.roastCards.map((card) => (
                        <div
                          key={card.title}
                          className="rounded-[1.35rem] border border-[rgba(104,74,52,0.12)] bg-white/80 p-3"
                        >
                          <div className={`mb-3 h-20 rounded-[1rem] bg-gradient-to-br ${card.tone}`} />
                          <div className="text-sm font-semibold text-[#4b3123]">{card.title}</div>
                          <div className="text-xs text-[#856957]">{card.note}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.6rem] border border-[rgba(116,84,61,0.12)] bg-[linear-gradient(180deg,#fff8f2_0%,#f6eadf_100%)] p-5">
                    <div className="flex items-center justify-between text-xs font-medium text-[#896c58]">
                      <span>{hero.mockup.quizTitle}</span>
                      <span>{hero.mockup.quizMeta}</span>
                    </div>
                    <div className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <div className="h-2 w-full rounded-full bg-[#ead5c2]" />
                        <div className="h-2 w-[78%] rounded-full bg-[#f1e6da]" />
                        <div className="h-2 w-[58%] rounded-full bg-[#f1e6da]" />
                      </div>

                      <div className="rounded-[1.3rem] bg-[#5f3d2a] px-4 py-3 text-[#fff5ea] shadow-[0_18px_30px_rgba(79,49,31,0.18)]">
                        <div className="text-xs uppercase tracking-[0.18em] text-[#e5c6a3]">
                          {hero.mockup.resultLabel}
                        </div>
                        <div className="mt-1 text-xl font-semibold">{hero.mockup.resultValue}</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {hero.mockup.resultTags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white/12 px-3 py-1 text-xs font-medium text-[#fce6d3]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {hero.mockup.profileTags.map((item) => (
                          <div
                            key={item}
                            className="rounded-2xl border border-[rgba(116,84,61,0.1)] bg-white/72 px-3 py-2 text-center text-xs font-semibold text-[#745846]"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-[-1.5rem] left-0 w-[34%] rounded-[2rem] border border-[rgba(96,64,43,0.18)] bg-[#fffaf5]/95 p-3 shadow-[0_28px_45px_rgba(63,39,23,0.18)] sm:left-6 sm:p-4">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#d9c2ad]" />
              <div className="space-y-3 rounded-[1.6rem] bg-[#fcf5ed] p-3">
                <div className="space-y-1">
                  <div className="h-1.5 w-14 rounded-full bg-[#d2b090]" />
                  <div className="h-1.5 w-20 rounded-full bg-[#ead9c7]" />
                </div>
                <div className="rounded-[1.2rem] bg-white p-3 shadow-[0_12px_24px_rgba(88,56,34,0.08)]">
                  <div className="h-16 rounded-[0.9rem] bg-[linear-gradient(180deg,#dcb894_0%,#9a6743_100%)]" />
                  <div className="mt-2 text-xs font-semibold text-[#4f3425]">
                    {hero.mockup.mobileCardTitle}
                  </div>
                  <div className="text-[0.72rem] text-[#866958]">
                    {hero.mockup.mobileCardDescription}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CaseStudySection>
  );
}

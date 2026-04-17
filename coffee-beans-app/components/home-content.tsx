"use client";

import Image from "next/image";
import Link from "next/link";
import { BeanCardGrid } from "@/components/bean-card-grid";
import { BeanForm } from "@/components/bean-form";
import {
  CoffeeGuideSection,
} from "@/components/coffee-guide-section";
import { LanguageProvider, useLanguage } from "@/components/language-provider";
import { type BeanRecord } from "@/lib/utils";

export function HomeContent({ catalog }: { catalog: BeanRecord[] }) {
  return (
    <LanguageProvider>
      <HomeContentInner catalog={catalog} />
    </LanguageProvider>
  );
}

function HomeContentInner({ catalog }: { catalog: BeanRecord[] }) {
  const { language, setLanguage, messages, languageOptions } = useLanguage();
  const navItems = [
    { href: "#home", label: messages.navHome },
    { href: "#my-beans", label: messages.navMyBeans },
    { href: "#coffee-guide", label: messages.navCoffeeGuide },
    { href: "#add-bean", label: messages.navAddBean },
  ];

  return (
    <main className="grain min-h-screen py-8 sm:py-12">
      <div className="page-shell animate-rise space-y-8">
        <div className="card-surface flex flex-col gap-4 rounded-[1.75rem] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/coffee-shop-prices"
              className="rounded-full border border-[rgba(97,68,44,0.16)] bg-[rgba(138,75,42,0.1)] px-4 py-2 text-sm font-semibold text-accent transition hover:bg-[rgba(138,75,42,0.16)]"
            >
              Coffee Shop Prices
            </Link>
          </div>

          <nav aria-label="Primary" className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full border border-line bg-white/55 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-white/80 hover:text-accent"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="rounded-full border border-line bg-card/85 px-3 py-2">
            <label className="mr-2 text-sm font-semibold text-foreground" htmlFor="languageSwitcher">
              {messages.languageLabel}
            </label>
            <select
              id="languageSwitcher"
              className="rounded-full bg-transparent text-sm font-semibold text-accent outline-none"
              value={language}
              onChange={(event) => setLanguage(event.target.value as typeof language)}
            >
              {languageOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <section
          className="card-surface relative scroll-mt-24 overflow-hidden rounded-[2rem] px-6 py-8 sm:px-10 sm:py-10"
          id="home"
        >
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-[#d89a6e]/25 via-transparent to-[#8f5734]/15" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="space-y-6 pt-4 sm:pt-6 lg:pt-10">
              <span className="inline-flex rounded-full border border-[rgba(97,68,44,0.16)] bg-white/65 px-4 py-1 text-sm font-semibold tracking-[0.2em] text-accent uppercase">
                {messages.personalCoffeeLog}
              </span>
              <div className="space-y-5">
                <h1 className="display-font max-w-2xl text-4xl leading-tight font-semibold text-accent sm:text-5xl">
                  {messages.heroTitle}
                </h1>
              </div>
              <p className="max-w-2xl text-base leading-8 text-muted">
                {messages.heroDescription}
              </p>
              <div className="card-surface relative overflow-hidden rounded-[1.75rem]">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#4c2c17]/18 via-transparent to-[#d89a6e]/18" />
                <div className="relative aspect-[16/10]">
                  <Image
                    src="/hero-coffee.png"
                    alt={messages.heroImageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            </div>
            <div id="add-bean">
              <BeanForm />
            </div>
          </div>
        </section>

        <section className="scroll-mt-24 space-y-4" id="my-beans">
          <BeanCardGrid beans={catalog} />
        </section>
        <CoffeeGuideSection />
      </div>
    </main>
  );
}

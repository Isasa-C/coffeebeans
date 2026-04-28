"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BeanCardGrid } from "@/components/bean-card-grid";
import { BeanForm } from "@/components/bean-form";
import { CoffeeGuideSection } from "@/components/coffee-guide-section";
import { LanguageProvider, useLanguage } from "@/components/language-provider";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";
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
  const [isGuideVisible, setIsGuideVisible] = useState(false);
  const [isAddBeanModalOpen, setIsAddBeanModalOpen] = useState(false);
  const navItems = [
    { href: "/coffee-shop-prices", label: "Cafe Prices" },
  ];

  function handleGuideClick() {
    setIsGuideVisible(true);
    window.setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 0);
  }

  function handleHomeClick() {
    setIsGuideVisible(false);
  }

  function handleGuideAddBeanClick() {
    setIsGuideVisible(false);
    setIsAddBeanModalOpen(true);
  }

  return (
    <main className="grain min-h-screen py-8 sm:py-12">
      <div className="page-shell animate-rise space-y-8">
        <header className="card-surface relative flex h-14 items-center justify-between rounded-[1.75rem] px-4 sm:px-5">
          <a
            href="#home"
            onClick={handleHomeClick}
            className="text-sm font-semibold text-accent"
          >
            Coffee Beans
          </a>

          <nav aria-label="Primary" className="flex items-center gap-4 sm:gap-6">
            <a
              href="#my-beans"
              onClick={handleHomeClick}
              className="text-sm font-medium text-foreground transition hover:text-accent"
            >
              My Beans
            </a>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground transition hover:text-accent"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={handleGuideClick}
              className="text-sm font-medium text-foreground transition hover:text-accent"
            >
              Coffee bean guide
            </button>
          </nav>
        </header>

        {isGuideVisible ? (
          <section className="space-y-8 px-6 py-6 sm:px-8" id="coffee-bean-guide">
            <CoffeeGuideSection onAddBeanClick={handleGuideAddBeanClick} />
          </section>
        ) : (
          <>
            <section
              className="card-surface relative scroll-mt-24 overflow-hidden rounded-[2rem] px-6 py-8 sm:px-10 sm:py-10"
              id="home"
            >
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-[#d89a6e]/25 via-transparent to-[#8f5734]/15" />
              <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="order-1 space-y-6 pl-6 pt-4 sm:pt-6 lg:pl-10 lg:pt-10">
                  <div className="space-y-5">
                    <h1 className="display-font max-w-2xl text-4xl leading-tight font-semibold text-accent sm:text-5xl">
                      {messages.heroTitle}
                    </h1>
                  </div>
                  <p className="max-w-2xl text-base leading-8 text-muted">
                    {messages.heroDescription}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAddBeanModalOpen(true)}
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong sm:w-auto"
                  >
                    Add your first bean
                  </button>
                </div>
                <div className="order-3 lg:order-2 lg:pt-10">
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
              </div>
            </section>

            <section
              className="card-surface scroll-mt-24 space-y-4 rounded-[2rem] px-6 py-8 sm:px-10 sm:py-10"
              id="my-beans"
            >
              <BeanCardGrid
                beans={catalog}
                onAddBeanClick={() => setIsAddBeanModalOpen(true)}
              />
            </section>
            <footer className="card-surface flex flex-col gap-4 rounded-[1.75rem] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/case-study"
                className="text-sm font-semibold text-accent underline decoration-2 underline-offset-4"
              >
                About this project →
              </Link>

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
            </footer>
          </>
        )}
      </div>
      {isAddBeanModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(47,36,28,0.38)] px-4 py-8 sm:py-12"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-bean-modal-title"
          onClick={() => setIsAddBeanModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsAddBeanModalOpen(false)}
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white/85 text-muted transition hover:text-accent"
              aria-label="Close add bean modal"
            >
              ×
            </button>
            <div id="add-bean-modal-title">
              <BeanForm onSuccess={() => setIsAddBeanModalOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}
      <ScrollToTopButton />
    </main>
  );
}

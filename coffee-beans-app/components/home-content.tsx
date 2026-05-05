"use client";

import Image from "next/image";
import type { BeanRecord } from "@/lib/utils";
import { LanguageProvider } from "@/components/language-provider";
import { useViewState } from "@/hooks/use-view-state";
import { TopNav } from "@/components/layout/top-nav";
import { FeatureGrid } from "@/components/home/feature-grid";
import { DailyOverview } from "@/components/home/daily-overview";
import { BeansLibrarySection } from "@/components/beans/beans-library-section";
import { AddBeanModal } from "@/components/beans/add-bean-modal";
import { LoginModal } from "@/components/auth/login-modal";
import { BeanGuideView } from "@/components/bean-guide-view";
import { CafesView } from "@/components/cafes-view";
import { CoffeeCalendarSection } from "@/components/coffee-calendar-section";
import { CoffeeShopPricesPage } from "@/components/coffee-shop-prices-page";
import { RecipesView } from "@/components/recipes-view";
import { useLocalUser } from "@/hooks/use-local-user";
import { useState } from "react";

interface HomeContentProps {
  catalog: BeanRecord[];
}

export function HomeContent({ catalog }: HomeContentProps) {
  return (
    <LanguageProvider>
      <HomeContentInner catalog={catalog} />
    </LanguageProvider>
  );
}

function HomeContentInner({ catalog }: HomeContentProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, login, logout } = useLocalUser();
  const { view, isAddBeanOpen, navigateTo, openAddBean, closeAddBean } =
    useViewState();

  return (
    <main className="grain min-h-screen">
      <div className="animate-rise">
        <TopNav
          view={view}
          onNavigate={navigateTo}
          user={user}
          onLoginClick={() => setIsLoginOpen(true)}
        />

        <PageBody
          view={view}
          catalog={catalog}
          onNavigate={navigateTo}
          onAddBean={openAddBean}
        />
      </div>

      <AddBeanModal isOpen={isAddBeanOpen} onClose={closeAddBean} />
      <LoginModal
        isOpen={isLoginOpen}
        user={user}
        onClose={() => setIsLoginOpen(false)}
        onLogin={login}
        onLogout={logout}
      />
    </main>
  );
}

interface PageBodyProps {
  view: ReturnType<typeof useViewState>["view"];
  catalog: BeanRecord[];
  onNavigate: ReturnType<typeof useViewState>["navigateTo"];
  onAddBean: () => void;
}

function PageBody({ view, catalog, onNavigate, onAddBean }: PageBodyProps) {
  if (view === "guide") {
    return <BeanGuideView />;
  }

  if (view === "beans") {
    return (
      <>
        <BeansLibrarySection
          beans={catalog}
          onAddBeanClick={onAddBean}
          onGuideClick={() => onNavigate("guide")}
        />
        <CoffeeCalendarSection beans={catalog} />
      </>
    );
  }

  if (view === "cafes") {
    return <CafesView />;
  }

  if (view === "today") {
    return <DailyOverview />;
  }

  if (view === "prices") {
    return <CoffeeShopPricesPage embedded />;
  }

  if (view === "recipes") {
    return <RecipesView />;
  }

  return (
    <section className="relative h-[calc(100vh-64px)] min-h-[600px] w-full overflow-hidden bg-[#efe8dc]">
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-end">
        <Image
          src="/hero-latte-scene-latest.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>

      <div className="relative z-10 flex h-full max-w-[96vw] flex-col px-6 py-8 min-[480px]:px-8 lg:px-8 lg:py-24">
        <div>
          <h1 className="font-serif text-[48px] font-medium leading-[0.9] tracking-[-2px] text-[#2f241c] lg:text-[64px]">
            COFFEE
            <br />
            DAILY
          </h1>
          <span className="mb-6 mt-8 block h-0.5 w-12 bg-[#2f241c]" aria-hidden />
          <p className="max-w-[36ch] text-[15px] text-[#2f241c]">
            Your personal coffee companion in Paris.
          </p>

          <div className="mt-8">
            <FeatureGrid
              onBeansClick={() => onNavigate("beans")}
              onCafesClick={() => onNavigate("cafes")}
              onCommunityClick={() => onNavigate("home")}
              onToolsClick={() => onNavigate("today")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

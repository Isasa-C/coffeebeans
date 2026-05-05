"use client";

import type { BeanRecord } from "@/lib/utils";
import { LanguageProvider } from "@/components/language-provider";
import { useViewState } from "@/hooks/use-view-state";
import { TopNav } from "@/components/layout/top-nav";
import { HeroSection } from "@/components/home/hero-section";
import { DrinkShowcase } from "@/components/home/drink-showcase";
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
    <>
      <HeroSection />
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-5 py-10 sm:px-8 sm:py-14">
        <DrinkShowcase />
        <FeatureGrid
          onBeansClick={() => onNavigate("beans")}
          onCafesClick={() => onNavigate("cafes")}
          onCommunityClick={() => onNavigate("home")}
          onToolsClick={() => onNavigate("today")}
        />
      </div>
    </>
  );
}

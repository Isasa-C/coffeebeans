"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { recipes } from "./recipes";
import RecipeSelector from "./recipe-selector";
import RecipeCupVisual from "./recipe-cup-visual";
import RecipeInfoPanel from "./recipe-info-panel";
import { LoginModal } from "@/components/auth/login-modal";
import { TopNav } from "@/components/layout/top-nav";
import { useLocalUser } from "@/hooks/use-local-user";
import type { NavKey } from "@/lib/navigation";

export default function LearnPage() {
  const [selectedId, setSelectedId] = useState("iced-oat-latte");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const router = useRouter();
  const { user, login, logout } = useLocalUser();

  const selectedRecipe =
    recipes.find((recipe) => recipe.id === selectedId) ?? recipes[0];

  function navigateTo(target: NavKey) {
    const routes: Record<NavKey, string> = {
      home: "/",
      today: "/today",
      explore: "/explore",
      learn: "/learn",
    };

    router.push(routes[target]);
  }

  return (
    <>
      <TopNav
        view="learn"
        onNavigate={navigateTo}
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
      />

      <main className="bg-[#f5efe5] px-6 py-10 text-[#2b1b12] sm:px-12">
        <section className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr_360px] lg:gap-12">
            <div>
              <header>
                <h1 className="mb-8 max-w-[22ch] font-serif text-[32px] font-medium leading-[1.2] tracking-[-0.5px] text-[#2b1b12]">
                  Tap a drink to learn how to make it.
                </h1>
              </header>

              <RecipeSelector
                recipes={recipes}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>

            <RecipeCupVisual recipe={selectedRecipe} />

            <RecipeInfoPanel recipe={selectedRecipe} />
          </div>
        </section>
      </main>

      <LoginModal
        isOpen={isLoginOpen}
        user={user}
        onClose={() => setIsLoginOpen(false)}
        onLogin={login}
        onLogout={logout}
      />
    </>
  );
}

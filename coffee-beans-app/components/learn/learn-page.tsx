"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/layout/top-nav";
import { LoginModal } from "@/components/auth/login-modal";
import { useLocalUser } from "@/hooks/use-local-user";
import type { NavKey } from "@/lib/navigation";
import { recipes } from "./recipes";
import RecipeSelector from "./recipe-selector";
import RecipeCupVisual from "./recipe-cup-visual";
import RecipeInfoPanel from "./recipe-info-panel";

export default function LearnPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("iced-oat-latte");
  const router = useRouter();
  const { user, signIn, signUp, logout } = useLocalUser();

  const selectedRecipe =
    recipes.find((recipe) => recipe.id === selectedId) ?? recipes[0];

  function navigateTo(target: NavKey) {
    const routes: Record<NavKey, string> = {
      home: "/",
      today: "/today",
      explore: "/explore",
      learn: "/learn",
      tools: "/tools",
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

      <main className="min-h-screen bg-[#f7f1e8] px-8 py-10 text-[#2b1b12]">
        <section className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="font-serif text-6xl tracking-tight">Learn</h1>
            <p className="mt-2 text-[#8b7a6d]">Build your usual.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr_420px]">
            <RecipeSelector
              recipes={recipes}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />

            <RecipeCupVisual recipe={selectedRecipe} />

            <RecipeInfoPanel recipe={selectedRecipe} />
          </div>
        </section>
      </main>

      <LoginModal
        isOpen={isLoginOpen}
        user={user}
        onClose={() => setIsLoginOpen(false)}
        onSignIn={signIn}
        onSignUp={signUp}
        onLogout={logout}
      />
    </>
  );
}

"use client";

import { useState } from "react";
import type { Recipe } from "./recipes";

type Props = {
  recipe: Recipe;
};

const SAVED_RECIPES_KEY = "coffee-daily:saved-recipes";

export default function SaveRecipeButton({ recipe }: Props) {
  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const stored = window.localStorage.getItem(SAVED_RECIPES_KEY);

    if (!stored) {
      return [];
    }

    try {
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        return parsed.filter((item) => typeof item === "string");
      }
    } catch {
      window.localStorage.removeItem(SAVED_RECIPES_KEY);
    }

    return [];
  });

  const isSaved = savedRecipeIds.includes(recipe.id);

  function toggleSavedRecipe() {
    setSavedRecipeIds((current) => {
      const next = current.includes(recipe.id)
        ? current.filter((id) => id !== recipe.id)
        : [...current, recipe.id];

      window.localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <button
      type="button"
      aria-pressed={isSaved}
      onClick={toggleSavedRecipe}
      className="mt-7 inline-flex cursor-pointer items-center gap-2 border-0 border-b border-[#d4673e] bg-transparent px-0 py-3 text-sm font-medium text-[#d4673e] transition-colors duration-150 hover:text-[#b35530]"
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill={isSaved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 20 C5 16 3 12 3 8 A4 4 0 0 1 12 8 A4 4 0 0 1 21 8 C21 12 19 16 12 20 Z" />
      </svg>
      {isSaved ? "Saved recipe" : "Save recipe"}
    </button>
  );
}

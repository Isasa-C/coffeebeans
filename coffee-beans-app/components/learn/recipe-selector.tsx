import Image from "next/image";
import type { Recipe } from "./recipes";

type Props = {
  recipes: Recipe[];
  selectedId: string;
  onSelect: (id: string) => void;
};

const thumbnailMap: Record<string, string> = {
  "iced-americano": "/images/iced-americano-refresh.png",
  espresso: "/images/espresso-refresh.png",
};

export default function RecipeSelector({ recipes, selectedId, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-1 self-start">
      {recipes.map((recipe) => {
        const active = recipe.id === selectedId;

        return (
          <button
            key={recipe.id}
            type="button"
            onClick={() => onSelect(recipe.id)}
            className={`relative flex w-full items-center gap-4 rounded-[14px] border-0 bg-transparent px-4 py-3.5 text-left transition ${
              active
                ? "bg-[rgba(212,103,62,0.10)] before:absolute before:left-0 before:top-1/2 before:h-6 before:w-[3px] before:-translate-y-1/2 before:rounded-r before:bg-[#d4673e]"
                : "hover:bg-[rgba(76,44,23,0.04)]"
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center">
              <Image
                src={thumbnailMap[recipe.id] ?? `/images/${recipe.id}.png`}
                alt={recipe.name}
                width={44}
                height={44}
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <h3 className="font-serif text-[17px] font-medium leading-tight text-[#2b1b12]">
                {recipe.name}
              </h3>
              <p className="mt-0.5 text-xs text-[#9b7b62]">
                {recipe.caffeine} caffeine
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

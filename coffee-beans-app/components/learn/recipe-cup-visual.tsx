import Image from "next/image";
import type { Recipe } from "./recipes";

type Props = {
  recipe: Recipe;
};

export default function RecipeCupVisual({ recipe }: Props) {
  const imageMap: Record<string, string> = {
    "iced-oat-latte": "/images/iced-oat-latte.png",
    "iced-americano": "/images/iced-americano-refresh.png",
    "cafe-allonge": "/images/cafe-allonge.png",
    "espresso": "/images/espresso-refresh.png",
  };
  const blendImageIds = new Set(["iced-americano", "espresso"]);
  const blendClass = blendImageIds.has(recipe.id)
    ? "mix-blend-multiply brightness-[1.03] contrast-[0.98]"
    : "";
  const imageSizeClass =
    recipe.id === "iced-americano" || recipe.id === "espresso"
      ? "h-[320px] max-h-[320px]"
      : "h-[480px] max-h-[480px]";
  const positionClass =
    recipe.id === "iced-americano" || recipe.id === "espresso"
      ? "translate-y-24"
      : "";

  return (
    <div className="relative flex flex-1 flex-col items-center justify-start px-4 pt-10">
      <div className="relative flex w-full items-center justify-center">
        <Image
          src={imageMap[recipe.id]}
          alt={recipe.name}
          width={720}
          height={900}
          priority
          className={`${imageSizeClass} ${positionClass} w-auto object-contain drop-shadow-[0_40px_60px_rgba(76,44,23,0.15)] ${blendClass}`}
        />
      </div>
    </div>
  );
}

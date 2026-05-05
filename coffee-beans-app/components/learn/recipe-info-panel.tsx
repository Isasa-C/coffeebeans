import type { Recipe } from "./recipes";
import IngredientChips from "./ingredient-chips";
import RecipeSteps from "./recipe-steps";
import SaveRecipeButton from "./save-recipe-button";

type Props = {
  recipe: Recipe;
};

export default function RecipeInfoPanel({ recipe }: Props) {
  return (
    <aside className="pt-6">
      <h2 className="font-serif text-[32px] font-medium tracking-[-0.5px] text-[#2b1b12]">
        {recipe.name}
      </h2>

      <div className="my-6 border-t border-[rgba(76,44,23,0.15)]" />

      <section>
        <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9b7b62]">
          Ingredients
        </h3>
        <IngredientChips ingredients={recipe.ingredients} />
      </section>

      <div className="my-6 border-t border-[rgba(76,44,23,0.15)]" />

      <section>
        <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9b7b62]">
          How to make
        </h3>
        <RecipeSteps steps={recipe.steps} />
      </section>

      <SaveRecipeButton recipe={recipe} />
    </aside>
  );
}

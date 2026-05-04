import { PageHeader } from "@/components/cafes-view";

const recipes = [
  {
    name: "Cafe Latte",
    tagline: "Smooth, milky, and balanced. The everyday classic.",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=900&q=85",
    difficulty: "Easy",
    time: "5 min",
    roast: "Medium",
    ingredients: [["Espresso", "36 g"], ["Whole milk", "200 ml"], ["Light foam", "on top"]],
    steps: ["Pull a double shot of espresso.", "Steam milk to 60-65 C with glossy microfoam.", "Pour slowly and top with a thin foam layer."],
  },
  {
    name: "Americano",
    tagline: "Espresso lengthened with hot water. Clean and strong.",
    image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=900&q=85",
    difficulty: "Very easy",
    time: "3 min",
    roast: "Medium-dark",
    ingredients: [["Espresso", "36 g"], ["Hot water", "150-250 ml"]],
    steps: ["Heat fresh water to about 90 C.", "Pour hot water into the cup first.", "Pull espresso directly into the water."],
  },
  {
    name: "Iced Latte",
    tagline: "Cold milk and espresso over ice. Refreshing and quick.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=900&q=85",
    difficulty: "Easy",
    time: "3 min",
    roast: "Medium",
    ingredients: [["Espresso", "36 g"], ["Cold milk", "200 ml"], ["Ice", "5-6 cubes"]],
    steps: ["Fill a tall glass with ice.", "Pour cold milk over the ice.", "Add espresso slowly and stir before drinking."],
  },
  {
    name: "Flat White",
    tagline: "Stronger than a latte, less foam, denser texture.",
    image: "https://images.unsplash.com/photo-1517959105821-eaf2591984ca?w=900&q=85",
    difficulty: "Medium",
    time: "5 min",
    roast: "Medium",
    ingredients: [["Ristretto", "30 g"], ["Whole milk", "120-160 ml"], ["Thin foam", "5 mm"]],
    steps: ["Pull a shorter concentrated shot.", "Steam very fine microfoam.", "Pour in one continuous motion."],
  },
];

export function RecipesView() {
  return (
    <>
      <PageHeader eyebrow="How to make" title="Cafe recipes at home">
        Cafe-quality drinks with what you already have.
      </PageHeader>

      <section className="mx-auto grid max-w-[1200px] gap-8 px-5 pb-24 pt-8 lg:grid-cols-2 sm:px-8">
        {recipes.map((recipe) => (
          <article key={recipe.name} className="overflow-hidden rounded-2xl border border-line bg-white">
            <div
              className="h-60 bg-cover bg-center"
              style={{ backgroundImage: `url(${recipe.image})` }}
            />
            <div className="flex flex-col p-8">
              <h2 className="mb-2 font-serif text-[32px] font-normal">{recipe.name}</h2>
              <p className="mb-6 text-sm text-muted">{recipe.tagline}</p>

              <div className="mb-6 grid grid-cols-3 overflow-hidden rounded-lg border border-line text-center">
                <Meta label="Difficulty" value={recipe.difficulty} />
                <Meta label="Time" value={recipe.time} />
                <Meta label="Roast" value={recipe.roast} last />
              </div>

              <h3 className="mb-3 font-serif text-lg">Ingredients</h3>
              <ul className="mb-6">
                {recipe.ingredients.map(([name, amount]) => (
                  <li key={name} className="flex justify-between border-b border-line py-2.5 text-sm">
                    <span>{name}</span>
                    <span className="text-muted">{amount}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mb-3 font-serif text-lg">Method</h3>
              <ol className="space-y-3">
                {recipe.steps.map((step, index) => (
                  <li key={step} className="flex gap-4 border-b border-line pb-3 text-sm leading-6">
                    <span className="min-w-9 font-serif text-2xl text-[#9b7b62]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function Meta({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`p-3 ${last ? "" : "border-r border-line"}`}>
      <div className="mb-1 text-[10px] uppercase tracking-[0.15em] text-[#9b7b62]">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

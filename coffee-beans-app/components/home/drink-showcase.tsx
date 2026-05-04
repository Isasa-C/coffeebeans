import { LineIcon } from "@/components/icons/line-icon";

interface Drink {
  name: string;
  tone: string;
}

const FEATURED_DRINKS: Drink[] = [
  { name: "Iced Oat Latte", tone: "from-[#f5dfbf] to-[#b88355]" },
  { name: "Iced Americano", tone: "from-[#dbc4aa] to-[#53301e]" },
  { name: "Iced Oat Osmanthus Latte", tone: "from-[#fff0c8] to-[#c78c4f]" },
  { name: "Iced Coconut Latte", tone: "from-[#f8eadc] to-[#9a6a45]" },
];

export function DrinkShowcase() {
  return (
    <section aria-label="Featured drinks" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {FEATURED_DRINKS.map((drink) => (
        <DrinkCard key={drink.name} drink={drink} />
      ))}
    </section>
  );
}

function DrinkCard({ drink }: { drink: Drink }) {
  return (
    <article className="card-surface grid min-h-[152px] grid-cols-[1fr_96px] items-center overflow-hidden rounded-[24px] bg-card pl-5 transition hover:-translate-y-0.5">
      <div className="min-w-0 py-5">
        <h2 className="text-lg font-semibold leading-tight text-foreground">
          {drink.name}
        </h2>
        <button
          type="button"
          aria-label={`Open ${drink.name}`}
          className="mt-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-accent transition hover:border-accent/40"
        >
          <LineIcon name="arrow" />
        </button>
      </div>

      <DrinkVisual tone={drink.tone} />
    </article>
  );
}

function DrinkVisual({ tone }: { tone: string }) {
  return (
    <div className={`relative h-full min-h-[152px] bg-gradient-to-br ${tone}`} aria-hidden>
      <div className="absolute bottom-5 left-1/2 h-24 w-14 -translate-x-1/2 rounded-b-3xl rounded-t-xl border border-white/60 bg-white/40 backdrop-blur-sm">
        <span className="absolute inset-x-2 bottom-2 h-14 rounded-b-2xl rounded-t-lg bg-accent/65" />
        <span className="absolute left-2 right-2 top-3 h-5 rounded-lg bg-white/65" />
      </div>
    </div>
  );
}

import Image from "next/image";
import { LineIcon } from "@/components/icons/line-icon";

interface Drink {
  name: string;
  image: string;
}

const FEATURED_DRINKS: Drink[] = [
  { name: "Iced Oat Latte", image: "/images/iced-oat-latte.png" },
  { name: "Iced Americano", image: "/images/iced-americano.png" },
  { name: "Osmanthus Latte", image: "/images/iced-osmanthus-latte.png" },
  { name: "Coconut Latte", image: "/images/iced-coconut-latte.png" },
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
    <article className="card-surface grid min-h-[152px] grid-cols-[1fr_110px] items-center overflow-hidden rounded-[24px] bg-card pl-5 transition hover:-translate-y-0.5">
      <div className="min-w-0 py-5">
        <h2 className="min-h-[44px] text-lg font-semibold leading-tight text-foreground">
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

      <DrinkVisual image={drink.image} name={drink.name} />
    </article>
  );
}

function DrinkVisual({ image, name }: { image: string; name: string }) {
  return (
    <div className="relative h-full min-h-[152px] overflow-hidden">
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 25vw"
      />
    </div>
  );
}

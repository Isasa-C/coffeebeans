type Props = {
  ingredients: string[];
};

type IngredientKind = "coffee" | "milk" | "ice" | "water";

function parseIngredient(item: string) {
  const [amount, ...labelParts] = item.split(" ");
  const label = labelParts.join(" ") || item;
  const lowerLabel = label.toLowerCase();
  const kind: IngredientKind = lowerLabel.includes("milk")
    ? "milk"
    : lowerLabel.includes("ice")
      ? "ice"
      : lowerLabel.includes("water")
        ? "water"
        : "coffee";

  return {
    amount,
    label,
    kind,
  };
}

function IngredientIcon({ kind }: { kind: IngredientKind }) {
  if (kind === "milk") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 4 L15 4 L15 7 L17 9 L17 19 A2 2 0 0 1 15 21 L9 21 A2 2 0 0 1 7 19 L7 9 L9 7 Z" />
        <line x1="9" y1="13" x2="15" y2="13" />
      </svg>
    );
  }

  if (kind === "ice") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <line x1="12" y1="3" x2="12" y2="21" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="18" y1="6" x2="6" y2="18" />
      </svg>
    );
  }

  if (kind === "water") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 3 C9 7.8 7 11 7 15 A5 5 0 0 0 17 15 C17 11 15 7.8 12 3 Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3 C8 9 6 12 6 16 A6 6 0 0 0 18 16 C18 12 16 9 12 3 Z" />
    </svg>
  );
}

const iconStyles: Record<IngredientKind, string> = {
  coffee: "bg-[#f5e6d8] text-[#6b3d20]",
  milk: "bg-[#f0ebe2] text-[#5a4a3a]",
  ice: "bg-[#e0eaf0] text-[#4d8ba8]",
  water: "bg-[#dbeaf0] text-[#3f7f9c]",
};

export default function IngredientChips({ ingredients }: Props) {
  return (
    <ul className="list-none p-0">
      {ingredients.map((item) => {
        const ingredient = parseIngredient(item);

        return (
          <li key={item} className="flex items-center gap-3 py-1.5">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full [&>svg]:h-3.5 [&>svg]:w-3.5 ${iconStyles[ingredient.kind]}`}
            >
              <IngredientIcon kind={ingredient.kind} />
            </span>
            <span className="min-w-[72px] font-serif text-[22px] font-medium tabular-nums text-[#2b1b12]">
              {ingredient.amount}
            </span>
            <span className="text-[15px] text-[#8b7a6d]">
              {ingredient.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

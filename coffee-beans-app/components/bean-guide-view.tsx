import { PageHeader } from "@/components/cafes-view";

const roasts = [
  {
    name: "Light roast",
    color: "#F5E6C8",
    notes: "Bright acidity with floral, citrus, and berry notes. Origin character is most preserved here.",
    bestFor: "Pour-over · Cold brew · Filter coffee",
  },
  {
    name: "Medium-light",
    color: "#D4A96A",
    notes: "Gently sweet and balanced. Honey, hazelnut, and caramel notes start to emerge.",
    bestFor: "Filter coffee · Lighter americanos",
  },
  {
    name: "Medium",
    color: "#9C6B3C",
    notes: "Smooth and approachable. Nutty, caramel, and chocolate notes. The most versatile roast level.",
    bestFor: "Latte · Flat white · Americano · Oat latte",
  },
  {
    name: "Medium-dark",
    color: "#5C3D1E",
    notes: "Rich and full-bodied. Dark chocolate, roasted nuts, and warm spice notes dominate.",
    bestFor: "Espresso · Cappuccino · Mocha · Vanilla latte",
  },
  {
    name: "Dark roast",
    color: "#1E1007",
    notes: "Bold and intense. Smoky, bitter, with burnt sugar notes. Origin character is largely roasted out.",
    bestFor: "Strong americano · Bold espresso drinks",
  },
];

export function BeanGuideView() {
  return (
    <>
      <PageHeader eyebrow="Knowledge" title="Bean guide">
        Understand roast levels and what each one is best for.
      </PageHeader>

      <section className="mx-auto max-w-[1200px] px-5 pb-24 pt-8 sm:px-8">
        <div className="mb-8 flex gap-2 overflow-x-auto">
          {["Roast types", "Flavour notes", "How to taste"].map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                index === 0
                  ? "border-foreground bg-foreground text-white"
                  : "border-line bg-white text-muted hover:border-muted"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {roasts.map((roast) => (
            <article
              key={roast.name}
              className="flex min-h-[280px] flex-col rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(76,44,23,0.08)]"
            >
              <span
                className="mb-4 h-10 w-10 rounded-full border border-black/10"
                style={{ backgroundColor: roast.color }}
              />
              <h2 className="mb-3 font-serif text-xl font-normal">{roast.name}</h2>
              <p className="flex-1 text-sm leading-6 text-muted">{roast.notes}</p>
              <div className="mt-4 border-t border-line pt-4 text-[13px]">
                <strong className="font-medium text-foreground">Best for</strong>
                <br />
                <span className="text-muted">{roast.bestFor}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

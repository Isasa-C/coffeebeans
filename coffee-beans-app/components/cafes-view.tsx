const cafes = [
  {
    name: "Coutume Cafe",
    rating: "4.6",
    address: "47 rue de Babylone, 75007 · 7e arrondissement",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=900&q=85",
    tags: ["Wifi", "Quiet", "Plugs", "Specialty roast", "Filter coffee"],
    notes:
      "Bright, calm space with reliable wifi and plenty of plug sockets along the long bench by the window. House roast is excellent.",
  },
  {
    name: "Cafe Kitsune",
    rating: "4.4",
    address: "51 galerie de Montpensier, 75001 · Palais Royal",
    image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=900&q=85",
    tags: ["Wifi", "Outdoor", "Aesthetic", "Tourist heavy"],
    notes:
      "Beautiful courtyard location inside the Palais Royal. Better for short focused sessions than long study days.",
  },
  {
    name: "Belleville Brulerie",
    rating: "4.7",
    address: "14 rue Pradier, 75019 · Belleville",
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=900&q=85",
    tags: ["Wifi", "Quiet", "Spacious", "Roastery"],
    notes:
      "An actual roastery with a small cafe attached. Quiet most weekdays, with a communal table at the back.",
  },
  {
    name: "Telescope Cafe",
    rating: "4.5",
    address: "5 rue Villedo, 75001 · 1er arrondissement",
    image: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=900&q=85",
    tags: ["Wifi", "Plugs", "Tiny", "Pour-over"],
    notes:
      "Tiny but reliable. Weekday mornings are best. The pour-over is some of the best in central Paris.",
  },
  {
    name: "Hexagone Cafe",
    rating: "4.5",
    address: "121 rue du Chateau, 75014 · Montparnasse",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=900&q=85",
    tags: ["Wifi", "Quiet", "Plugs", "All day"],
    notes:
      "Underrated for studying. Bright in the afternoon, friendly to laptop dwellers, and never overcrowded.",
  },
  {
    name: "Boot Cafe",
    rating: "4.3",
    address: "19 rue du Pont aux Choux, 75003 · Marais",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&q=85",
    tags: ["Tiny", "Aesthetic", "No wifi"],
    notes:
      "Perfect for a focused offline session with one perfect coffee. Plan your work first, sit down with a book second.",
  },
];

export function CafesView() {
  return (
    <>
      <PageHeader eyebrow="Paris" title="Cafes to study at">
        Quiet, wifi-friendly spots across Paris with good coffee.
      </PageHeader>

      <section className="mx-auto grid max-w-[1200px] gap-6 px-5 pb-24 pt-8 md:grid-cols-2 sm:px-8">
        {cafes.map((cafe) => (
          <article
            key={cafe.name}
            className="overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(76,44,23,0.08)]"
          >
            <div
              className="h-[200px] bg-cover bg-center"
              style={{ backgroundImage: `url(${cafe.image})` }}
            />
            <div className="p-6">
              <div className="mb-3 flex items-start justify-between gap-4">
                <h2 className="font-serif text-[22px]">{cafe.name}</h2>
                <span className="rounded-full bg-[#f5e6d8] px-2.5 py-1 text-xs font-medium">
                  ★ {cafe.rating}
                </span>
              </div>
              <p className="mb-4 text-[13px] text-muted">{cafe.address}</p>
              <div className="mb-4 flex flex-wrap gap-1.5">
                {cafe.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      tag === "Wifi" || tag === "Quiet" || tag === "Plugs" || tag === "Spacious"
                        ? "bg-[#e3edd8] text-[#4a6a30]"
                        : "bg-[#f5efe5] text-muted"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="border-t border-line pt-4 text-sm leading-6 text-muted">
                {cafe.notes}
              </p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: string;
}) {
  return (
    <header className="mx-auto max-w-[1200px] border-b border-line px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9b7b62]">
        {eyebrow}
      </div>
      <h1 className="mb-4 font-serif text-[44px] font-normal leading-none tracking-[-0.02em] sm:text-[64px]">
        {title}
      </h1>
      <p className="max-w-[60ch] text-base text-muted">{children}</p>
    </header>
  );
}

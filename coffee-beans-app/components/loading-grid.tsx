export function LoadingGrid() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-10 w-52 animate-pulse rounded-full bg-white/70" />
        <div className="h-5 w-28 animate-pulse rounded-full bg-white/60" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="card-surface overflow-hidden rounded-[1.75rem]"
          >
            <div className="aspect-[4/3] animate-pulse bg-white/65" />
            <div className="space-y-4 p-5">
              <div className="h-8 w-2/3 animate-pulse rounded-full bg-white/70" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-20 animate-pulse rounded-2xl bg-white/60" />
                <div className="h-20 animate-pulse rounded-2xl bg-white/60" />
              </div>
              <div className="h-24 animate-pulse rounded-2xl bg-white/60" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

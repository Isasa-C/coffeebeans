import { LoadingGrid } from "@/components/loading-grid";

export default function Loading() {
  return (
    <main className="min-h-screen py-8 sm:py-12">
      <div className="page-shell space-y-8">
        <section className="card-surface rounded-[2rem] px-6 py-8 sm:px-10 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="h-8 w-40 animate-pulse rounded-full bg-white/70" />
              <div className="h-16 w-full max-w-2xl animate-pulse rounded-[1.5rem] bg-white/70" />
              <div className="h-6 w-full max-w-xl animate-pulse rounded-full bg-white/60" />
              <div className="grid gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-24 animate-pulse rounded-[1.5rem] bg-white/65"
                  />
                ))}
              </div>
            </div>
            <div className="h-[34rem] animate-pulse rounded-[1.75rem] bg-white/65" />
          </div>
        </section>
        <LoadingGrid />
      </div>
    </main>
  );
}

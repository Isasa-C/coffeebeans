"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="min-h-screen py-8 sm:py-12">
      <div className="page-shell">
        <section className="card-surface rounded-[2rem] px-6 py-10 text-center sm:px-10">
          <p className="text-sm font-semibold tracking-[0.2em] text-accent uppercase">
            Something went off-script
          </p>
          <h1 className="display-font mt-3 text-3xl font-semibold">
            We couldn&apos;t load the catalog.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">
            {error.message || "An unexpected error occurred while loading your coffee bean collection."}
          </p>
          <button
            className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong"
            onClick={reset}
            type="button"
          >
            Try again
          </button>
        </section>
      </div>
    </main>
  );
}

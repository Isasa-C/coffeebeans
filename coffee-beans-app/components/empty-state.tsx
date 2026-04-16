export function EmptyState() {
  return (
    <div className="card-surface rounded-[1.75rem] px-6 py-12 text-center sm:px-10">
      <p className="text-sm font-semibold tracking-[0.2em] text-accent uppercase">
        No beans yet
      </p>
      <h3 className="display-font mt-3 text-3xl font-semibold">
        Your first roast can go here.
      </h3>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">
        Add your coffee details to start building a polished catalog. Images are optional.
      </p>
    </div>
  );
}

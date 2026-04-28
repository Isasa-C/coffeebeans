export function EmptyState({ onAddBeanClick }: { onAddBeanClick?: () => void }) {
  return (
    <div className="card-surface rounded-[1.75rem] px-6 py-12 text-center sm:px-10">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white/65 text-xl text-accent">
        •
      </div>
      <h3 className="display-font mt-4 text-3xl font-semibold">
        No beans yet.
      </h3>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">
        Add a bean to see your cost per cup and what to brew with it.
      </p>
      <button
        type="button"
        onClick={onAddBeanClick}
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong"
      >
        Add your first bean
      </button>
    </div>
  );
}

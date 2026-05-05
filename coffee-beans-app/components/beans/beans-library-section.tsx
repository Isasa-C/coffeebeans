import { BeanCardGrid } from "@/components/bean-card-grid";
import type { BeanRecord } from "@/lib/utils";

interface BeansLibrarySectionProps {
  beans: BeanRecord[];
  onAddBeanClick: () => void;
  onGuideClick: () => void;
}

export function BeansLibrarySection({
  beans,
  onAddBeanClick,
  onGuideClick,
}: BeansLibrarySectionProps) {
  return (
    <section
      id="coffee-beans"
      className="mx-auto max-w-[1200px] scroll-mt-24 space-y-8 px-5 pb-24 pt-8 sm:px-8"
    >
      <SectionHeader onAddBeanClick={onAddBeanClick} onGuideClick={onGuideClick} />
      <BeanCardGrid beans={beans} onAddBeanClick={onAddBeanClick} />
    </section>
  );
}

function SectionHeader({
  onAddBeanClick,
  onGuideClick,
}: {
  onAddBeanClick: () => void;
  onGuideClick: () => void;
}) {
  return (
    <div className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Library
        </p>
        <h1 className="mt-3 font-serif text-[44px] font-medium leading-none tracking-[-1.5px] text-foreground sm:text-[56px]">
          My beans
        </h1>
        <span className="my-4 block h-0.5 w-10 bg-foreground" aria-hidden />
        <p className="max-w-[60ch] text-[15px] leading-7 text-muted">
          Every bean you&apos;ve bought, with what you paid, your tasting notes, and how you rated it.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onAddBeanClick}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong"
        >
          Add a bean
        </button>
        <button
          type="button"
          onClick={onGuideClick}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-card px-5 py-3 text-sm font-semibold text-accent transition hover:border-accent/40"
        >
          Bean guide
        </button>
      </div>
    </div>
  );
}

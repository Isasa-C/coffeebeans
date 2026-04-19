import type { ReactNode } from "react";

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function SectionLabel({
  index,
  title,
}: {
  index: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 text-[0.72rem] font-semibold tracking-[0.24em] text-[#9b7b62] uppercase">
      <span>{index}</span>
      <span className="h-px w-10 bg-[rgba(126,94,70,0.25)]" />
      <span>{title}</span>
    </div>
  );
}

export function CaseStudySection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "card-surface relative overflow-hidden rounded-[2rem] px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      {children}
    </section>
  );
}

export function SectionHeading({
  title,
  description,
  align = "left",
}: {
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("space-y-3", align === "center" && "mx-auto max-w-2xl text-center")}>
      <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#3f2a1d] sm:text-[2.35rem]">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-7 text-[#725c4c] sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}

export function BeanDecoration({
  className,
}: {
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "coffee-bean-shadow relative block h-6 w-4 rotate-[20deg] rounded-[999px] bg-gradient-to-br from-[#8f6548] via-[#6f4832] to-[#4a2d1f]",
        className,
      )}
    >
      <span className="absolute inset-y-[12%] left-1/2 w-px -translate-x-1/2 rounded-full bg-[rgba(255,243,231,0.75)]" />
    </span>
  );
}

export function IconBadge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(120,88,63,0.14)] bg-white/80 text-[#7d5336] shadow-[0_18px_35px_rgba(90,57,33,0.08)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

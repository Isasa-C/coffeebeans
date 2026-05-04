"use client";

import { useMemo, useState } from "react";

type TimelineEntry = {
  id: string;
  time: string;
  type: "coffee" | "water";
  name: string;
  icon: string;
  meta: string;
};

const initialEntries: TimelineEntry[] = [
  { id: "water-0830", time: "08:30", type: "water", name: "Water", icon: "💧", meta: "250 ml" },
  { id: "latte-0915", time: "09:15", type: "coffee", name: "Latte", icon: "☕", meta: "80 mg\nat home" },
  { id: "americano-1145", time: "11:45", type: "coffee", name: "Americano", icon: "⊙", meta: "120 mg\nCafe Kitsune" },
  { id: "water-1300", time: "13:00", type: "water", name: "Water", icon: "💧", meta: "500 ml" },
  { id: "oat-latte-1530", time: "15:30", type: "coffee", name: "Oat latte", icon: "◐", meta: "80 mg\nat home" },
];

export function DailyOverview() {
  const [cupCount, setCupCount] = useState(3);
  const [caffeine, setCaffeine] = useState(280);
  const [water, setWater] = useState(750);
  const [entries, setEntries] = useState(initialEntries);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  function currentTime() {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());
  }

  function logCup() {
    const nextCount = cupCount + 1;
    setCupCount(nextCount);
    setCaffeine((current) => current + 80);
    setEntries((current) => [
      ...current,
      {
        id: `latte-${Date.now()}`,
        time: currentTime(),
        type: "coffee",
        name: "Latte",
        icon: "☕",
        meta: "80 mg\nat home",
      },
    ]);
  }

  function logWater(amount: number) {
    setWater((current) => current + amount);
    setEntries((current) => [
      ...current,
      {
        id: `water-${Date.now()}`,
        time: currentTime(),
        type: "water",
        name: "Water",
        icon: "💧",
        meta: `${amount} ml`,
      },
    ]);
  }

  return (
    <>
      <section className="mx-auto max-w-[1200px] px-6 py-14 sm:px-8 sm:py-16">
        <h2 className="mb-10 font-serif text-4xl font-normal text-foreground">
          {greeting}
        </h2>

        <div className="grid gap-8 lg:grid-cols-2">
          <StatCard
            label="Coffee today"
            value={`${cupCount} ${cupCount === 1 ? "cup" : "cups"}`}
            meta={`${caffeine} mg caffeine`}
            progress={Math.min((cupCount / 4) * 100, 100)}
            footer="Daily limit · 4 cups"
            onAction={logCup}
            actionLabel="+ Log a cup"
          />

          <StatCard
            label="Water today"
            value={`${water} ml`}
            meta="Goal 2000 ml"
            progress={Math.min((water / 2000) * 100, 100)}
            footer="Daily goal · 2L"
            water
            actions={[
              { label: "+ 250 ml", onClick: () => logWater(250) },
              { label: "+ 500 ml", onClick: () => logWater(500) },
            ]}
          />
        </div>
      </section>

      <section className="mx-auto max-w-[760px] px-6 pb-16 sm:px-8">
        <h3 className="mb-8 font-serif text-3xl font-normal text-foreground">
          Today&apos;s drinks
        </h3>
        <div className="relative before:absolute before:bottom-4 before:left-20 before:top-4 before:w-px before:bg-line">
          {entries.map((entry) => (
            <TimelineEntryRow key={entry.id} entry={entry} />
          ))}
        </div>
      </section>
    </>
  );
}

function StatCard({
  label,
  value,
  meta,
  progress,
  footer,
  water = false,
  actionLabel,
  onAction,
  actions,
}: {
  label: string;
  value: string;
  meta: string;
  progress: number;
  footer: string;
  water?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  actions?: Array<{ label: string; onClick: () => void }>;
}) {
  const cardActions = actions ?? (actionLabel && onAction ? [{ label: actionLabel, onClick: onAction }] : []);

  return (
    <article className={`rounded-2xl border border-line p-8 shadow-sm ${water ? "bg-[#d4e5ee]" : "bg-white"}`}>
      <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9b7b62]">
        {label}
      </div>
      <div className="mb-2 font-serif text-[56px] font-normal leading-none">
        {value}
      </div>
      <div className="mb-6 text-sm text-muted">{meta}</div>

      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-black/5">
        <div
          className={`h-full rounded-full ${water ? "bg-[#6fa3c0]" : "bg-foreground"}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted">
        <span>0</span>
        <span>{footer}</span>
      </div>

      <div className="mt-6 flex gap-2">
        {cardActions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className="flex-1 rounded-full border border-line bg-white px-4 py-2.5 text-[13px] font-medium text-foreground transition hover:bg-[#f5efe5]"
          >
            {action.label}
          </button>
        ))}
      </div>
    </article>
  );
}

function TimelineEntryRow({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="relative mb-3 flex items-center gap-6">
      <div className="w-14 text-right text-[13px] tabular-nums text-muted">
        {entry.time}
      </div>
      <span
        className={`absolute left-[76px] z-10 h-2.5 w-2.5 rounded-full border-2 border-background ${
          entry.type === "water" ? "bg-[#6fa3c0]" : "bg-[#d4673e]"
        }`}
      />
      <div className={`ml-8 flex flex-1 items-center gap-4 rounded-xl border border-line bg-white px-4 py-3 ${entry.type === "water" ? "water-entry" : ""}`}>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${entry.type === "water" ? "bg-[#d4e5ee]" : "bg-[#f5efe5]"}`}>
          {entry.icon}
        </span>
        <span className="flex-1 font-serif text-[17px]">{entry.name}</span>
        <span className="whitespace-pre-line text-right text-xs text-muted">{entry.meta}</span>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { type BeanRecord } from "@/lib/utils";

type CoffeeCalendarSectionProps = {
  beans: BeanRecord[];
};

type CalendarDrinkType =
  | "Espresso"
  | "Latte"
  | "Americano"
  | "Cold brew"
  | "Pour-over"
  | "Other";

type CupSource = "home" | "cafe";

type CupLogEntry = {
  id: string;
  date: string;
  time: string;
  drinkType: CalendarDrinkType;
  source: CupSource;
  beanId: string | null;
  cafeName: string | null;
  price: number | null;
};

type CupLogDraft = {
  date: string;
  time: string;
  drinkType: CalendarDrinkType;
  source: CupSource;
  beanId: string;
  milkType: "Normal" | "Oat" | "None";
  cafeName: string;
  price: string;
};

const STORAGE_KEY = "coffee-calendar-cup-logs";
const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
const cafePriceDrinkTypes: CalendarDrinkType[] = ["Latte", "Americano"];

const drinkIcons: Record<CalendarDrinkType, string> = {
  Espresso: "☕",
  Latte: "◌",
  Americano: "▯",
  "Cold brew": "▥",
  "Pour-over": "▽",
  Other: "◔",
};

function padNumber(value: number) {
  return value.toString().padStart(2, "0");
}

function toDateInputValue(date: Date) {
  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`;
}

function toTimeInputValue(date: Date) {
  return `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`;
}

function createDefaultDraft(date = new Date()): CupLogDraft {
  return {
    date: toDateInputValue(date),
    time: toTimeInputValue(date),
    drinkType: "Latte",
    source: "home",
    beanId: "",
    milkType: "Normal",
    cafeName: "",
    price: "",
  };
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `cup-log-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parsePrice(value: string) {
  const normalizedValue = value.trim().replace(",", ".");

  if (!normalizedValue) {
    return null;
  }

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getCalendarDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const leadingEmptyDays = (firstDay + 6) % 7;

  return [
    ...Array.from({ length: leadingEmptyDays }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1)),
  ];
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDisplayDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function createCafePriceId(entry: CupLogEntry) {
  return [
    "calendar",
    entry.date,
    entry.time.replace(":", ""),
    entry.cafeName?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "cafe",
    entry.drinkType.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    entry.price?.toFixed(2) ?? "0",
  ].join("-");
}

function getStoredEntries() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedEntries = window.localStorage.getItem(STORAGE_KEY);

    if (!storedEntries) {
      return [];
    }

    const parsedEntries = JSON.parse(storedEntries) as CupLogEntry[];

    return Array.isArray(parsedEntries) ? parsedEntries : [];
  } catch {
    return [];
  }
}

async function createCafePriceEntry(entry: CupLogEntry) {
  if (entry.source !== "cafe" || !entry.cafeName || !entry.price) {
    return;
  }

  if (entry.drinkType !== "Latte" && entry.drinkType !== "Americano") {
    return;
  }

  await fetch("/api/coffee-shop-orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: createCafePriceId(entry),
      brand: entry.cafeName,
      drinkType: entry.drinkType,
      temperature: "Hot",
      milkType: entry.drinkType === "Americano" ? "None" : "Normal",
      size: "Standard",
      finalPrice: entry.price,
      oatMilkExtra: 0,
      date: entry.date,
      notes: "Logged from Coffee Calendar",
    }),
  });
}

export function CoffeeCalendarSection({ beans }: CoffeeCalendarSectionProps) {
  const [monthDate, setMonthDate] = useState(() => getMonthStart(new Date(2026, 3, 1)));
  const [entries, setEntries] = useState<CupLogEntry[]>(() => getStoredEntries());
  const [draft, setDraft] = useState<CupLogDraft>(() => createDefaultDraft());
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const todayValue = toDateInputValue(new Date());
  const calendarDays = useMemo(() => getCalendarDays(monthDate), [monthDate]);
  const entriesByDate = useMemo(() => {
    return entries.reduce<Record<string, CupLogEntry[]>>((collection, entry) => {
      collection[entry.date] = [...(collection[entry.date] ?? []), entry].sort((left, right) =>
        left.time.localeCompare(right.time),
      );

      return collection;
    }, {});
  }, [entries]);
  const monthEntries = entries.filter((entry) => {
    const [year, month] = entry.date.split("-").map(Number);

    return year === monthDate.getFullYear() && month === monthDate.getMonth() + 1;
  });
  const cafeEntries = monthEntries.filter((entry) => entry.source === "cafe");
  const cafeSpend = cafeEntries.reduce((sum, entry) => sum + (entry.price ?? 0), 0);
  const selectedEntries = selectedDate ? (entriesByDate[selectedDate] ?? []) : [];

  function openLogModal(date = todayValue) {
    const [year, month, day] = date.split("-").map(Number);
    const now = new Date();

    setDraft(createDefaultDraft(new Date(year, month - 1, day, now.getHours(), now.getMinutes())));
    setFormMessage(null);
    setIsLogModalOpen(true);
  }

  function handleMonthChange(offset: number) {
    setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
    setSelectedDate(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const price = parsePrice(draft.price);
    const nextEntry: CupLogEntry = {
      id: createId(),
      date: draft.date,
      time: draft.time,
      drinkType: draft.drinkType,
      source: draft.source,
      beanId: draft.source === "home" ? draft.beanId || null : null,
      cafeName: draft.source === "cafe" ? draft.cafeName.trim() || null : null,
      price: draft.source === "cafe" ? price : null,
    };

    if (!nextEntry.date || !nextEntry.time) {
      setFormMessage("Add a date and time.");
      return;
    }

    if (nextEntry.source === "cafe" && !nextEntry.cafeName) {
      setFormMessage("Add a cafe name.");
      return;
    }

    setEntries((current) => [...current, nextEntry]);
    setSelectedDate(nextEntry.date);
    setMonthDate(getMonthStart(new Date(`${nextEntry.date}T12:00:00`)));
    setIsLogModalOpen(false);

    try {
      await createCafePriceEntry(nextEntry);
    } catch {
      setFormMessage("Cup saved. Cafe price sync failed.");
    }
  }

  return (
    <section
      className="border-y bg-[#f5efe5] py-10"
      style={{ borderColor: "var(--color-border-tertiary, var(--line))", borderWidth: "0.5px 0" }}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => handleMonthChange(-1)}
            className="text-xl font-semibold text-muted transition hover:text-accent"
            aria-label="Previous month"
          >
            ‹
          </button>
          <h2
            className="text-center text-2xl leading-8 font-normal text-[#3b2416]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            {formatMonthLabel(monthDate)}
          </h2>
          <button
            type="button"
            onClick={() => handleMonthChange(1)}
            className="text-xl font-semibold text-muted transition hover:text-accent"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
        <button
          type="button"
          onClick={() => openLogModal()}
          className="rounded-full border border-line px-4 py-2 text-[13px] font-semibold text-accent transition hover:bg-white/60"
        >
          + Log a cup
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
        {dayLabels.map((label, index) => (
          <div key={`${label}-${index}`} className="pb-3">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="min-h-[44px] sm:min-h-[52px]" />;
          }

          const dateValue = toDateInputValue(day);
          const dayEntries = entriesByDate[dateValue] ?? [];
          const firstEntry = dayEntries[0];
          const isToday = dateValue === todayValue;

          return (
            <button
              key={dateValue}
              type="button"
              onClick={() => {
                if (dayEntries.length > 0) {
                  setSelectedDate((current) => (current === dateValue ? null : dateValue));
                } else {
                  openLogModal(dateValue);
                }
              }}
              className={`relative min-h-[44px] px-1 py-1 text-left transition sm:min-h-[52px] ${
                isToday ? "border-[1.5px] border-accent bg-[#f0e6da]" : ""
              }`}
            >
              <span
                className={`absolute top-1.5 left-1.5 text-[11px] ${
                  isToday ? "font-semibold text-[#3b2416]" : "text-muted"
                }`}
              >
                {day.getDate()}
              </span>
              {firstEntry ? (
                <span className="flex h-full items-center justify-center text-xl leading-none text-[#3b2416]">
                  {drinkIcons[firstEntry.drinkType]}
                </span>
              ) : null}
              {dayEntries.length > 1 ? (
                <span className="absolute top-1.5 right-1.5 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                  +{dayEntries.length - 1}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {selectedDate && selectedEntries.length > 0 ? (
        <div className="mt-5 border-t border-line pt-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-[#3b2416]">
              {formatDisplayDate(selectedDate)}
            </h3>
            <button
              type="button"
              onClick={() => openLogModal(selectedDate)}
              className="rounded-full border border-line px-3 py-1 text-sm font-semibold text-accent transition hover:bg-white/60"
            >
              +
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {selectedEntries.map((entry) => {
              const bean = beans.find((item) => item.id === entry.beanId);

              return (
                <div key={entry.id}>
                  <p className="text-[13px] font-semibold text-foreground">
                    {entry.drinkType} · {entry.source === "home" ? "Home" : "Cafe"} · {entry.time}
                  </p>
                  <p className="mt-1 text-[13px] text-muted">
                    {entry.source === "home"
                      ? `Used: ${bean?.brand ?? "Bean not selected"}`
                      : `${entry.price ? `€${entry.price.toFixed(2)} ` : ""}at ${entry.cafeName}`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {monthEntries.length === 0 && cafeEntries.length === 0 && cafeSpend === 0 ? (
        <p className="mt-8 text-center text-sm text-muted">
          Log your first cup to see your monthly summary.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-3 text-center">
          <div>
            <p className="text-[28px] leading-none font-semibold text-[#3b2416]">{monthEntries.length}</p>
            <p className="mt-2 text-xs text-muted">cups consumed</p>
          </div>
          <div>
            <p className="text-[28px] leading-none font-semibold text-[#3b2416]">{cafeEntries.length}</p>
            <p className="mt-2 text-xs text-muted">cafe visits</p>
          </div>
          <div>
            <p className="text-[28px] leading-none font-semibold text-[#3b2416]">
              €{cafeSpend.toFixed(2)}
            </p>
            <p className="mt-2 text-xs text-muted">spent at cafes</p>
          </div>
        </div>
      )}

      {isLogModalOpen ? (
        <div
          className="fixed top-0 left-0 z-[100] flex h-screen w-screen items-end justify-center bg-[rgba(0,0,0,0.4)] px-4 py-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsLogModalOpen(false)}
        >
          <form
            className="w-full max-w-[480px] rounded-[1.75rem] border border-line bg-[#fffaf3] px-5 pt-5 pb-6 shadow-[0_24px_80px_rgba(76,44,23,0.16)]"
            onSubmit={handleSubmit}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-[#3b2416]">Log a cup</h3>
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="text-xl text-muted transition hover:text-accent"
                aria-label="Close log cup modal"
              >
                ×
              </button>
            </div>

            <div className="grid gap-x-4 sm:grid-cols-2">
              <label className="mb-5 block text-sm font-semibold text-foreground">
                <span className="mb-1.5 block">Drink type</span>
                <select
                  className="field"
                  value={draft.drinkType}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      drinkType: event.target.value as CalendarDrinkType,
                    }))
                  }
                >
                  {cafePriceDrinkTypes.map((drinkType) => (
                    <option key={drinkType} value={drinkType}>
                      {drinkType}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mb-5">
                <p className="mb-1.5 text-sm font-semibold text-foreground">Source</p>
                <div className="grid grid-cols-2 rounded-full border border-line p-1">
                  {(["home", "cafe"] as CupSource[]).map((source) => (
                    <button
                      key={source}
                      type="button"
                      onClick={() => setDraft((current) => ({ ...current, source }))}
                      className={`rounded-full px-3 py-2 text-sm font-semibold capitalize transition ${
                        draft.source === source ? "bg-[#e8d5c4] text-[#3b2416]" : "text-muted"
                      }`}
                    >
                      {source}
                    </button>
                  ))}
                </div>
              </div>

              {draft.source === "home" ? (
                <>
                  <label className="mb-5 block text-sm font-semibold text-foreground">
                    <span className="mb-1.5 block">Which bean?</span>
                    <select
                      className="field"
                      value={draft.beanId}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, beanId: event.target.value }))
                      }
                    >
                      <option value="">Select a bean</option>
                      {beans.map((bean) => (
                        <option key={bean.id} value={bean.id}>
                          {bean.brand}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="mb-5 block text-sm font-semibold text-foreground">
                    <span className="mb-1.5 block">Milk type</span>
                    <select
                      className="field"
                      value={draft.milkType}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          milkType: event.target.value as CupLogDraft["milkType"],
                        }))
                      }
                    >
                      <option value="Normal">Normal</option>
                      <option value="Oat">Oat</option>
                      <option value="None">None</option>
                    </select>
                  </label>
                </>
              ) : (
                <>
                  <label className="mb-5 block text-sm font-semibold text-foreground">
                    <span className="mb-1.5 block">Cafe name</span>
                    <input
                      className="field"
                      value={draft.cafeName}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, cafeName: event.target.value }))
                      }
                    />
                  </label>
                  <label className="mb-5 block text-sm font-semibold text-foreground">
                    <span className="mb-1.5 block">Price</span>
                    <input
                      className="field"
                      type="number"
                      min="0"
                      step="0.01"
                      value={draft.price}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, price: event.target.value }))
                      }
                    />
                  </label>
                </>
              )}

              <label className="mb-5 block text-sm font-semibold text-foreground">
                <span className="mb-1.5 block">Date</span>
                <span className="relative block">
                  <input
                    className="calendar-modal-input w-full pr-10"
                    type="date"
                    value={draft.date}
                    onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))}
                  />
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <rect width="18" height="18" x="3" y="4" rx="3" />
                    <path d="M3 10h18" />
                  </svg>
                </span>
              </label>
              <label className="mb-5 block text-sm font-semibold text-foreground">
                <span className="mb-1.5 block">Time</span>
                <span className="relative block">
                  <input
                    className="calendar-modal-input w-full pr-10"
                    type="time"
                    value={draft.time}
                    onChange={(event) => setDraft((current) => ({ ...current, time: event.target.value }))}
                  />
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </span>
              </label>
            </div>

            {formMessage ? <p className="mt-4 text-sm text-red-700">{formMessage}</p> : null}

            <button
              type="submit"
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-accent px-6 text-[15px] font-medium text-white transition hover:bg-accent-strong"
            >
              Save
            </button>
            <style jsx>{`
              .calendar-modal-input {
                height: 3.05rem;
                border: 0.5px solid var(--color-border-tertiary, var(--line));
                border-radius: var(--border-radius-md, 1rem);
                background: var(--color-background-primary, #fff);
                padding-left: 1rem;
                color: var(--foreground);
                outline: none;
                font: inherit;
                appearance: none;
              }

              .calendar-modal-input::-webkit-calendar-picker-indicator {
                opacity: 0;
              }

              .calendar-modal-input::-webkit-date-and-time-value {
                text-align: left;
              }
            `}</style>
          </form>
        </div>
      ) : null}
    </section>
  );
}

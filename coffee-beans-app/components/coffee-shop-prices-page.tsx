"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AddCoffeeShopOrderForm } from "@/components/add-coffee-shop-order-form";
import { useLanguage } from "@/components/language-provider";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";
import {
  coffeeShopPriceData,
  type CoffeeShopPriceEntry,
} from "@/lib/coffee-shop-prices";

type DrinkType = CoffeeShopPriceEntry["drinkType"];
type Temperature = CoffeeShopPriceEntry["temperature"];
type MilkType = CoffeeShopPriceEntry["milkType"];
type Size = CoffeeShopPriceEntry["size"];
type ActiveView = "add-order" | "price-trend" | "brand-comparison" | "order-history";
const ALL_BRANDS = "__all__";
const DEFAULT_DATE_FROM = "2026-04-17";
const COFFEE_PRICE_STORAGE_KEY = "coffee-shop-orders";
const LEGACY_COFFEE_PRICE_STORAGE_KEY = "coffee-shop-price-entries";

function mergeCoffeeShopEntries(...collections: CoffeeShopPriceEntry[][]) {
  const dedupedEntries = new Map<string, CoffeeShopPriceEntry>();

  for (const collection of collections) {
    for (const entry of collection) {
      if (!dedupedEntries.has(entry.id)) {
        dedupedEntries.set(entry.id, entry);
      }
    }
  }

  return Array.from(dedupedEntries.values()).sort((left, right) => {
    const dateCompare = right.date.localeCompare(left.date);

    if (dateCompare !== 0) {
      return dateCompare;
    }

    return right.id.localeCompare(left.id);
  });
}

async function fetchCoffeeShopOrders() {
  const response = await fetch("/api/coffee-shop-orders", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch coffee shop orders.");
  }

  const payload = (await response.json()) as { data?: unknown };

  if (!Array.isArray(payload.data) || !payload.data.every(isCoffeeShopPriceEntry)) {
    throw new Error("Invalid coffee shop order payload.");
  }

  return payload.data;
}

async function saveCoffeeShopOrder(entry: CoffeeShopPriceEntry) {
  const response = await fetch("/api/coffee-shop-orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entry),
  });

  if (!response.ok) {
    throw new Error("Failed to save coffee shop order.");
  }

  const payload = (await response.json()) as { data?: unknown };

  if (!payload.data || !isCoffeeShopPriceEntry(payload.data)) {
    throw new Error("Invalid saved coffee shop order payload.");
  }

  return payload.data;
}

async function deleteCoffeeShopOrder(id: string) {
  const response = await fetch(`/api/coffee-shop-orders/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete coffee shop order.");
  }
}

function isCoffeeShopPriceEntry(value: unknown): value is CoffeeShopPriceEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Record<string, unknown>;

  return (
    typeof entry.id === "string" &&
    typeof entry.brand === "string" &&
    (entry.drinkType === "Latte" || entry.drinkType === "Americano") &&
    (entry.temperature === "Hot" || entry.temperature === "Iced") &&
    (entry.milkType === "Normal" || entry.milkType === "Oat" || entry.milkType === "None") &&
    (entry.size === "Small" || entry.size === "Standard" || entry.size === "Large") &&
    typeof entry.finalPrice === "number" &&
    typeof entry.oatMilkExtra === "number" &&
    typeof entry.date === "string" &&
    (typeof entry.notes === "string" || typeof entry.notes === "undefined")
  );
}

function getStoredCoffeeShopPriceEntries() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue =
      window.localStorage.getItem(COFFEE_PRICE_STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_COFFEE_PRICE_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as unknown;

    if (!Array.isArray(parsedValue) || !parsedValue.every(isCoffeeShopPriceEntry)) {
      return null;
    }

    return parsedValue;
  } catch {
    return null;
  }
}

function formatTooltipCurrency(
  value: number | string | readonly (number | string)[] | undefined,
  label: string,
  locale: string,
) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const numericValue =
    typeof rawValue === "number"
      ? rawValue
      : typeof rawValue === "string"
        ? Number(rawValue)
        : NaN;

  return [
    Number.isFinite(numericValue)
      ? new Intl.NumberFormat(locale, {
          style: "currency",
          currency: "EUR",
          minimumFractionDigits: 2,
        }).format(numericValue)
      : "—",
    label,
  ] as const;
}

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(date: string, locale: string) {
  return new Date(date).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CoffeeShopPricesPage() {
  const { language, setLanguage, messages, languageOptions } = useLanguage();
  const copy = messages.coffeePrices;
  const defaultDateTo = getTodayDateString();
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(messages.locale, {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(value);
  const labelByDrinkType: Record<DrinkType, string> = {
    Latte: copy.latte,
    Americano: copy.americano,
  };
  const labelByTemperature: Record<Temperature, string> = {
    Hot: copy.hot,
    Iced: copy.iced,
  };
  const labelByMilkType: Record<MilkType, string> = {
    Normal: copy.normal,
    Oat: copy.oat,
    None: copy.none,
  };
  const labelBySize: Record<Size, string> = {
    Small: copy.small,
    Standard: copy.standard,
    Large: copy.large,
  };
  const heroLinks = [
    { key: "add-order" as const, title: copy.tabAddCoffee },
    { key: "price-trend" as const, title: copy.tabPriceTrend },
    { key: "brand-comparison" as const, title: copy.brandComparisonTitle },
    { key: "order-history" as const, title: copy.tabOrderHistory },
  ] as const;

  const [entries, setEntries] = useState<CoffeeShopPriceEntry[]>(coffeeShopPriceData);
  const [hasLoadedStoredEntries, setHasLoadedStoredEntries] = useState(false);
  const brands = useMemo(
    () =>
      Array.from(new Set(entries.map((entry) => entry.brand))).sort((left, right) =>
        left.localeCompare(right),
      ),
    [entries],
  );
  const [selectedBrand, setSelectedBrand] = useState<string>(
    coffeeShopPriceData[0]?.brand ?? ALL_BRANDS,
  );
  const [drinkType, setDrinkType] = useState<DrinkType>("Latte");
  const [temperature, setTemperature] = useState<Temperature>("Iced");
  const [milkType, setMilkType] = useState<MilkType>("Oat");
  const [size, setSize] = useState<Size>("Standard");
  const [dateFrom, setDateFrom] = useState(DEFAULT_DATE_FROM);
  const [dateTo, setDateTo] = useState(defaultDateTo);
  const [activeView, setActiveView] = useState<ActiveView>("add-order");
  const activeBrand =
    selectedBrand === ALL_BRANDS || brands.includes(selectedBrand)
      ? selectedBrand
      : (brands[0] ?? ALL_BRANDS);

  // Price trend filters (multiple brands and drink types)
  const [trendBrands, setTrendBrands] = useState<string[]>([]);
  const [trendDrinkTypes, setTrendDrinkTypes] = useState<DrinkType[]>(["Latte"]);
  const [trendDateFrom, setTrendDateFrom] = useState(DEFAULT_DATE_FROM);
  const [trendDateTo, setTrendDateTo] = useState(defaultDateTo);

  // Brand comparison filters
  const [comparisonDrinkType, setComparisonDrinkType] = useState<DrinkType>("Latte");
  const [comparisonBrands, setComparisonBrands] = useState<string[]>([]);
  const [comparisonDateFrom, setComparisonDateFrom] = useState("2025-01-01");
  const [comparisonDateTo, setComparisonDateTo] = useState("2025-12-31");

  const normalizedMilkType: MilkType = drinkType === "Americano" ? "None" : milkType;

  const trendFilteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesBrand = trendBrands.length === 0 || trendBrands.includes(entry.brand);
      const matchesDrinkType = trendDrinkTypes.length === 0 || trendDrinkTypes.includes(entry.drinkType);
      const matchesFrom = !trendDateFrom || entry.date >= trendDateFrom;
      const matchesTo = !trendDateTo || entry.date <= trendDateTo;

      return matchesBrand && matchesDrinkType && matchesFrom && matchesTo;
    });
  }, [entries, trendBrands, trendDrinkTypes, trendDateFrom, trendDateTo]);

  const trendBrandsWithData = useMemo(
    () => Array.from(new Set(trendFilteredEntries.map((entry) => entry.brand))),
    [trendFilteredEntries],
  );

  const trendData = useMemo(() => {
    if (trendBrandsWithData.length === 0) return [];

    const dates = Array.from(new Set(trendFilteredEntries.map((entry) => entry.date))).sort();

    return dates.map((date) => {
      const obj: Record<string, string | number | null> = { date: formatDate(date, messages.locale) };
      for (const brand of trendBrandsWithData) {
        const entry = trendFilteredEntries.find(
          (e) => e.date === date && e.brand === brand,
        );
        obj[brand] = entry ? entry.finalPrice : null;
      }
      return obj;
    });
  }, [trendFilteredEntries, trendBrandsWithData, messages.locale]);

  // Calculate summary stats for trend (only when single brand is selected)
  const firstPrice = trendBrandsWithData.length === 1 ? trendFilteredEntries.filter(e => e.brand === trendBrandsWithData[0]).sort((a, b) => a.date.localeCompare(b.date))[0]?.finalPrice ?? null : null;
  const latestPrice = trendBrandsWithData.length === 1 ? trendFilteredEntries.filter(e => e.brand === trendBrandsWithData[0]).sort((a, b) => a.date.localeCompare(b.date)).at(-1)?.finalPrice ?? null : null;
  const changeAmount =
    firstPrice !== null && latestPrice !== null ? latestPrice - firstPrice : null;

  // Brand comparison data with separate filters
  const comparisonFilteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesDrinkType = entry.drinkType === comparisonDrinkType;
      const matchesBrand = comparisonBrands.length === 0 || comparisonBrands.includes(entry.brand);
      const matchesFrom = !comparisonDateFrom || entry.date >= comparisonDateFrom;
      const matchesTo = !comparisonDateTo || entry.date <= comparisonDateTo;

      return matchesDrinkType && matchesBrand && matchesFrom && matchesTo;
    });
  }, [entries, comparisonDrinkType, comparisonBrands, comparisonDateFrom, comparisonDateTo]);

  const comparisonBrandsWithData = useMemo(
    () => Array.from(new Set(comparisonFilteredEntries.map((entry) => entry.brand))),
    [comparisonFilteredEntries],
  );

  const comparisonData = useMemo(() => {
    if (comparisonBrandsWithData.length < 2) return [];

    const dates = Array.from(new Set(comparisonFilteredEntries.map((entry) => entry.date))).sort();

    return dates.map((date) => {
      const obj: Record<string, string | number | null> = { date: formatDate(date, messages.locale) };
      for (const brand of comparisonBrandsWithData) {
        const entry = comparisonFilteredEntries.find(
          (e) => e.date === date && e.brand === brand,
        );
        obj[brand] = entry ? entry.finalPrice : null;
      }
      return obj;
    });
  }, [comparisonFilteredEntries, comparisonBrandsWithData, messages.locale]);

  const orderHistoryEntries = [...entries].sort((left, right) => right.date.localeCompare(left.date));

  // Trend section labels and counts
  const trendTotalMatchingEntries = trendFilteredEntries.length;
  const trendSelectedLabel = trendBrands.length === 0 && trendDrinkTypes.length === 0
    ? "All data"
    : trendBrands.length === 0
      ? `${trendDrinkTypes.join(", ")} — All brands`
      : trendDrinkTypes.length === 0
        ? `${trendBrands.join(", ")} — All drink types`
        : `${trendDrinkTypes.join(", ")} — ${trendBrands.join(", ")}`;

  useEffect(() => {
    let isCancelled = false;

    async function loadEntries() {
      const storedEntries = getStoredCoffeeShopPriceEntries() ?? [];

      try {
        if (storedEntries.length > 0) {
          await Promise.allSettled(storedEntries.map((entry) => saveCoffeeShopOrder(entry)));
        }

        const serverEntries = await fetchCoffeeShopOrders();

        if (!isCancelled) {
          setEntries(mergeCoffeeShopEntries(serverEntries, coffeeShopPriceData));
        }
      } catch (error) {
        console.error("Failed to sync coffee shop orders", error);

        if (!isCancelled) {
          setEntries(mergeCoffeeShopEntries(storedEntries, coffeeShopPriceData));
        }
      } finally {
        if (!isCancelled) {
          setHasLoadedStoredEntries(true);
        }
      }
    }

    void loadEntries();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredEntries || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(COFFEE_PRICE_STORAGE_KEY, JSON.stringify(entries));
    window.localStorage.removeItem(LEGACY_COFFEE_PRICE_STORAGE_KEY);
  }, [entries, hasLoadedStoredEntries]);

  async function handleAddOrder(entry: CoffeeShopPriceEntry) {
    const savedEntry = await saveCoffeeShopOrder(entry);

    setEntries((current) => mergeCoffeeShopEntries([savedEntry], current));
    setSelectedBrand(entry.brand);
    setDrinkType(entry.drinkType);
    setTemperature(entry.temperature);
    setMilkType(entry.drinkType === "Americano" ? "None" : entry.milkType);
    setSize(entry.size);
    setDateFrom(DEFAULT_DATE_FROM);
    setDateTo(getTodayDateString());
  }

  async function handleDeleteOrder(id: string) {
    if (!window.confirm(copy.deleteOrderConfirm)) {
      return;
    }

    const previousEntries = entries;
    setEntries((current) => current.filter((entry) => entry.id !== id));

    try {
      await deleteCoffeeShopOrder(id);
    } catch (error) {
      console.error("Failed to delete coffee shop order", error);
      setEntries(previousEntries);
    }
  }

  return (
    <main className="grain min-h-screen py-8 sm:py-12">
      <div className="page-shell space-y-7 sm:space-y-8">
        <div className="card-surface relative overflow-hidden rounded-[2.1rem] px-6 py-6 sm:px-8 sm:py-7">
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-[#d89a6e]/18 via-transparent to-[#8f5734]/10" />
          <div className="relative flex flex-col gap-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <Link
                  href="/"
                  className="inline-flex rounded-full border border-line bg-white/72 px-4 py-2.5 text-sm font-semibold text-foreground transition duration-200 hover:border-[rgba(138,75,42,0.16)] hover:bg-white hover:text-accent"
                >
                  {copy.backToCoffeeBean}
                </Link>
                <div className="space-y-3">
                  <h1 className="display-font text-4xl font-semibold text-accent sm:text-5xl">
                    {copy.title}
                  </h1>
                  <p className="max-w-3xl text-base leading-8 text-muted">
                    {copy.subtitle}
                  </p>
                </div>

                <div className="grid gap-3 pt-1 grid-cols-2 md:grid-cols-4">
                  {heroLinks.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setActiveView(item.key)}
                      aria-pressed={activeView === item.key}
                      className={`rounded-[1.25rem] border px-4 py-3 text-left transition duration-200 ${
                        activeView === item.key
                          ? "border-[rgba(138,75,42,0.16)] bg-[rgba(138,75,42,0.12)] shadow-[0_12px_24px_rgba(138,75,42,0.08)]"
                          : "border-[rgba(97,68,44,0.08)] bg-[rgba(255,252,248,0.82)] hover:border-[rgba(138,75,42,0.16)] hover:bg-white"
                      }`}
                    >
                      <p
                        className={`text-base font-semibold ${
                          activeView === item.key ? "text-accent" : "text-foreground"
                        }`}
                      >
                        {item.title}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <div className="rounded-full border border-line bg-card/85 px-3 py-2">
                  <label className="mr-2 text-sm font-semibold text-foreground" htmlFor="coffeePricesLanguageSwitcher">
                    {messages.languageLabel}
                  </label>
                  <select
                    id="coffeePricesLanguageSwitcher"
                    className="rounded-full bg-transparent text-sm font-semibold text-accent outline-none"
                    value={language}
                    onChange={(event) => setLanguage(event.target.value as typeof language)}
                  >
                    {languageOptions.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="min-h-[520px]">
          {activeView === "add-order" ? (
            <div className="animate-rise">
              <AddCoffeeShopOrderForm onAddOrder={handleAddOrder} />
            </div>
          ) : null}

          {activeView === "price-trend" ? (
            <section className="animate-rise card-surface rounded-[2rem] p-5 sm:p-6 lg:p-7">
              <div className="space-y-2">
                <h2 className="display-font text-3xl font-semibold text-foreground">
                  {copy.trendTitle}
                </h2>
              </div>

              <div className="mt-6 rounded-[1.8rem] border border-[rgba(97,68,44,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,249,242,0.94)_100%)] p-4 sm:p-5 lg:p-6">
                <div className="space-y-6">
                  <div className="rounded-[1.55rem] border border-[rgba(97,68,44,0.1)] bg-[rgba(255,252,248,0.76)] p-3 sm:p-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground" htmlFor="trendBrands">
                          {copy.brand}
                        </label>
                        <select
                          id="trendBrands"
                          className="w-full rounded-[0.75rem] border border-[rgba(97,68,44,0.16)] bg-white px-3 py-2 text-sm"
                          multiple
                          value={trendBrands}
                          onChange={(e) => {
                            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                            setTrendBrands(selectedOptions);
                          }}
                        >
                          {brands.map((brand) => (
                            <option key={brand} value={brand}>
                              {brand}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-muted">Hold Ctrl/Cmd to select multiple</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground" htmlFor="trendDrinkTypes">
                          {copy.drinkType}
                        </label>
                        <select
                          id="trendDrinkTypes"
                          className="w-full rounded-[0.75rem] border border-[rgba(97,68,44,0.16)] bg-white px-3 py-2 text-sm"
                          multiple
                          value={trendDrinkTypes}
                          onChange={(e) => {
                            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                            setTrendDrinkTypes(selectedOptions as DrinkType[]);
                          }}
                        >
                          {labelByDrinkType.Latte && (
                            <option value="Latte">{labelByDrinkType.Latte}</option>
                          )}
                          {labelByDrinkType.Americano && (
                            <option value="Americano">{labelByDrinkType.Americano}</option>
                          )}
                        </select>
                        <p className="text-xs text-muted">Hold Ctrl/Cmd to select multiple</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground" htmlFor="trendDateFrom">
                          {copy.from}
                        </label>
                        <input
                          id="trendDateFrom"
                          type="date"
                          className="w-full rounded-[0.75rem] border border-[rgba(97,68,44,0.16)] bg-white px-3 py-2 text-sm"
                          value={trendDateFrom}
                          onChange={(e) => setTrendDateFrom(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground" htmlFor="trendDateTo">
                          {copy.to}
                        </label>
                        <input
                          id="trendDateTo"
                          type="date"
                          className="w-full rounded-[0.75rem] border border-[rgba(97,68,44,0.16)] bg-white px-3 py-2 text-sm"
                          value={trendDateTo}
                          onChange={(e) => setTrendDateTo(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-3">
                      <button
                        type="button"
                        className="rounded-full border border-[rgba(138,75,42,0.16)] bg-[rgba(138,75,42,0.12)] px-4 py-2 text-sm font-semibold text-accent transition hover:border-[rgba(138,75,42,0.24)] hover:bg-[rgba(138,75,42,0.16)]"
                      >
                        {copy.search}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTrendBrands([]);
                          setTrendDrinkTypes(["Latte"]);
                          setTrendDateFrom(DEFAULT_DATE_FROM);
                          setTrendDateTo(defaultDateTo);
                        }}
                        className="rounded-full border border-[rgba(97,68,44,0.16)] bg-white px-4 py-2 text-sm font-semibold text-accent transition hover:border-[rgba(138,75,42,0.24)] hover:bg-[rgba(138,75,42,0.04)]"
                      >
                        {copy.reset}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <SummaryStatCard
                      label={copy.selectedCoffee}
                      value={trendSelectedLabel}
                    />
                    <SummaryStatCard label={copy.matches} value={`${trendTotalMatchingEntries}`} />
                    <SummaryStatCard
                      label={copy.period}
                      value={
                        trendDateTo
                          ? `${formatDate(trendDateFrom, messages.locale)} - ${formatDate(trendDateTo, messages.locale)}`
                          : formatDate(trendDateFrom, messages.locale)
                      }
                    />
                    <SummaryStatCard label={copy.firstPrice} value={firstPrice !== null ? formatCurrency(firstPrice) : "—"} />
                    <SummaryStatCard label={copy.latestPrice} value={latestPrice !== null ? formatCurrency(latestPrice) : "—"} />
                    <SummaryStatCard
                      label={copy.change}
                      value={changeAmount !== null ? `${changeAmount >= 0 ? "+" : ""}${formatCurrency(changeAmount)}` : "—"}
                      tone={
                        changeAmount === null
                          ? "neutral"
                          : changeAmount > 0
                            ? "up"
                            : changeAmount < 0
                              ? "down"
                              : "neutral"
                      }
                    />
                  </div>

                  <div className="rounded-[1.55rem] border border-[rgba(97,68,44,0.1)] bg-[rgba(255,252,248,0.76)] p-3 sm:p-4">
                    {trendData.length < 2 || trendBrandsWithData.length === 0 ? (
                      <EmptyBlock
                        title={copy.notEnoughData}
                        description={copy.notEnoughDataDescription}
                      />
                    ) : (
                      <div className="h-[320px] rounded-[1.45rem] border border-[rgba(97,68,44,0.08)] bg-[rgba(255,255,255,0.82)] p-4 sm:h-[360px] sm:p-5">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trendData} margin={{ top: 14, right: 12, left: -18, bottom: 6 }}>
                            <CartesianGrid stroke="rgba(97,68,44,0.07)" vertical={false} />
                            <XAxis
                              dataKey="date"
                              tick={{ fill: "#7b6555", fontSize: 12 }}
                              axisLine={false}
                              tickLine={false}
                              dy={8}
                            />
                            <YAxis
                              tick={{ fill: "#7b6555", fontSize: 12 }}
                              axisLine={false}
                              tickLine={false}
                              tickFormatter={(value) => `€${value.toFixed(1)}`}
                              width={46}
                            />
                            <Tooltip
                              cursor={{ stroke: "rgba(138,75,42,0.16)", strokeWidth: 1 }}
                              contentStyle={{
                                borderRadius: "18px",
                                border: "1px solid rgba(97,68,44,0.12)",
                                background: "rgba(255,250,243,0.98)",
                                boxShadow: "0 20px 40px rgba(76,44,23,0.08)",
                              }}
                              labelStyle={{ color: "#5f4b3d", fontWeight: 600 }}
                              formatter={(value) => formatTooltipCurrency(value, copy.tablePrice, messages.locale)}
                            />
                            {trendBrandsWithData.map((brand, index) => (
                              <Line
                                key={brand}
                                type="monotone"
                                dataKey={brand}
                                stroke={`hsl(${index * 137.5 % 360}, 60%, 45%)`}
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#fffaf3", stroke: `hsl(${index * 137.5 % 360}, 60%, 45%)`, strokeWidth: 2 }}
                                activeDot={{ r: 5, fill: `hsl(${index * 137.5 % 360}, 60%, 45%)`, stroke: "#fffaf3", strokeWidth: 2 }}
                                connectNulls={false}
                              />
                            ))}
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          {activeView === "brand-comparison" ? (
            <section className="animate-rise card-surface rounded-[2rem] p-5 sm:p-6 lg:p-7">
              <div className="space-y-2">
                <h2 className="display-font text-3xl font-semibold text-foreground">
                  {copy.brandComparisonTitle}
                </h2>
                <p className="text-sm text-muted">
                  {copy.brandComparisonDescription}
                </p>
              </div>

              <div className="mt-6 rounded-[1.8rem] border border-[rgba(97,68,44,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,249,242,0.94)_100%)] p-4 sm:p-5 lg:p-6">
                {/* Brand Comparison Filters */}
                <div className="rounded-[1.25rem] border border-[rgba(97,68,44,0.12)] bg-[rgba(255,252,248,0.82)] p-4">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground" htmlFor="comparisonDrinkType">
                        {copy.drinkType}
                      </label>
                      <select
                        id="comparisonDrinkType"
                        className="w-full rounded-[0.75rem] border border-[rgba(97,68,44,0.16)] bg-white px-3 py-2 text-sm"
                        value={comparisonDrinkType}
                        onChange={(e) => setComparisonDrinkType(e.target.value as DrinkType)}
                      >
                        {labelByDrinkType.Latte && (
                          <option value="Latte">{labelByDrinkType.Latte}</option>
                        )}
                        {labelByDrinkType.Americano && (
                          <option value="Americano">{labelByDrinkType.Americano}</option>
                        )}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground" htmlFor="comparisonBrands">
                        {copy.brand}
                      </label>
                      <select
                        id="comparisonBrands"
                        className="w-full rounded-[0.75rem] border border-[rgba(97,68,44,0.16)] bg-white px-3 py-2 text-sm"
                        multiple
                        value={comparisonBrands}
                        onChange={(e) => {
                          const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                          setComparisonBrands(selectedOptions);
                        }}
                      >
                        {brands.map((brand) => (
                          <option key={brand} value={brand}>
                            {brand}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-muted">Hold Ctrl/Cmd to select multiple</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground" htmlFor="comparisonDateFrom">
                        {copy.from}
                      </label>
                      <input
                        id="comparisonDateFrom"
                        type="date"
                        className="w-full rounded-[0.75rem] border border-[rgba(97,68,44,0.16)] bg-white px-3 py-2 text-sm"
                        value={comparisonDateFrom}
                        onChange={(e) => setComparisonDateFrom(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground" htmlFor="comparisonDateTo">
                        {copy.to}
                      </label>
                      <input
                        id="comparisonDateTo"
                        type="date"
                        className="w-full rounded-[0.75rem] border border-[rgba(97,68,44,0.16)] bg-white px-3 py-2 text-sm"
                        value={comparisonDateTo}
                        onChange={(e) => setComparisonDateTo(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      className="rounded-full border border-[rgba(138,75,42,0.16)] bg-[rgba(138,75,42,0.12)] px-4 py-2 text-sm font-semibold text-accent transition hover:border-[rgba(138,75,42,0.24)] hover:bg-[rgba(138,75,42,0.16)]"
                    >
                      {copy.search}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setComparisonDrinkType("Latte");
                        setComparisonBrands([]);
                        setComparisonDateFrom("2025-01-01");
                        setComparisonDateTo("2025-12-31");
                      }}
                      className="rounded-full border border-[rgba(97,68,44,0.16)] bg-white px-4 py-2 text-sm font-semibold text-accent transition hover:border-[rgba(138,75,42,0.24)] hover:bg-[rgba(138,75,42,0.04)]"
                    >
                      {copy.reset}
                    </button>
                  </div>
                </div>

                <div className="mt-6 rounded-[1.55rem] border border-[rgba(97,68,44,0.1)] bg-[rgba(255,252,248,0.76)] p-3 sm:p-4">
                  {comparisonData.length < 2 ? (
                    <EmptyBlock
                      title={copy.notEnoughBrands}
                      description={copy.notEnoughBrandsDescription}
                    />
                  ) : (
                    <div className="h-[320px] rounded-[1.45rem] border border-[rgba(97,68,44,0.08)] bg-[rgba(255,255,255,0.82)] p-4 sm:h-[360px] sm:p-5">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={comparisonData} margin={{ top: 14, right: 12, left: -18, bottom: 6 }}>
                          <CartesianGrid stroke="rgba(97,68,44,0.07)" vertical={false} />
                          <XAxis
                            dataKey="date"
                            tick={{ fill: "#7b6555", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            dy={8}
                          />
                          <YAxis
                            tick={{ fill: "#7b6555", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `€${value.toFixed(1)}`}
                            width={46}
                          />
                          <Tooltip
                            cursor={{ stroke: "rgba(138,75,42,0.16)", strokeWidth: 1 }}
                            contentStyle={{
                              borderRadius: "18px",
                              border: "1px solid rgba(97,68,44,0.12)",
                              background: "rgba(255,250,243,0.98)",
                              boxShadow: "0 20px 40px rgba(76,44,23,0.08)",
                            }}
                            labelStyle={{ color: "#5f4b3d", fontWeight: 600 }}
                            formatter={(value, name) => formatTooltipCurrency(value, `${copy.tablePrice} (${name})`, messages.locale)}
                          />
                          {comparisonBrandsWithData.map((brand, index) => (
                            <Line
                              key={brand}
                              type="monotone"
                              dataKey={brand}
                              stroke={`hsl(${(index * 137.5) % 360}, 70%, 50%)`}
                              strokeWidth={3}
                              dot={{ r: 4, fill: "#fffaf3", strokeWidth: 2 }}
                              activeDot={{ r: 5, strokeWidth: 2 }}
                              connectNulls={true}
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>
            </section>
          ) : null}

          {activeView === "order-history" ? (
            <section className="animate-rise card-surface rounded-[2rem] p-5 sm:p-6 lg:p-7">
              <div className="mb-5 space-y-2">
                <h2 className="display-font text-3xl font-semibold text-foreground">
                  {copy.orderHistoryTitle}
                </h2>
              </div>

              {orderHistoryEntries.length === 0 ? (
                <EmptyBlock
                  title={copy.noOrders}
                  description={copy.noOrdersDescription}
                />
              ) : (
                <>
                  <div className="hidden overflow-hidden rounded-[1.8rem] border border-[rgba(97,68,44,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.68)_0%,rgba(255,249,242,0.92)_100%)] p-3 lg:block">
                    <table className="min-w-full overflow-hidden rounded-[1.5rem] bg-[rgba(255,252,248,0.86)] text-left">
                      <thead className="bg-[rgba(138,75,42,0.06)] text-sm text-muted">
                        <tr>
                          {[copy.tableDate, copy.tableBrand, copy.tableDrink, copy.tableTemperature, copy.tableMilk, copy.tableSize, copy.tablePrice, ""].map((column, index) => (
                            <th key={column} className="px-4 py-4 font-semibold">
                              {index === 7 ? null : column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {orderHistoryEntries.map((entry) => (
                          <tr key={entry.id} className="border-t border-[rgba(97,68,44,0.08)] text-sm text-foreground transition hover:bg-[rgba(138,75,42,0.03)] first:border-t-0">
                            <td className="px-4 py-4 text-muted">{formatDate(entry.date, messages.locale)}</td>
                            <td className="px-4 py-4">
                              <BrandBadge brand={entry.brand} />
                            </td>
                            <td className="px-4 py-4 font-semibold">{labelByDrinkType[entry.drinkType]}</td>
                            <td className="px-4 py-4 text-muted">{labelByTemperature[entry.temperature]}</td>
                            <td className="px-4 py-4 text-muted">{labelByMilkType[entry.milkType]}</td>
                            <td className="px-4 py-4 text-muted">{labelBySize[entry.size]}</td>
                            <td className="px-4 py-4">
                              <span className="rounded-full bg-[rgba(138,75,42,0.12)] px-3 py-1 text-sm font-semibold text-accent">
                                {formatCurrency(entry.finalPrice)}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteOrder(entry.id)}
                                className="rounded-full border border-[rgba(97,68,44,0.12)] bg-white/80 px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-[rgba(138,75,42,0.16)] hover:bg-white hover:text-accent"
                              >
                                {copy.deleteOrder}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid gap-4 lg:hidden">
                    {orderHistoryEntries.map((entry) => (
                      <article
                        key={entry.id}
                        className="rounded-[1.75rem] border border-[rgba(97,68,44,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.76)_0%,rgba(255,249,242,0.94)_100%)] p-4 transition hover:border-[rgba(138,75,42,0.12)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(255,249,242,0.97)_100%)]"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm text-muted">{formatDate(entry.date, messages.locale)}</p>
                            <div className="mt-2">
                              <BrandBadge brand={entry.brand} />
                            </div>
                          </div>
                          <div className="rounded-full bg-[rgba(138,75,42,0.12)] px-3 py-1 text-sm font-semibold text-accent">
                            {formatCurrency(entry.finalPrice)}
                          </div>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <OrderMeta label={copy.tableDrink} value={labelByDrinkType[entry.drinkType]} />
                          <OrderMeta label={copy.tableTemperature} value={labelByTemperature[entry.temperature]} />
                          <OrderMeta label={copy.tableMilk} value={labelByMilkType[entry.milkType]} />
                          <OrderMeta label={copy.tableSize} value={labelBySize[entry.size]} />
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(entry.id)}
                            className="rounded-full border border-[rgba(97,68,44,0.12)] bg-white/80 px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-[rgba(138,75,42,0.16)] hover:bg-white hover:text-accent"
                          >
                            {copy.deleteOrder}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </section>
          ) : null}
        </div>
      </div>
      <ScrollToTopButton />
    </main>
  );
}

function SummaryStatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "up" | "down";
}) {
  const toneStyles =
    tone === "up"
      ? "border-[rgba(138,75,42,0.16)] bg-[rgba(191,143,101,0.12)]"
      : tone === "down"
        ? "border-[rgba(130,86,62,0.16)] bg-[rgba(110,90,73,0.08)]"
        : "border-[rgba(97,68,44,0.1)] bg-[rgba(255,252,248,0.82)]";

  return (
    <div className={`rounded-[1.25rem] border px-4 py-3.5 ${toneStyles}`}>
      <p className="text-[10px] font-semibold tracking-[0.16em] text-accent/70 uppercase">{label}</p>
      <p className="mt-1.5 text-sm font-semibold leading-6 text-foreground">{value}</p>
    </div>
  );
}

function EmptyBlock({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-[rgba(97,68,44,0.16)] bg-[rgba(255,252,248,0.72)] px-6 py-10 text-center">
      <p className="text-sm font-semibold tracking-[0.18em] text-accent uppercase">{title}</p>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted">{description}</p>
    </div>
  );
}

function BrandBadge({ brand }: { brand: string }) {
  const initials = brand
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(97,68,44,0.12)] bg-[rgba(255,250,243,0.96)] px-3 py-1.5">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(138,75,42,0.14)] text-[11px] font-semibold tracking-[0.08em] text-accent">
        {initials}
      </span>
      <span className="text-sm font-semibold text-foreground">{brand}</span>
    </div>
  );
}

function OrderMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.1rem] border border-[rgba(97,68,44,0.08)] bg-[rgba(255,252,248,0.72)] px-3 py-3">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

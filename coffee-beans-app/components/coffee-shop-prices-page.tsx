"use client";

import { useMemo, useState } from "react";
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
import { CoffeeShopPriceFilterBar } from "@/components/coffee-shop-price-filter-bar";
import { useLanguage } from "@/components/language-provider";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";
import {
  coffeeShopBrands,
  coffeeShopPriceData,
  type CoffeeShopPriceEntry,
} from "@/lib/coffee-shop-prices";

type DrinkType = CoffeeShopPriceEntry["drinkType"];
type Temperature = CoffeeShopPriceEntry["temperature"];
type MilkType = CoffeeShopPriceEntry["milkType"];
type Size = CoffeeShopPriceEntry["size"];
type ActiveView = "add-order" | "price-trend" | "order-history";
const ALL_BRANDS = "__all__";
const DEFAULT_DATE_FROM = "2026-04-17";

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
    { key: "order-history" as const, title: copy.tabOrderHistory },
  ] as const;

  const [entries, setEntries] = useState<CoffeeShopPriceEntry[]>(coffeeShopPriceData);
  const [selectedBrand, setSelectedBrand] = useState<string>(coffeeShopBrands[0] ?? ALL_BRANDS);
  const [drinkType, setDrinkType] = useState<DrinkType>("Latte");
  const [temperature, setTemperature] = useState<Temperature>("Iced");
  const [milkType, setMilkType] = useState<MilkType>("Oat");
  const [size, setSize] = useState<Size>("Standard");
  const [dateFrom, setDateFrom] = useState(DEFAULT_DATE_FROM);
  const [dateTo, setDateTo] = useState(defaultDateTo);
  const [activeView, setActiveView] = useState<ActiveView>("add-order");

  const normalizedMilkType: MilkType = drinkType === "Americano" ? "None" : milkType;

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesBrand = selectedBrand === ALL_BRANDS || entry.brand === selectedBrand;
      const matchesDrinkType = entry.drinkType === drinkType;
      const matchesTemperature = entry.temperature === temperature;
      const matchesMilk = entry.milkType === normalizedMilkType;
      const matchesSize = entry.size === size;
      const matchesFrom = !dateFrom || entry.date >= dateFrom;
      const matchesTo = !dateTo || entry.date <= dateTo;

      return (
        matchesBrand &&
        matchesDrinkType &&
        matchesTemperature &&
        matchesMilk &&
        matchesSize &&
        matchesFrom &&
        matchesTo
      );
    });
  }, [dateFrom, dateTo, drinkType, entries, normalizedMilkType, selectedBrand, size, temperature]);

  const trendEntries = useMemo(() => {
    if (selectedBrand === ALL_BRANDS) {
      return [];
    }

    return [...filteredEntries].sort((left, right) => left.date.localeCompare(right.date));
  }, [filteredEntries, selectedBrand]);

  const trendData = trendEntries.map((entry) => ({
    date: formatDate(entry.date, messages.locale),
    price: entry.finalPrice,
  }));

  const firstPrice = trendEntries[0]?.finalPrice ?? null;
  const latestPrice = trendEntries.at(-1)?.finalPrice ?? null;
  const changeAmount =
    firstPrice !== null && latestPrice !== null ? latestPrice - firstPrice : null;

  const recentEntries = [...filteredEntries]
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, 8);
  const totalMatchingEntries = filteredEntries.length;
  const selectedCoffeeLabel =
    selectedBrand === ALL_BRANDS
      ? drinkType === "Americano"
        ? `${labelBySize[size]} ${labelByTemperature[temperature]} ${labelByDrinkType[drinkType]} — ${copy.allBrands}`
        : `${labelBySize[size]} ${labelByTemperature[temperature]} ${labelByMilkType[normalizedMilkType]} ${labelByDrinkType[drinkType]} — ${copy.allBrands}`
      : drinkType === "Americano"
        ? `${labelBySize[size]} ${labelByTemperature[temperature]} ${labelByDrinkType[drinkType]} — ${selectedBrand}`
        : `${labelBySize[size]} ${labelByTemperature[temperature]} ${labelByMilkType[normalizedMilkType]} ${labelByDrinkType[drinkType]} — ${selectedBrand}`;

  function resetFilters() {
    setSelectedBrand(coffeeShopBrands[0] ?? ALL_BRANDS);
    setDrinkType("Latte");
    setTemperature("Iced");
    setMilkType("Oat");
    setSize("Standard");
    setDateFrom(DEFAULT_DATE_FROM);
    setDateTo(getTodayDateString());
  }

  function handleDrinkTypeChange(nextDrinkType: DrinkType) {
    setDrinkType(nextDrinkType);

    if (nextDrinkType === "Americano") {
      setTemperature("Iced");
      setSize("Standard");
      setMilkType("None");
      return;
    }

    setTemperature("Iced");
    setSize("Standard");
    setMilkType("Oat");
  }

  function handleAddOrder(entry: CoffeeShopPriceEntry) {
    setEntries((current) => [entry, ...current]);
    setSelectedBrand(entry.brand);
    setDrinkType(entry.drinkType);
    setTemperature(entry.temperature);
    setMilkType(entry.drinkType === "Americano" ? "None" : entry.milkType);
    setSize(entry.size);
    setDateFrom(DEFAULT_DATE_FROM);
    setDateTo(getTodayDateString());
    setActiveView("price-trend");
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

                <div className="grid gap-3 pt-1 md:grid-cols-3">
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
                  <CoffeeShopPriceFilterBar
                    brands={coffeeShopBrands}
                    allBrandsValue={ALL_BRANDS}
                    selectedBrand={selectedBrand}
                    drinkType={drinkType}
                    temperature={temperature}
                    milkType={milkType}
                    size={size}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    onBrandChange={setSelectedBrand}
                    onDrinkTypeChange={handleDrinkTypeChange}
                    onTemperatureChange={setTemperature}
                    onMilkTypeChange={setMilkType}
                    onSizeChange={setSize}
                    onDateFromChange={setDateFrom}
                    onDateToChange={setDateTo}
                    onReset={resetFilters}
                  />

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <SummaryStatCard
                      label={copy.selectedCoffee}
                      value={selectedCoffeeLabel}
                    />
                    <SummaryStatCard label={copy.matches} value={`${totalMatchingEntries}`} />
                    <SummaryStatCard
                      label={copy.period}
                      value={
                        dateTo
                          ? `${formatDate(dateFrom, messages.locale)} - ${formatDate(dateTo, messages.locale)}`
                          : formatDate(dateFrom, messages.locale)
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
                    {trendData.length < 2 ? (
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
                            <Line
                              type="monotone"
                              dataKey="price"
                              stroke="#8a4b2a"
                              strokeWidth={3}
                              dot={{ r: 4, fill: "#fffaf3", stroke: "#8a4b2a", strokeWidth: 2 }}
                              activeDot={{ r: 5, fill: "#8a4b2a", stroke: "#fffaf3", strokeWidth: 2 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
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

              {recentEntries.length === 0 ? (
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
                          {[copy.tableDate, copy.tableBrand, copy.tableDrink, copy.tableTemperature, copy.tableMilk, copy.tableSize, copy.tablePrice].map((column) => (
                            <th key={column} className="px-4 py-4 font-semibold">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {recentEntries.map((entry) => (
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid gap-4 lg:hidden">
                    {recentEntries.map((entry) => (
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

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
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
import {
  coffeeShopBrands,
  coffeeShopPriceData,
  type CoffeeShopPriceEntry,
} from "@/lib/coffee-shop-prices";

type DrinkType = CoffeeShopPriceEntry["drinkType"];
type Temperature = CoffeeShopPriceEntry["temperature"];
type MilkType = CoffeeShopPriceEntry["milkType"];
type Size = CoffeeShopPriceEntry["size"];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

const formatCurrency = (value: number) => currencyFormatter.format(value);
const DEFAULT_DATE_FROM = "2026-04-17";

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function latestByBrand(entries: CoffeeShopPriceEntry[]) {
  return coffeeShopBrands
    .map((brand) => {
      const latest = [...entries]
        .filter((entry) => entry.brand === brand)
        .sort((left, right) => right.date.localeCompare(left.date))[0];

      return latest ? latest : null;
    })
    .filter((entry): entry is CoffeeShopPriceEntry => Boolean(entry));
}

export function CoffeeShopPricesPage() {
  const defaultDateTo = getTodayDateString();

  const [entries, setEntries] = useState<CoffeeShopPriceEntry[]>(coffeeShopPriceData);
  const [selectedBrand, setSelectedBrand] = useState<string>(coffeeShopBrands[0] ?? "All brands");
  const [drinkType, setDrinkType] = useState<DrinkType>("Latte");
  const [temperature, setTemperature] = useState<Temperature>("Iced");
  const [milkType, setMilkType] = useState<MilkType>("Oat");
  const [size, setSize] = useState<Size>("Standard");
  const [dateFrom, setDateFrom] = useState(DEFAULT_DATE_FROM);
  const [dateTo, setDateTo] = useState(defaultDateTo);

  const normalizedMilkType: MilkType = drinkType === "Americano" ? "None" : milkType;

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesBrand = selectedBrand === "All brands" || entry.brand === selectedBrand;
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
    if (selectedBrand === "All brands") {
      return [];
    }

    return [...filteredEntries].sort((left, right) => left.date.localeCompare(right.date));
  }, [filteredEntries, selectedBrand]);

  const trendData = trendEntries.map((entry) => ({
    date: formatDate(entry.date),
    price: entry.finalPrice,
  }));

  const firstPrice = trendEntries[0]?.finalPrice ?? null;
  const latestPrice = trendEntries.at(-1)?.finalPrice ?? null;
  const changeAmount =
    firstPrice !== null && latestPrice !== null ? latestPrice - firstPrice : null;
  const comparisonEntries = useMemo(() => {
    const withoutBrandFilter = entries.filter((entry) => {
      const matchesDrinkType = entry.drinkType === drinkType;
      const matchesTemperature = entry.temperature === temperature;
      const matchesMilk = entry.milkType === normalizedMilkType;
      const matchesSize = entry.size === size;
      const matchesFrom = !dateFrom || entry.date >= dateFrom;
      const matchesTo = !dateTo || entry.date <= dateTo;

      return (
        matchesDrinkType &&
        matchesTemperature &&
        matchesMilk &&
        matchesSize &&
        matchesFrom &&
        matchesTo
      );
    });

    return latestByBrand(withoutBrandFilter);
  }, [dateFrom, dateTo, drinkType, entries, normalizedMilkType, size, temperature]);

  const comparisonData = comparisonEntries.map((entry) => ({
    brand: entry.brand,
    price: entry.finalPrice,
    oatMilkExtra: entry.oatMilkExtra,
  }));
  const rankedComparisonEntries = [...comparisonEntries].sort((left, right) => left.finalPrice - right.finalPrice);
  const cheapestEntry = rankedComparisonEntries[0] ?? null;
  const mostExpensiveEntry = rankedComparisonEntries.at(-1) ?? null;

  const recentEntries = [...filteredEntries]
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, 8);
  const totalMatchingEntries = filteredEntries.length;

  function resetFilters() {
    setSelectedBrand(coffeeShopBrands[0] ?? "All brands");
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
  }

  return (
    <main className="grain min-h-screen py-8 sm:py-12">
      <div className="page-shell space-y-7 sm:space-y-8">
        <div className="card-surface relative overflow-hidden rounded-[2.1rem] px-6 py-6 sm:px-8 sm:py-7">
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-[#d89a6e]/18 via-transparent to-[#8f5734]/10" />
          <div className="relative flex flex-col gap-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <div className="inline-flex rounded-full border border-[rgba(97,68,44,0.16)] bg-white/72 px-4 py-1 text-sm font-semibold tracking-[0.18em] text-accent uppercase">
                  Coffee Shop Prices
                </div>
                <div className="space-y-3">
                  <h1 className="display-font text-4xl font-semibold text-accent sm:text-5xl">
                    Coffee Shop Prices
                  </h1>
                  <p className="max-w-3xl text-base leading-8 text-muted">
                    Track price changes over time and compare coffee brands by drink, size, and milk choice.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="rounded-full border border-line bg-white/72 px-4 py-2.5 text-sm font-semibold text-foreground transition duration-200 hover:border-[rgba(138,75,42,0.16)] hover:bg-white hover:text-accent"
                >
                  Back to Bean Tracker
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <HeroMetaCard
                label="Selected setup"
                value={
                  drinkType === "Americano"
                    ? `${size} ${temperature} ${drinkType}`
                    : `${size} ${temperature} ${normalizedMilkType} ${drinkType}`
                }
              />
              <HeroMetaCard
                label="Matching entries"
                value={`${totalMatchingEntries}`}
              />
              <HeroMetaCard
                label="Tracking window"
                value={dateTo ? `${formatDate(dateFrom)} - ${formatDate(dateTo)}` : formatDate(dateFrom)}
              />
            </div>
          </div>
        </div>

        <AddCoffeeShopOrderForm onAddOrder={handleAddOrder} />

        <CoffeeShopPriceFilterBar
          brands={coffeeShopBrands}
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

        <section className="grid gap-6 xl:grid-cols-[1.65fr_1fr] xl:items-start">
          <article className="card-surface rounded-[2rem] p-5 sm:p-6 lg:p-7">
            <div className="space-y-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-semibold tracking-[0.2em] text-accent uppercase">
                      Trend
                    </p>
                    <h2 className="display-font text-3xl font-semibold text-foreground">
                      Price Trend Over Time
                    </h2>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <StatCard label="First price" value={firstPrice !== null ? formatCurrency(firstPrice) : "—"} />
                  <StatCard label="Latest price" value={latestPrice !== null ? formatCurrency(latestPrice) : "—"} />
                  <StatCard
                    label="Change"
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
              </div>

              <div className="rounded-[1.8rem] border border-[rgba(97,68,44,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.68)_0%,rgba(255,249,242,0.92)_100%)] p-4 sm:p-5 lg:p-6">
                {trendData.length < 2 ? (
                  <EmptyBlock
                    title="Not enough data yet"
                    description="Pick a single brand and matching filters with at least two entries to unlock the trend line."
                  />
                ) : (
                  <div className="h-[320px] rounded-[1.65rem] border border-[rgba(97,68,44,0.1)] bg-[rgba(255,252,248,0.88)] p-4 sm:h-[360px] sm:p-5">
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
                          formatter={(value: number) => [formatCurrency(value), "Final price"]}
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
          </article>

          <article className="card-surface rounded-[2rem] p-5 sm:p-6 lg:p-7">
            <div className="mb-5 space-y-2">
              <p className="text-sm font-semibold tracking-[0.2em] text-accent uppercase">
                Compare
              </p>
              <h2 className="display-font text-3xl font-semibold text-foreground">
                Compare Brands
              </h2>
            </div>

            {comparisonData.length === 0 ? (
              <EmptyBlock
                title="No brand comparison yet"
                description="Try widening the date range or switching drink filters to compare the latest matching prices."
              />
            ) : (
              <div className="space-y-4">
                <div className="rounded-[1.8rem] border border-[rgba(97,68,44,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.68)_0%,rgba(255,249,242,0.92)_100%)] p-4 sm:p-5 lg:p-6">
                  <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
                    <div className="h-[280px] rounded-[1.65rem] border border-[rgba(97,68,44,0.1)] bg-[rgba(255,252,248,0.88)] p-4 sm:p-5">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonData} margin={{ top: 12, right: 12, left: -20, bottom: 8 }}>
                          <CartesianGrid stroke="rgba(97,68,44,0.08)" vertical={false} />
                          <XAxis dataKey="brand" tick={{ fill: "#7b6555", fontSize: 12 }} axisLine={false} tickLine={false} />
                          <YAxis
                            tick={{ fill: "#7b6555", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `€${value.toFixed(1)}`}
                            width={46}
                          />
                          <Tooltip
                            cursor={{ fill: "rgba(138,75,42,0.08)" }}
                            contentStyle={{
                              borderRadius: "16px",
                              border: "1px solid rgba(97,68,44,0.12)",
                              background: "rgba(255,250,243,0.96)",
                              boxShadow: "0 20px 40px rgba(76,44,23,0.08)",
                            }}
                            labelStyle={{ color: "#5f4b3d", fontWeight: 600 }}
                            formatter={(value: number) => [formatCurrency(value), "Latest price"]}
                          />
                          <Bar dataKey="price" radius={[12, 12, 0, 0]} fill="#b67b52" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-[1.5rem] border border-[rgba(97,68,44,0.1)] bg-[rgba(255,252,248,0.84)] p-4">
                        <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">
                          Ranked snapshot
                        </p>
                        <div className="mt-4 space-y-3">
                          <RankRow
                            label="Cheapest"
                            brand={cheapestEntry?.brand ?? "—"}
                            price={cheapestEntry ? formatCurrency(cheapestEntry.finalPrice) : "—"}
                          />
                          <RankRow
                            label="Most expensive"
                            brand={mostExpensiveEntry?.brand ?? "—"}
                            price={mostExpensiveEntry ? formatCurrency(mostExpensiveEntry.finalPrice) : "—"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </article>
        </section>

        <section className="card-surface rounded-[2rem] p-5 sm:p-6 lg:p-7">
          <div className="mb-5 space-y-2">
            <p className="text-sm font-semibold tracking-[0.2em] text-accent uppercase">
              Entries
            </p>
            <h2 className="display-font text-3xl font-semibold text-foreground">
              Recent Orders
            </h2>
          </div>

          {recentEntries.length === 0 ? (
            <EmptyBlock
              title="No recent orders match these filters"
              description="Try a different setup or date range to bring entries back into view."
            />
          ) : (
            <>
              <div className="hidden overflow-hidden rounded-[1.8rem] border border-[rgba(97,68,44,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.68)_0%,rgba(255,249,242,0.92)_100%)] p-3 lg:block">
                <table className="min-w-full overflow-hidden rounded-[1.5rem] bg-[rgba(255,252,248,0.86)] text-left">
                  <thead className="bg-[rgba(138,75,42,0.06)] text-sm text-muted">
                    <tr>
                      {["Date", "Brand", "Drink", "Hot/Iced", "Milk", "Size", "Final Price", "Extra"].map((column) => (
                        <th key={column} className="px-4 py-4 font-semibold">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentEntries.map((entry) => (
                      <tr key={entry.id} className="border-t border-[rgba(97,68,44,0.08)] text-sm text-foreground transition hover:bg-[rgba(138,75,42,0.03)] first:border-t-0">
                        <td className="px-4 py-4 text-muted">{formatDate(entry.date)}</td>
                        <td className="px-4 py-4">
                          <BrandBadge brand={entry.brand} />
                        </td>
                        <td className="px-4 py-4 font-semibold">{entry.drinkType}</td>
                        <td className="px-4 py-4 text-muted">{entry.temperature}</td>
                        <td className="px-4 py-4 text-muted">{entry.milkType}</td>
                        <td className="px-4 py-4 text-muted">{entry.size}</td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-[rgba(138,75,42,0.12)] px-3 py-1 text-sm font-semibold text-accent">
                            {formatCurrency(entry.finalPrice)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-muted">
                          {entry.oatMilkExtra > 0 ? formatCurrency(entry.oatMilkExtra) : "No extra"}
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
                        <p className="text-sm text-muted">{formatDate(entry.date)}</p>
                        <div className="mt-2">
                          <BrandBadge brand={entry.brand} />
                        </div>
                      </div>
                      <div className="rounded-full bg-[rgba(138,75,42,0.12)] px-3 py-1 text-sm font-semibold text-accent">
                        {formatCurrency(entry.finalPrice)}
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <OrderMeta label="Drink" value={entry.drinkType} />
                      <OrderMeta label="Temperature" value={entry.temperature} />
                      <OrderMeta label="Milk" value={entry.milkType} />
                      <OrderMeta label="Size" value={entry.size} />
                      <OrderMeta
                        label="Extra"
                        value={entry.oatMilkExtra > 0 ? formatCurrency(entry.oatMilkExtra) : "No extra"}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
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
        : "border-[rgba(97,68,44,0.12)] bg-white/60";

  return (
    <div className={`rounded-[1.35rem] border px-4 py-3 ${toneStyles}`}>
      <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">{label}</p>
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

function HeroMetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.35rem] border border-[rgba(97,68,44,0.12)] bg-[rgba(255,252,248,0.78)] px-4 py-3.5">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">{label}</p>
      <p className="mt-1.5 text-sm font-semibold text-foreground">{value}</p>
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

function RankRow({
  label,
  brand,
  price,
}: {
  label: string;
  brand: string;
  price: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-[rgba(97,68,44,0.08)] bg-[rgba(255,250,243,0.84)] px-4 py-3 transition hover:border-[rgba(138,75,42,0.12)] hover:bg-[rgba(255,250,243,0.92)]">
      <div>
        <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">{label}</p>
        <p className="mt-1 text-sm font-semibold text-foreground">{brand}</p>
      </div>
      <p className="text-sm font-semibold text-accent">{price}</p>
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

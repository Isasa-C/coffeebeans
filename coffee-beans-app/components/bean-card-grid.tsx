"use client";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { type BeanRecord } from "@/lib/utils";
import { BeanCard } from "./bean-card";
import { EmptyState } from "./empty-state";

type BeanCardGridProps = {
  beans: BeanRecord[];
};

type SortOption = "newest" | "oldest" | "priceHigh" | "priceLow";

export function BeanCardGrid({ beans }: BeanCardGridProps) {
  const { messages } = useLanguage();
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedRoast, setSelectedRoast] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const brandOptions = Array.from(new Set(beans.map((bean) => bean.brand))).sort(
    (left, right) => left.localeCompare(right),
  );
  const roastOptions = Array.from(
    new Set(beans.map((bean) => bean.bestFor)),
  ).sort((left, right) => left.localeCompare(right));
  const filteredBeans = beans.filter((bean) => {
    const matchesBrand =
      selectedBrand === "all" || bean.brand === selectedBrand;
    const matchesRoast =
      selectedRoast === "all" || bean.bestFor === selectedRoast;

    return matchesBrand && matchesRoast;
  });
  const sortedBeans = [...filteredBeans].sort((left, right) => {
    if (sortBy === "oldest") {
      return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
    }

    if (sortBy === "priceHigh") {
      return right.price - left.price;
    }

    if (sortBy === "priceLow") {
      return left.price - right.price;
    }

    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
  const visiblePrices = sortedBeans.map((bean) => bean.price);
  const minPrice = visiblePrices.length > 0 ? Math.min(...visiblePrices) : 0;
  const maxPrice = visiblePrices.length > 0 ? Math.max(...visiblePrices) : 0;
  const averagePrice =
    visiblePrices.length > 0
      ? visiblePrices.reduce((sum, price) => sum + price, 0) / visiblePrices.length
      : 0;

  if (beans.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-[1.75rem] border border-line bg-card/85 p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-accent uppercase">
              {messages.catalog}
            </p>
            <h2 className="display-font text-3xl font-semibold">
              {messages.savedBeans}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
              {messages.catalogDescription}
            </p>
          </div>
          <p className="text-sm text-muted">
            {filteredBeans.length} {filteredBeans.length === 1 ? messages.entryShown : messages.entriesShown}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label
              className="mb-2 block text-sm font-semibold text-foreground"
              htmlFor="brandFilter"
            >
              {messages.filterByBrand}
            </label>
            <select
              id="brandFilter"
              className="field appearance-none"
              value={selectedBrand}
              onChange={(event) => setSelectedBrand(event.target.value)}
            >
              <option value="all">{messages.allBrands}</option>
              {brandOptions.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-semibold text-foreground"
              htmlFor="roastFilter"
            >
              {messages.filterByRoast}
            </label>
            <select
              id="roastFilter"
              className="field appearance-none"
              value={selectedRoast}
              onChange={(event) => setSelectedRoast(event.target.value)}
            >
              <option value="all">{messages.allRoasts}</option>
              {roastOptions.map((roast) => (
                <option key={roast} value={roast}>
                  {messages.bestForOptions[roast as keyof typeof messages.bestForOptions] ?? roast}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-semibold text-foreground"
              htmlFor="sortFilter"
            >
              {messages.sortBy}
            </label>
            <select
              id="sortFilter"
              className="field appearance-none"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
            >
              <option value="newest">{messages.newestFirst}</option>
              <option value="oldest">{messages.oldestFirst}</option>
              <option value="priceHigh">{messages.priceHighToLow}</option>
              <option value="priceLow">{messages.priceLowToHigh}</option>
            </select>
          </div>
        </div>
      </div>

      {sortedBeans.length === 0 ? (
        <div className="card-surface rounded-[1.75rem] px-6 py-10 text-center sm:px-10">
          <p className="text-sm font-semibold tracking-[0.2em] text-accent uppercase">
            {messages.noMatches}
          </p>
          <p className="mt-3 text-sm leading-7 text-muted">
            {messages.noMatchesDescription}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {sortedBeans.map((bean, index) => (
            <div
              key={`${bean.id}-${bean.updatedAt}`}
              className="animate-rise h-full"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <BeanCard
                bean={bean}
                priceStats={{
                  min: minPrice,
                  max: maxPrice,
                  average: averagePrice,
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

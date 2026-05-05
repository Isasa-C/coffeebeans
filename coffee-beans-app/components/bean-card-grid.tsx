"use client";

import { useState, type ReactNode } from "react";
import { useLanguage } from "@/components/language-provider";
import { type BeanRecord } from "@/lib/utils";
import { BeanCard } from "./bean-card";
import { EmptyState } from "./empty-state";

type BeanCardGridProps = {
  beans: BeanRecord[];
  onAddBeanClick?: () => void;
  renderHeader?: (sortControl: ReactNode) => ReactNode;
};

type SortOption = "newest" | "oldest" | "priceHigh" | "priceLow";

function calculatePriceContext(beans: BeanRecord[]) {
  if (beans.length === 0) {
    return null;
  }

  const unitPrices = beans.map((bean) => {
    const safeWeight = bean.weight > 0 ? bean.weight : 250;

    return bean.price / safeWeight;
  });
  const min = Math.min(...unitPrices);
  const max = Math.max(...unitPrices);
  const avg =
    unitPrices.reduce((sum, unitPrice) => sum + unitPrice, 0) /
    unitPrices.length;

  return { min, max, avg };
}

export function BeanCardGrid({
  beans,
  onAddBeanClick,
  renderHeader,
}: BeanCardGridProps) {
  const { messages } = useLanguage();
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedRoast, setSelectedRoast] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const shouldShowFilters = beans.length >= 7;
  const isFilteringActive = selectedBrand !== "all" || selectedRoast !== "all";

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
  const priceContext = calculatePriceContext(beans);

  const sortControl = (
    <div className="flex flex-row items-center justify-end gap-3">
      <label
        className="whitespace-nowrap text-[13px] font-semibold text-foreground"
        htmlFor="sortFilter"
      >
        {messages.sortBy}
      </label>
      <select
        id="sortFilter"
        className="field w-auto appearance-none"
        value={sortBy}
        onChange={(event) => setSortBy(event.target.value as SortOption)}
      >
        <option value="newest">{messages.newestFirst}</option>
        <option value="oldest">{messages.oldestFirst}</option>
        <option value="priceHigh">{messages.priceHighToLow}</option>
        <option value="priceLow">{messages.priceLowToHigh}</option>
      </select>
    </div>
  );
  const compactSortControl = (
    <div className="flex items-center justify-end">
      <label
        className="sr-only"
        htmlFor="sortFilter"
      >
        {messages.sortBy}
      </label>
      <select
        id="sortFilter"
        className="h-8 w-auto appearance-none rounded-full border border-line bg-white/75 px-3 text-[12px] font-medium text-foreground outline-none transition focus:border-accent"
        value={sortBy}
        onChange={(event) => setSortBy(event.target.value as SortOption)}
      >
        <option value="newest">{messages.newestFirst}</option>
        <option value="oldest">{messages.oldestFirst}</option>
        <option value="priceHigh">{messages.priceHighToLow}</option>
        <option value="priceLow">{messages.priceLowToHigh}</option>
      </select>
    </div>
  );

  return (
    <div className={renderHeader ? "space-y-3" : "space-y-4"}>
      {renderHeader ? renderHeader(sortControl) : null}

      {beans.length === 0 ? (
        <EmptyState onAddBeanClick={onAddBeanClick} />
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {renderHeader ? null : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-serif text-3xl font-normal">
                    {messages.savedBeans}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                    {messages.catalogDescription}
                  </p>
                </div>
                {!shouldShowFilters ? (
                  <div className="flex flex-row items-center justify-end gap-3">
                    {sortControl}
                    {isFilteringActive ? (
                      <p className="whitespace-nowrap text-[13px] text-muted">
                        {filteredBeans.length} of {beans.length} results
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )}

            {shouldShowFilters ? (
              <div
                className={`grid items-center gap-3 ${
                  renderHeader
                    ? "sm:grid-cols-2"
                    : "sm:grid-cols-[repeat(3,minmax(0,1fr))_auto]"
                }`}
              >
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
                        {messages.bestForOptions[
                          roast as keyof typeof messages.bestForOptions
                        ] ?? roast}
                      </option>
                    ))}
                  </select>
                </div>

                {renderHeader ? null : (
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
                      onChange={(event) =>
                        setSortBy(event.target.value as SortOption)
                      }
                    >
                      <option value="newest">{messages.newestFirst}</option>
                      <option value="oldest">{messages.oldestFirst}</option>
                      <option value="priceHigh">{messages.priceHighToLow}</option>
                      <option value="priceLow">{messages.priceLowToHigh}</option>
                    </select>
                  </div>
                )}
                {isFilteringActive ? (
                  <p className="text-[13px] text-muted sm:ml-auto sm:self-center">
                    {filteredBeans.length} of {beans.length} results
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          {renderHeader ? (
            <div className="-mb-1 flex items-center justify-end gap-3">
              {compactSortControl}
              {isFilteringActive ? (
                <p className="whitespace-nowrap text-[12px] text-muted">
                  {filteredBeans.length} of {beans.length} results
                </p>
              ) : null}
            </div>
          ) : null}

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
            <div className="beans-grid">
              {sortedBeans.map((bean, index) => (
                <div
                  key={`${bean.id}-${bean.updatedAt}`}
                  className="animate-rise h-full"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <BeanCard bean={bean} priceContext={priceContext} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

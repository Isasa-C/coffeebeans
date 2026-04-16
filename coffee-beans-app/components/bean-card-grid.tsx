 "use client";

import { useState } from "react";
import { type BeanRecord } from "@/lib/utils";
import { BeanCard } from "./bean-card";
import { EmptyState } from "./empty-state";

type BeanCardGridProps = {
  beans: BeanRecord[];
};

export function BeanCardGrid({ beans }: BeanCardGridProps) {
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedBestFor, setSelectedBestFor] = useState("all");

  const brandOptions = Array.from(new Set(beans.map((bean) => bean.brand))).sort(
    (left, right) => left.localeCompare(right),
  );
  const bestForOptions = Array.from(
    new Set(beans.map((bean) => bean.bestFor)),
  ).sort((left, right) => left.localeCompare(right));
  const filteredBeans = beans.filter((bean) => {
    const matchesBrand =
      selectedBrand === "all" || bean.brand === selectedBrand;
    const matchesBestFor =
      selectedBestFor === "all" || bean.bestFor === selectedBestFor;

    return matchesBrand && matchesBestFor;
  });

  if (beans.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-[1.75rem] border border-line bg-card/85 p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-accent uppercase">
              Catalog
            </p>
            <h2 className="display-font text-3xl font-semibold">
              Saved beans
            </h2>
          </div>
          <p className="text-sm text-muted">
            {filteredBeans.length} {filteredBeans.length === 1 ? "entry" : "entries"} shown
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label
              className="mb-2 block text-sm font-semibold text-foreground"
              htmlFor="brandFilter"
            >
              Filter by brand
            </label>
            <select
              id="brandFilter"
              className="field appearance-none"
              value={selectedBrand}
              onChange={(event) => setSelectedBrand(event.target.value)}
            >
              <option value="all">All brands</option>
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
              htmlFor="bestForFilter"
            >
              Filter by best for
            </label>
            <select
              id="bestForFilter"
              className="field appearance-none"
              value={selectedBestFor}
              onChange={(event) => setSelectedBestFor(event.target.value)}
            >
              <option value="all">All types</option>
              {bestForOptions.map((bestFor) => (
                <option key={bestFor} value={bestFor}>
                  {bestFor}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredBeans.length === 0 ? (
        <div className="card-surface rounded-[1.75rem] px-6 py-10 text-center sm:px-10">
          <p className="text-sm font-semibold tracking-[0.2em] text-accent uppercase">
            No matches
          </p>
          <p className="mt-3 text-sm leading-7 text-muted">
            Try a different brand or best-for filter to see more beans.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredBeans.map((bean, index) => (
            <div
              key={`${bean.id}-${bean.updatedAt}`}
              className="animate-rise h-full"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <BeanCard bean={bean} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { SegmentedControl } from "@/components/ui/segmented-control";
import { type CoffeeShopPriceEntry } from "@/lib/coffee-shop-prices";

type DrinkType = CoffeeShopPriceEntry["drinkType"];
type Temperature = CoffeeShopPriceEntry["temperature"];
type MilkType = CoffeeShopPriceEntry["milkType"];
type Size = CoffeeShopPriceEntry["size"];

type CoffeeShopPriceFilterBarProps = {
  brands: string[];
  selectedBrand: string;
  drinkType: DrinkType;
  temperature: Temperature;
  milkType: MilkType;
  size: Size;
  dateFrom: string;
  dateTo: string;
  onBrandChange: (brand: string) => void;
  onDrinkTypeChange: (drinkType: DrinkType) => void;
  onTemperatureChange: (temperature: Temperature) => void;
  onMilkTypeChange: (milkType: MilkType) => void;
  onSizeChange: (size: Size) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onReset: () => void;
};

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold tracking-[0.18em] text-accent/70 uppercase">
      {children}
    </p>
  );
}

function DateField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex min-w-0 flex-1 flex-col gap-2 rounded-[1.25rem] border border-[rgba(97,68,44,0.12)] bg-[rgba(255,252,248,0.88)] px-4 py-3 shadow-[0_14px_30px_rgba(76,44,23,0.06)]"
    >
      <FilterLabel>{label}</FilterLabel>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
      />
    </label>
  );
}

export function CoffeeShopPriceFilterBar({
  brands,
  selectedBrand,
  drinkType,
  temperature,
  milkType,
  size,
  dateFrom,
  dateTo,
  onBrandChange,
  onDrinkTypeChange,
  onTemperatureChange,
  onMilkTypeChange,
  onSizeChange,
  onDateFromChange,
  onDateToChange,
  onReset,
}: CoffeeShopPriceFilterBarProps) {
  const milkDisabled = drinkType === "Americano";

  return (
    <section className="card-surface rounded-[2rem] p-5 sm:p-6 lg:p-7">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-accent uppercase">
            Filters
          </p>
          <h2 className="display-font text-3xl font-semibold text-foreground">
            Narrow the comparison
          </h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-full border border-line bg-white/78 px-4 py-2.5 text-sm font-semibold text-foreground transition duration-200 hover:border-[rgba(138,75,42,0.16)] hover:bg-white hover:text-accent"
        >
          Reset filters
        </button>
      </div>

      <div className="rounded-[1.8rem] border border-[rgba(97,68,44,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,249,242,0.94)_100%)] p-4 sm:p-5 lg:p-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(220px,250px)_1fr] xl:items-start">
          <label
            htmlFor="brand-select"
            className="flex min-w-0 flex-col gap-2 rounded-[1.35rem] border border-[rgba(97,68,44,0.12)] bg-[rgba(255,252,248,0.9)] px-4 py-3.5 shadow-[0_14px_30px_rgba(76,44,23,0.06)]"
          >
            <FilterLabel>Brand</FilterLabel>
            <select
              id="brand-select"
              className="w-full appearance-none bg-transparent text-sm font-medium text-foreground outline-none"
              value={selectedBrand}
              onChange={(event) => onBrandChange(event.target.value)}
            >
              {["All brands", ...brands].map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            <SegmentedControl
              label="Drink type"
              options={[
                { label: "Latte", value: "Latte" },
                { label: "Americano", value: "Americano" },
              ]}
              value={drinkType}
              onChange={onDrinkTypeChange}
              fullWidth
            />

            <SegmentedControl
              label="Temperature"
              options={[
                { label: "Hot", value: "Hot" },
                { label: "Iced", value: "Iced" },
              ]}
              value={temperature}
              onChange={onTemperatureChange}
              fullWidth
            />

            <div
              className={`rounded-[1.3rem] border border-[rgba(97,68,44,0.08)] p-3 transition ${
                milkDisabled ? "bg-[rgba(255,250,243,0.5)] opacity-65" : "bg-[rgba(255,255,255,0.3)]"
              }`}
            >
              <SegmentedControl
                label="Milk type"
                options={
                  milkDisabled
                    ? [{ label: "None", value: "None" }]
                    : [
                        { label: "Normal", value: "Normal" },
                        { label: "Oat", value: "Oat" },
                      ]
                }
                value={milkDisabled ? "None" : milkType}
                onChange={(value) => onMilkTypeChange(value as MilkType)}
                disabled={milkDisabled}
                fullWidth
              />
            </div>

            <SegmentedControl
              label="Size"
              options={[
                { label: "Small", value: "Small" },
                { label: "Standard", value: "Standard" },
                { label: "Large", value: "Large" },
              ]}
              value={size}
              onChange={onSizeChange}
              fullWidth
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <DateField
            id="date-from"
            label="From"
            value={dateFrom}
            onChange={onDateFromChange}
          />
          <DateField
            id="date-to"
            label="To"
            value={dateTo}
            onChange={onDateToChange}
          />
        </div>
      </div>
    </section>
  );
}

"use client";

import { useLanguage } from "@/components/language-provider";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { type CoffeeShopPriceEntry } from "@/lib/coffee-shop-prices";

type DrinkType = CoffeeShopPriceEntry["drinkType"];
type Temperature = CoffeeShopPriceEntry["temperature"];
type MilkType = CoffeeShopPriceEntry["milkType"];
type Size = CoffeeShopPriceEntry["size"];

type CoffeeShopPriceFilterBarProps = {
  brands: string[];
  allBrandsValue: string;
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
    <p className="text-[10px] font-semibold tracking-[0.16em] text-accent/70 uppercase">
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
      className="flex min-h-[74px] min-w-0 flex-1 flex-col gap-2 rounded-[1.25rem] border border-[rgba(97,68,44,0.12)] bg-[rgba(255,252,248,0.88)] px-4 py-3 shadow-[0_14px_30px_rgba(76,44,23,0.06)]"
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
  allBrandsValue,
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
  const { messages } = useLanguage();
  const copy = messages.coffeePrices;
  const milkDisabled = drinkType === "Americano";

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(220px,250px)_minmax(320px,420px)_auto] xl:items-start">
        <label
          htmlFor="brand-select"
          className="flex min-h-[74px] min-w-0 flex-col gap-2 rounded-[1.35rem] border border-[rgba(97,68,44,0.12)] bg-[rgba(255,252,248,0.9)] px-4 py-3.5 shadow-[0_14px_30px_rgba(76,44,23,0.06)]"
        >
          <FilterLabel>{copy.brand}</FilterLabel>
          <select
            id="brand-select"
            className="w-full appearance-none bg-transparent text-sm font-medium text-foreground outline-none"
            value={selectedBrand}
            onChange={(event) => onBrandChange(event.target.value)}
          >
            <option value={allBrandsValue}>{copy.allBrands}</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <DateField
            id="date-from"
            label={copy.from}
            value={dateFrom}
            onChange={onDateFromChange}
          />
          <DateField
            id="date-to"
            label={copy.to}
            value={dateTo}
            onChange={onDateToChange}
          />
        </div>

        <div className="flex justify-end xl:self-start">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-[74px] items-center justify-center rounded-[1.25rem] border border-[rgba(120,120,120,0.16)] bg-[rgba(120,120,120,0.12)] px-5 py-3 text-sm font-semibold text-foreground transition duration-200 hover:bg-[rgba(120,120,120,0.18)] hover:shadow-[0_14px_28px_rgba(70,70,70,0.08)]"
          >
            {copy.reset}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SegmentedControl
          label={copy.drinkType}
          options={[
            { label: copy.latte, value: "Latte" },
            { label: copy.americano, value: "Americano" },
          ]}
          value={drinkType}
          onChange={onDrinkTypeChange}
          fullWidth
        />

        <SegmentedControl
          label={copy.temperature}
          options={[
            { label: copy.hot, value: "Hot" },
            { label: copy.iced, value: "Iced" },
          ]}
          value={temperature}
          onChange={onTemperatureChange}
          fullWidth
        />

        <SegmentedControl
          label={copy.milkType}
          options={
            milkDisabled
              ? [{ label: copy.none, value: "None" }]
              : [
                  { label: copy.normal, value: "Normal" },
                  { label: copy.oat, value: "Oat" },
                ]
          }
          value={milkDisabled ? "None" : milkType}
          onChange={(value) => onMilkTypeChange(value as MilkType)}
          disabled={milkDisabled}
          fullWidth
        />

        <SegmentedControl
          label={copy.size}
          options={[
            { label: copy.small, value: "Small" },
            { label: copy.standard, value: "Standard" },
            { label: copy.large, value: "Large" },
          ]}
          value={size}
          onChange={onSizeChange}
          fullWidth
        />
      </div>
    </div>
  );
}

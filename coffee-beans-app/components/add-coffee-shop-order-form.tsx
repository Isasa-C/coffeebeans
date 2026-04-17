"use client";

import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { coffeeShopBrands, type CoffeeShopPriceEntry } from "@/lib/coffee-shop-prices";

type DrinkType = CoffeeShopPriceEntry["drinkType"];
type Temperature = CoffeeShopPriceEntry["temperature"];
type MilkType = CoffeeShopPriceEntry["milkType"];
type Size = CoffeeShopPriceEntry["size"];

type AddCoffeeShopOrderFormProps = {
  onAddOrder: (entry: CoffeeShopPriceEntry) => void;
};

type OrderDraft = {
  brand: string;
  drinkType: DrinkType;
  temperature: Temperature;
  milkType: MilkType;
  size: Size;
  finalPrice: string;
  oatMilkExtra: string;
  date: string;
  notes: string;
};

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createDefaultDraft(): OrderDraft {
  return {
    brand: coffeeShopBrands[0] ?? "Starbucks",
    drinkType: "Latte",
    temperature: "Iced",
    milkType: "Oat",
    size: "Standard",
    finalPrice: "",
    oatMilkExtra: "",
    date: getTodayDateString(),
    notes: "",
  };
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold tracking-[0.18em] text-accent/70 uppercase">
      {children}
    </p>
  );
}

function InputShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[1.25rem] border border-[rgba(97,68,44,0.12)] bg-[rgba(255,252,248,0.88)] px-4 py-3 shadow-[0_14px_30px_rgba(76,44,23,0.06)] ${className}`}
    >
      {children}
    </div>
  );
}

export function AddCoffeeShopOrderForm({
  onAddOrder,
}: AddCoffeeShopOrderFormProps) {
  const [draft, setDraft] = useState<OrderDraft>(createDefaultDraft);
  const [message, setMessage] = useState<string | null>(null);

  const isAmericano = draft.drinkType === "Americano";
  const isOatLatte = !isAmericano && draft.milkType === "Oat";

  const milkSummary = useMemo(() => {
    if (isAmericano) {
      return "Milk is locked to None for Americano and oat extra stays at 0.";
    }

    if (draft.milkType === "Normal") {
      return "Normal milk keeps oat surcharge at 0.";
    }

    return null;
  }, [draft.milkType, isAmericano]);

  function updateDraft<K extends keyof OrderDraft>(key: K, value: OrderDraft[K]) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleDrinkTypeChange(nextDrinkType: DrinkType) {
    setDraft((current) => {
      if (nextDrinkType === "Americano") {
        return {
          ...current,
          drinkType: nextDrinkType,
          milkType: "None",
          oatMilkExtra: "0",
        };
      }

      return {
        ...current,
        drinkType: nextDrinkType,
        milkType: current.milkType === "None" ? "Normal" : current.milkType,
      };
    });
  }

  function handleMilkTypeChange(nextMilkType: MilkType) {
    setDraft((current) => ({
      ...current,
      milkType: nextMilkType,
      oatMilkExtra: nextMilkType === "Oat" ? current.oatMilkExtra : "0",
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const finalPrice = Number(draft.finalPrice);
    const oatMilkExtra = isOatLatte ? Number(draft.oatMilkExtra || "0") : 0;

    if (!draft.brand || Number.isNaN(finalPrice) || finalPrice <= 0 || !draft.date) {
      setMessage("Add a brand, a valid final price, and a date to save the order.");
      return;
    }

    const entry: CoffeeShopPriceEntry = {
      id: `${draft.brand}-${draft.drinkType}-${draft.temperature}-${draft.size}-${draft.date}-${Date.now()}`,
      brand: draft.brand,
      drinkType: draft.drinkType,
      temperature: draft.temperature,
      milkType: isAmericano ? "None" : draft.milkType,
      size: draft.size,
      finalPrice,
      oatMilkExtra,
      date: draft.date,
      notes: draft.notes.trim() || undefined,
    };

    onAddOrder(entry);
    setDraft(createDefaultDraft());
    setMessage("Order added to your price tracker.");
  }

  return (
    <section className="card-surface rounded-[2rem] p-5 sm:p-6 lg:p-7">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold tracking-[0.2em] text-accent uppercase">
            Add order
          </p>
          <h2 className="display-font text-3xl font-semibold text-foreground">
            Add Coffee Shop Order
          </h2>
        </div>
        {milkSummary ? (
          <div className="rounded-[1.35rem] border border-[rgba(97,68,44,0.1)] bg-[rgba(255,252,248,0.8)] px-4 py-3 text-sm leading-6 text-muted">
            {milkSummary}
          </div>
        ) : null}
      </div>

      <form
        className="rounded-[1.8rem] border border-[rgba(97,68,44,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,249,242,0.94)_100%)] p-4 sm:p-5 lg:p-6"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(220px,250px)_1fr] xl:items-start">
          <label htmlFor="order-brand" className="space-y-2">
            <FieldLabel>Brand</FieldLabel>
            <InputShell>
              <select
                id="order-brand"
                value={draft.brand}
                onChange={(event) => updateDraft("brand", event.target.value)}
                className="w-full appearance-none bg-transparent text-sm font-medium text-foreground outline-none"
              >
                {coffeeShopBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </InputShell>
          </label>

          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            <SegmentedControl
              label="Drink type"
              options={[
                { label: "Latte", value: "Latte" },
                { label: "Americano", value: "Americano" },
              ]}
              value={draft.drinkType}
              onChange={handleDrinkTypeChange}
              fullWidth
            />

            <SegmentedControl
              label="Temperature"
              options={[
                { label: "Hot", value: "Hot" },
                { label: "Iced", value: "Iced" },
              ]}
              value={draft.temperature}
              onChange={(value) => updateDraft("temperature", value)}
              fullWidth
            />

            {!isAmericano ? (
              <SegmentedControl
                label="Milk type"
                options={[
                  { label: "Normal", value: "Normal" },
                  { label: "Oat", value: "Oat" },
                ]}
                value={draft.milkType === "None" ? "Normal" : draft.milkType}
                onChange={(value) => handleMilkTypeChange(value as MilkType)}
                fullWidth
              />
            ) : (
              <div className="rounded-[1.3rem] border border-[rgba(97,68,44,0.08)] bg-[rgba(255,250,243,0.5)] p-3 opacity-70">
                <SegmentedControl
                  label="Milk type"
                  options={[{ label: "None", value: "None" }]}
                  value="None"
                  onChange={() => {}}
                  disabled
                  fullWidth
                />
              </div>
            )}

            <SegmentedControl
              label="Size"
              options={[
                { label: "Small", value: "Small" },
                { label: "Standard", value: "Standard" },
                { label: "Large", value: "Large" },
              ]}
              value={draft.size}
              onChange={(value) => updateDraft("size", value)}
              fullWidth
            />
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label htmlFor="order-final-price" className="space-y-2">
            <FieldLabel>Final price</FieldLabel>
            <InputShell>
              <input
                id="order-final-price"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={draft.finalPrice}
                onChange={(event) => updateDraft("finalPrice", event.target.value)}
                placeholder="5.90"
                className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
              />
            </InputShell>
          </label>

          <label htmlFor="order-date" className="space-y-2">
            <FieldLabel>Date</FieldLabel>
            <InputShell>
              <input
                id="order-date"
                type="date"
                value={draft.date}
                onChange={(event) => updateDraft("date", event.target.value)}
                className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
              />
            </InputShell>
          </label>

          <div className="space-y-2">
            <FieldLabel>Ready to save</FieldLabel>
            <button
              type="submit"
              className="inline-flex h-[54px] w-full items-center justify-center rounded-[1.25rem] border border-[rgba(97,68,44,0.12)] bg-accent px-5 text-sm font-semibold text-white transition duration-200 hover:bg-accent-strong hover:shadow-[0_14px_28px_rgba(138,75,42,0.16)]"
            >
              Add order
            </button>
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="order-notes" className="space-y-2">
            <FieldLabel>Notes</FieldLabel>
            <InputShell>
              <textarea
                id="order-notes"
                value={draft.notes}
                onChange={(event) => updateDraft("notes", event.target.value)}
                placeholder="Optional notes like cafe location, promo, or cup size details."
                rows={4}
                className="w-full resize-none bg-transparent text-sm leading-7 text-foreground outline-none placeholder:text-muted"
              />
            </InputShell>
          </label>
        </div>

        {message ? (
          <div className="mt-5 rounded-[1.25rem] border border-[rgba(97,68,44,0.1)] bg-[rgba(255,252,248,0.8)] px-4 py-3 text-sm text-foreground">
            {message}
          </div>
        ) : null}
      </form>
    </section>
  );
}

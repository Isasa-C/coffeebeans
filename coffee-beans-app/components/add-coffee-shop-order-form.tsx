"use client";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { type CoffeeShopPriceEntry } from "@/lib/coffee-shop-prices";

type DrinkType = CoffeeShopPriceEntry["drinkType"];
type Temperature = CoffeeShopPriceEntry["temperature"];
type MilkType = CoffeeShopPriceEntry["milkType"];
type Size = CoffeeShopPriceEntry["size"];

type AddCoffeeShopOrderFormProps = {
  onAddOrder: (entry: CoffeeShopPriceEntry) => Promise<void>;
};

type OrderDraft = {
  brand: string;
  customBrand: string;
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
    brand: "The Coffee",
    customBrand: "",
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

function normalizePriceInput(value: string) {
  const trimmedValue = value.replace(/\s+/g, "").replace(/,/g, ".");
  const sanitizedValue = trimmedValue.replace(/[^0-9.]/g, "");
  const firstDotIndex = sanitizedValue.indexOf(".");

  if (firstDotIndex === -1) {
    return sanitizedValue;
  }

  const integerPart = sanitizedValue.slice(0, firstDotIndex + 1);
  const decimalPart = sanitizedValue.slice(firstDotIndex + 1).replace(/\./g, "");

  return `${integerPart}${decimalPart}`;
}

function parsePriceInput(value: string) {
  const normalizedValue = normalizePriceInput(value);

  if (!normalizedValue || normalizedValue === ".") {
    return null;
  }

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function createOrderId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `coffee-order-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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
  const { messages } = useLanguage();
  const copy = messages.coffeePrices;
  const [draft, setDraft] = useState<OrderDraft>(createDefaultDraft);
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<"success" | "error">("success");
  const [recentlyAddedOrder, setRecentlyAddedOrder] = useState<CoffeeShopPriceEntry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAmericano = draft.drinkType === "Americano";
  const isCustomBrand = draft.brand === "Other";

  function updateDraft<K extends keyof OrderDraft>(key: K, value: OrderDraft[K]) {
    if (message) {
      setMessage(null);
    }

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const finalPrice = parsePriceInput(draft.finalPrice);
    const oatMilkExtra =
      !isAmericano && draft.milkType === "Oat"
        ? (parsePriceInput(draft.oatMilkExtra) ?? 0)
        : 0;
    const resolvedBrand = draft.brand === "Other" ? draft.customBrand.trim() : draft.brand;

    if (!resolvedBrand || finalPrice === null || finalPrice <= 0 || !draft.date) {
      setMessageTone("error");
      setMessage(copy.addValidationError);
      return;
    }

    const entry: CoffeeShopPriceEntry = {
      id: createOrderId(),
      brand: resolvedBrand,
      drinkType: draft.drinkType,
      temperature: draft.temperature,
      milkType: isAmericano ? "None" : draft.milkType,
      size: draft.size,
      finalPrice,
      oatMilkExtra,
      date: draft.date,
      notes: draft.notes.trim() || undefined,
    };

    try {
      setIsSubmitting(true);
      await onAddOrder(entry);
      setDraft(createDefaultDraft());
      setMessageTone("success");
      setMessage(copy.addSuccess);
      setRecentlyAddedOrder(entry);
    } catch {
      setMessageTone("error");
      setMessage(copy.addValidationError);
    } finally {
      setIsSubmitting(false);
    }
  }

  const localizedBrandOptions = [
    { value: "The Coffee", label: "The Coffee" },
    { value: "Starbucks", label: "Starbucks" },
    { value: "Noir", label: "Noir" },
    { value: "Other", label: copy.otherBrand },
  ] as const;

  return (
    <section className="card-surface rounded-[2rem] p-5 sm:p-6 lg:p-7">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h2 className="display-font text-3xl font-semibold text-foreground">
            {copy.addCoffeeTitle}
          </h2>
        </div>
      </div>

      <form
        className="rounded-[1.8rem] border border-[rgba(97,68,44,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,249,242,0.94)_100%)] p-4 sm:p-5 lg:p-6"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(260px,320px)_minmax(220px,280px)] xl:items-start">
          <label htmlFor="order-brand" className="space-y-2">
            <FieldLabel>{copy.brand}</FieldLabel>
            <InputShell>
              <select
                id="order-brand"
                value={draft.brand}
                onChange={(event) => updateDraft("brand", event.target.value)}
                className="w-full appearance-none bg-transparent text-sm font-medium text-foreground outline-none"
              >
                {localizedBrandOptions.map((brand) => (
                  <option key={brand.value} value={brand.value}>
                    {brand.label}
                  </option>
                ))}
              </select>
            </InputShell>
          </label>

          {isCustomBrand ? (
            <label htmlFor="order-custom-brand" className="space-y-2">
              <FieldLabel>{copy.otherBrand}</FieldLabel>
              <InputShell>
                <input
                  id="order-custom-brand"
                  type="text"
                  value={draft.customBrand}
                  onChange={(event) => updateDraft("customBrand", event.target.value)}
                  placeholder={copy.otherBrandPlaceholder}
                  className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted"
                />
              </InputShell>
            </label>
          ) : (
            <div className="hidden xl:block" />
          )}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          <SegmentedControl
            label={copy.drinkType}
            options={[
              { label: copy.latte, value: "Latte" },
              { label: copy.americano, value: "Americano" },
            ]}
            value={draft.drinkType}
            onChange={handleDrinkTypeChange}
            fullWidth
          />

          <SegmentedControl
            label={copy.temperature}
            options={[
              { label: copy.hot, value: "Hot" },
              { label: copy.iced, value: "Iced" },
            ]}
            value={draft.temperature}
            onChange={(value) => updateDraft("temperature", value)}
            fullWidth
          />

          {!isAmericano ? (
            <SegmentedControl
              label={copy.milkType}
              options={[
                { label: copy.normal, value: "Normal" },
                { label: copy.oat, value: "Oat" },
              ]}
              value={draft.milkType === "None" ? "Normal" : draft.milkType}
              onChange={(value) => handleMilkTypeChange(value as MilkType)}
              fullWidth
            />
          ) : (
            <div className="rounded-[1.3rem] border border-[rgba(97,68,44,0.08)] bg-[rgba(255,250,243,0.5)] p-3 opacity-70">
              <SegmentedControl
                label={copy.milkType}
                options={[{ label: copy.none, value: "None" }]}
                value="None"
                onChange={() => {}}
                disabled
                fullWidth
              />
            </div>
          )}

          <SegmentedControl
            label={copy.size}
            options={[
              { label: copy.small, value: "Small" },
              { label: copy.standard, value: "Standard" },
              { label: copy.large, value: "Large" },
            ]}
            value={draft.size}
            onChange={(value) => updateDraft("size", value)}
            fullWidth
          />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <label htmlFor="order-date" className="space-y-2">
            <FieldLabel>{copy.date}</FieldLabel>
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

          <label htmlFor="order-final-price" className="space-y-2">
            <FieldLabel>{copy.priceEur}</FieldLabel>
            <InputShell>
              <input
                id="order-final-price"
                type="text"
                inputMode="decimal"
                value={draft.finalPrice}
                onChange={(event) => updateDraft("finalPrice", event.target.value)}
                placeholder="5.90"
                className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
              />
            </InputShell>
          </label>

          <div className="space-y-2 md:min-w-[160px]">
            <FieldLabel>&nbsp;</FieldLabel>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-[54px] w-full items-center justify-center rounded-[1.25rem] border border-[rgba(97,68,44,0.12)] bg-accent px-5 text-sm font-semibold text-white transition duration-200 hover:bg-accent-strong hover:shadow-[0_14px_28px_rgba(138,75,42,0.16)]"
            >
              {isSubmitting ? "Saving..." : copy.add}
            </button>
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="order-notes" className="space-y-2">
            <FieldLabel>{copy.notes}</FieldLabel>
            <InputShell>
              <textarea
                id="order-notes"
                value={draft.notes}
                onChange={(event) => updateDraft("notes", event.target.value)}
                placeholder={copy.notesPlaceholder}
                rows={4}
                className="w-full resize-none bg-transparent text-sm leading-7 text-foreground outline-none placeholder:text-muted"
              />
            </InputShell>
          </label>
        </div>

        {message ? (
          <div
            className={`mt-5 rounded-[1.25rem] px-4 py-3 text-sm ${
              messageTone === "success"
                ? "border border-[rgba(97,68,44,0.1)] bg-[rgba(255,252,248,0.8)] text-foreground"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        ) : null}

        {recentlyAddedOrder ? (
          <div className="mt-5 rounded-[1.4rem] border border-[rgba(97,68,44,0.12)] bg-[rgba(255,252,248,0.88)] p-4 shadow-[0_14px_30px_rgba(76,44,23,0.05)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-accent/70 uppercase">
                  {copy.addSuccess}
                </p>
                <h3 className="text-lg font-semibold text-foreground">
                  {recentlyAddedOrder.brand}
                </h3>
                <p className="text-sm text-muted">
                  {recentlyAddedOrder.drinkType === "Americano"
                    ? `${recentlyAddedOrder.temperature} ${recentlyAddedOrder.drinkType}`
                    : `${recentlyAddedOrder.temperature} ${recentlyAddedOrder.milkType} ${recentlyAddedOrder.drinkType}`}
                </p>
              </div>
              <div className="rounded-full bg-[rgba(138,75,42,0.12)] px-3 py-1 text-sm font-semibold text-accent">
                {new Intl.NumberFormat(messages.locale, {
                  style: "currency",
                  currency: "EUR",
                  minimumFractionDigits: 2,
                }).format(recentlyAddedOrder.finalPrice)}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <PreviewMeta label={copy.brand} value={recentlyAddedOrder.brand} />
              <PreviewMeta label={copy.size} value={recentlyAddedOrder.size} />
              <PreviewMeta label={copy.date} value={recentlyAddedOrder.date} />
            </div>
          </div>
        ) : null}
      </form>
    </section>
  );
}

function PreviewMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.05rem] border border-[rgba(97,68,44,0.08)] bg-white/72 px-3 py-3">
      <p className="text-[10px] font-semibold tracking-[0.16em] text-accent/70 uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

"use client";

import { type KeyboardEvent, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { type BeanRecord } from "@/lib/utils";

type BeanCardProps = {
  bean: BeanRecord;
  priceContext: PriceContext | null;
};

type PriceContext = {
  min: number;
  max: number;
  avg: number;
};

type PriceLabel = "Low" | "Average" | "High" | "Unique";

const roastDrinkMatches: Record<
  string,
  Array<{ name: string; recipe: string }>
> = {
  Light: [
    { name: "Pour-over", recipe: "15g coffee + 250ml water" },
    {
      name: "Cold brew",
      recipe: "1:8 ratio (for example 50g coffee + 400ml water, steep 12-18h)",
    },
    {
      name: "Orange / coconut coffee",
      recipe: "36g espresso + 100-150ml juice or coconut water",
    },
  ],
  "Medium-Light": [
    { name: "Pour-over", recipe: "15g coffee + 250ml water" },
    {
      name: "Cold brew",
      recipe: "1:8 ratio (for example 50g coffee + 400ml water, steep 12-18h)",
    },
    {
      name: "Orange / coconut coffee",
      recipe: "36g espresso + 100-150ml juice or coconut water",
    },
  ],
  Medium: [
    { name: "Dirty", recipe: "36g espresso + 150-200ml cold milk" },
    { name: "Americano", recipe: "36g espresso + 150-250ml water" },
    { name: "Latte", recipe: "36g espresso + 180-240ml milk" },
    { name: "Flat white", recipe: "36g espresso + 120-160ml milk" },
  ],
  "Medium-Dark": [
    { name: "Latte", recipe: "36g espresso + 180-240ml milk" },
    { name: "Flat white", recipe: "36g espresso + 120-160ml milk" },
    {
      name: "Cappuccino",
      recipe: "36g espresso + 120-150ml milk (thick foam)",
    },
    {
      name: "Vanilla / hazelnut / mocha",
      recipe: "36g espresso + milk + 10-20g syrup",
    },
    { name: "Espresso", recipe: "36g espresso" },
  ],
  Dark: [
    { name: "Americano", recipe: "36g espresso + 150-250ml water" },
    { name: "Espresso", recipe: "36g espresso" },
  ],
};

function getBeanPosition(unitPrice: number, context: PriceContext | null) {
  if (!context || context.max === context.min) {
    return 50;
  }

  return Math.min(
    Math.max(((unitPrice - context.min) / (context.max - context.min)) * 100, 0),
    100,
  );
}

function getBeanLabel(unitPrice: number, context: PriceContext | null): PriceLabel {
  if (!context || context.max === context.min) {
    return "Unique";
  }

  const range = context.max - context.min;

  if (unitPrice <= context.min + range * 0.33) {
    return "Low";
  }

  if (unitPrice >= context.max - range * 0.33) {
    return "High";
  }

  return "Average";
}

function getPriceLabelClass(label: PriceLabel) {
  if (label === "Low") {
    return "bg-[#e8efe0] text-[#4a6a30]";
  }

  if (label === "High") {
    return "bg-[#f5d8d0] text-[#8a3520]";
  }

  return "bg-[#f5e6d8] text-[#b35530]";
}

function getRoastColor(roast: string) {
  const normalizedRoast = roast.toLowerCase();

  if (normalizedRoast.includes("light") && normalizedRoast.includes("medium")) {
    return "#b8855a";
  }

  if (normalizedRoast.includes("light")) {
    return "#d4a96a";
  }

  if (normalizedRoast.includes("dark") && normalizedRoast.includes("medium")) {
    return "#5c3d1e";
  }

  if (normalizedRoast.includes("dark")) {
    return "#2a1a10";
  }

  return "#8c5a3a";
}

function formatMoney(value: number, locale: string, digits = 2) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function formatUnitPrice(value: number, locale: string) {
  return `${formatMoney(value, locale, 3)}/g`;
}

function PriceRangeBar({
  context,
  label,
  locale,
  position,
  unitPrice,
}: {
  context: PriceContext | null;
  label: PriceLabel;
  locale: string;
  position: number;
  unitPrice: number;
}) {
  const minPrice = context?.min ?? unitPrice;
  const maxPrice = context?.max ?? unitPrice;

  return (
    <div className="mt-3 rounded-xl border-[0.5px] border-line p-3.5">
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#9b7b62]">
          Unit price
        </span>
        <span className="ml-auto mr-1 font-serif text-base text-foreground">
          {formatUnitPrice(unitPrice, locale)}
        </span>
        <span
          className={`rounded-full px-2 py-1 text-[11px] font-medium ${getPriceLabelClass(label)}`}
        >
          {label}
        </span>
      </div>

      <div className="relative mb-2 h-1.5 rounded-full bg-[linear-gradient(to_right,#c5d8b5_0%,#f5e6d8_50%,#f0c5b5_100%)]">
        <span
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground bg-white shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
          style={{ left: `${position}%` }}
        />
      </div>

      <div className="flex justify-between text-[11px] text-[#9b7b62]">
        <span>Low {formatUnitPrice(minPrice, locale)}</span>
        <span>High {formatUnitPrice(maxPrice, locale)}</span>
      </div>
    </div>
  );
}

function RoastBeanIcon({ color }: { color: string }) {
  return (
    <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <svg
        aria-hidden="true"
        className="h-[18px] w-[18px]"
        fill={color}
        viewBox="0 0 48 48"
      >
        <path d="M31.7 5.8c7.5 3.5 9.4 14.7 4.2 25.1-5.2 10.3-15.5 15.9-23 12.4S3.5 28.6 8.7 18.2C13.9 7.9 24.2 2.3 31.7 5.8Zm-1.4 3c-4.9 5.8-6.8 11.3-5.8 16.7.8 4.5-.3 8.8-3.5 12.9 4.4-1.8 8.7-5.8 11.8-11.9 4.4-8.8 3.3-17.1-2.5-17.7Z" />
      </svg>
    </span>
  );
}

export function BeanCard({ bean, priceContext }: BeanCardProps) {
  const { messages } = useLanguage();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRecommendationsExpanded, setIsRecommendationsExpanded] = useState(false);
  const safeWeight = bean.weight > 0 ? bean.weight : 250;
  const unitPrice = bean.price / safeWeight;
  const pricePosition = getBeanPosition(unitPrice, priceContext);
  const priceLabel = getBeanLabel(unitPrice, priceContext);
  const roastMatches = roastDrinkMatches[bean.bestFor] ?? roastDrinkMatches.Medium;
  const visibleRoastMatches = isRecommendationsExpanded
    ? roastMatches
    : roastMatches.slice(0, 3);
  const hiddenRoastMatchCount = Math.max(roastMatches.length - 3, 0);
  const hasCustomImage = Boolean(bean.imageUrl) && bean.imageUrl !== "/default-bean.png";
  const imageUrl = hasCustomImage ? bean.imageUrl : "/default-bean.png";
  const roastLabel =
    messages.bestForOptions[bean.bestFor as keyof typeof messages.bestForOptions] ??
    bean.bestFor;
  const roastColor = getRoastColor(bean.bestFor);

  function toggleFlip() {
    setIsFlipped((current) => !current);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFlip();
    }
  }

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`${bean.brand} - tap to flip`}
      onClick={toggleFlip}
      onKeyDown={handleKeyDown}
      className="group h-full min-h-[560px] cursor-pointer [perspective:1200px]"
    >
      <div
        className={`relative h-full min-h-[560px] w-full rounded-[24px] transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[24px] border-[0.5px] border-line bg-white shadow-[0_12px_40px_rgba(76,44,23,0.08)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
          <div
            className="relative basis-4/5 bg-[#f0ebe4] bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          >
            <RoastBeanIcon color={roastColor} />
          </div>
          <div className="relative flex basis-1/5 flex-col justify-center bg-white px-4 py-3">
            <h3 className="font-serif text-[22px] font-medium leading-tight text-[#2f241c]">
              {bean.brand}
            </h3>
            <p className="mt-0.5 font-serif text-lg font-normal text-muted">
              {formatMoney(bean.price, messages.locale)}
            </p>
            <span className="absolute bottom-2 right-2 rounded-full bg-white/85 px-2 py-1 text-[10px] font-medium text-accent backdrop-blur-[8px]">
              Tap to flip ↻
            </span>
          </div>
        </div>

        <div className="absolute inset-0 flex rotate-y-180 flex-col overflow-hidden rounded-[24px] border-[0.5px] border-line bg-white p-6 shadow-[0_12px_40px_rgba(76,44,23,0.08)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div>
            <h3 className="font-serif text-[22px] font-medium leading-7 text-[#2f241c]">
              {bean.brand}
            </h3>
            <p className="mt-1 text-xs leading-5 text-[#9b7b62]">
              {messages.addedOn}{" "}
              {new Date(bean.createdAt).toLocaleDateString(messages.locale)}
            </p>
          </div>

          <dl className="mt-5">
            <div className="grid grid-cols-3 border-y-[0.5px] border-line py-4">
              <div className="border-r-[0.5px] border-line pr-3">
                <dt className="mb-1.5 text-[11px] uppercase tracking-[0.15em] text-[#9b7b62]">
                  {messages.priceLabel}
                </dt>
                <dd className="font-serif text-lg font-medium text-[#2f241c]">
                  {formatMoney(bean.price, messages.locale)}
                </dd>
              </div>
              <div className="border-r-[0.5px] border-line px-3">
                <dt className="mb-1.5 text-[11px] uppercase tracking-[0.15em] text-[#9b7b62]">
                  {messages.weightLabel}
                </dt>
                <dd className="font-serif text-lg font-medium text-[#2f241c]">
                  {safeWeight}g
                </dd>
              </div>
              <div className="pl-3">
                <dt className="mb-1.5 text-[11px] uppercase tracking-[0.15em] text-[#9b7b62]">
                  {messages.roastLabel}
                </dt>
                <dd className="font-serif text-lg font-medium text-[#2f241c]">
                  {roastLabel}
                </dd>
              </div>
            </div>
          </dl>

          <PriceRangeBar
            context={priceContext}
            label={priceLabel}
            locale={messages.locale}
            position={pricePosition}
            unitPrice={unitPrice}
          />

          <div className="mt-4">
            <p className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[#9b7b62]">
              Good for
            </p>
            <div className="flex items-baseline gap-2">
              <p className="min-w-0 flex-1 text-sm leading-6 text-[#2f241c]">
                {visibleRoastMatches.map((drink) => drink.name).join(" · ")}
              </p>
              {!isRecommendationsExpanded && hiddenRoastMatchCount > 0 ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsRecommendationsExpanded(true);
                  }}
                  className="shrink-0 text-[13px] font-semibold text-muted transition hover:underline hover:underline-offset-4"
                >
                  + {hiddenRoastMatchCount} more
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-4 rounded-xl border-[0.5px] border-dashed border-line px-3.5 py-3">
            <p className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[#9b7b62]">
              Notes
            </p>
            <p className="min-h-[44px] text-[13px] leading-6 text-muted">
              {bean.comments || "Add your notes after brewing..."}
            </p>
          </div>

          <p className="mt-auto pt-4 text-center text-[11px] font-medium text-accent">
            ← Back
          </p>
        </div>
      </div>
    </article>
  );
}

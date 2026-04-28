"use client";

import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useRef,
  useState,
  useTransition,
} from "react";
import { useLanguage } from "@/components/language-provider";
import { useRouter } from "next/navigation";
import { getBeanFormValues } from "@/lib/bean-form";
import { type BeanRecord } from "@/lib/utils";
import { type BeanUpdateErrors } from "@/lib/validations/bean";
import { BeanFormFields } from "./bean-form-fields";

type BeanCardProps = {
  bean: BeanRecord;
  priceStats: {
    min: number;
    max: number;
    average: number;
    savedBeanCount: number;
    averageSavedUnitPrice: number;
  };
};

const roastDrinkMatches: Record<
  string,
  Array<{ name: string; recipe: string }>
> = {
  Light: [
    { name: "Pour-over", recipe: "15g coffee + 250ml water" },
    { name: "Cold brew", recipe: "1:8 ratio (for example 50g coffee + 400ml water, steep 12-18h)" },
    { name: "Orange / coconut coffee", recipe: "36g espresso + 100-150ml juice or coconut water" },
  ],
  "Medium-Light": [
    { name: "Pour-over", recipe: "15g coffee + 250ml water" },
    { name: "Cold brew", recipe: "1:8 ratio (for example 50g coffee + 400ml water, steep 12-18h)" },
    { name: "Orange / coconut coffee", recipe: "36g espresso + 100-150ml juice or coconut water" },
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
    { name: "Cappuccino", recipe: "36g espresso + 120-150ml milk (thick foam)" },
    { name: "Vanilla / hazelnut / mocha", recipe: "36g espresso + milk + 10-20g syrup" },
    { name: "Espresso", recipe: "36g espresso" },
  ],
  Dark: [
    { name: "Americano", recipe: "36g espresso + 150-250ml water" },
    { name: "Espresso", recipe: "36g espresso" },
  ],
};

export function BeanCard({ bean, priceStats }: BeanCardProps) {
  const router = useRouter();
  const { messages } = useLanguage();
  const [currentBean, setCurrentBean] = useState(bean);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isNotesEditing, setIsNotesEditing] = useState(!bean.comments);
  const [noteDraft, setNoteDraft] = useState(bean.comments ?? "");
  const [isRecommendationsExpanded, setIsRecommendationsExpanded] = useState(false);
  const [isShareTooltipVisible, setIsShareTooltipVisible] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formValues, setFormValues] = useState(() => getBeanFormValues(bean));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<BeanUpdateErrors>({});
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const shareTooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const priceRange = Math.max(priceStats.max - priceStats.min, 1);
  const pricePosition = ((currentBean.price - priceStats.min) / priceRange) * 100;
  const priceDifference = currentBean.price - priceStats.average;
  const safeWeight = currentBean.weight > 0 ? currentBean.weight : 250;
  const unitPrice = currentBean.price / safeWeight;
  const roastMatches =
    roastDrinkMatches[currentBean.bestFor] ?? roastDrinkMatches.Medium;
  const visibleRoastMatches = isRecommendationsExpanded
    ? roastMatches
    : roastMatches.slice(0, 2);
  const hiddenRoastMatchCount = Math.max(roastMatches.length - 2, 0);
  const priceTrendLabel =
    Math.abs(priceDifference) < 0.5
      ? messages.priceTrendAverage
      : priceDifference > 0
        ? messages.priceTrendAboveAverage
        : messages.priceTrendBelowAverage;

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;

    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);
    setFieldErrors((current) => ({
      ...current,
      image: undefined,
    }));
  }

  function handleQuickPickBrand(brand: string) {
    setFormValues((current) => ({
      ...current,
      brand,
    }));
    setFieldErrors((current) => ({
      ...current,
      brand: undefined,
    }));
  }

  function handleStartEdit() {
    setFormValues(getBeanFormValues(currentBean));
    setImageFile(null);
    setFieldErrors({});
    setActionError(null);
    setActionMessage(null);
    setIsEditing(true);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setFormValues(getBeanFormValues(currentBean));
    setImageFile(null);
    setFieldErrors({});
    setActionError(null);
    setActionMessage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  function buildBeanUpdatePayload(overrides: Partial<Pick<BeanRecord, "comments" | "rating">>) {
    const payload = new FormData();

    payload.append("brand", currentBean.brand);
    payload.append("price", currentBean.price.toString());
    payload.append("quantity", currentBean.quantity.toString());
    payload.append("weight", safeWeight.toString());
    payload.append("rating", (overrides.rating ?? currentBean.rating).toString());
    payload.append("bestFor", currentBean.bestFor);
    payload.append("comments", overrides.comments ?? currentBean.comments ?? "");

    return payload;
  }

  function saveBeanDetails(overrides: Partial<Pick<BeanRecord, "comments" | "rating">>) {
    setActionError(null);
    setActionMessage(null);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/beans/${bean.id}`, {
          method: "PATCH",
          body: buildBeanUpdatePayload(overrides),
        });

        const result = (await response.json()) as {
          data?: BeanRecord;
          error?: string;
        };

        if (!response.ok || !result.data) {
          setActionError(result.error ?? "Unable to update this bean.");
          return;
        }

        setCurrentBean(result.data);
        setFormValues(getBeanFormValues(result.data));
        setNoteDraft(result.data.comments ?? "");
      } catch {
        setActionError("Network error while updating this bean. Please try again.");
      }
    });
  }

  function handleNotesSave() {
    const nextComments = noteDraft.trim();

    if ((currentBean.comments ?? "") === nextComments) {
      setIsNotesEditing(!nextComments);
      return;
    }

    saveBeanDetails({
      comments: nextComments,
    });
    setIsNotesEditing(!nextComments);
  }

  function handleNotesKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleNotesSave();
    }
  }

  function handleRatingChange(nextRating: number) {
    saveBeanDetails({
      rating: nextRating,
    });
  }

  function handleShareClick() {
    setIsShareTooltipVisible(true);

    if (shareTooltipTimeoutRef.current) {
      clearTimeout(shareTooltipTimeoutRef.current);
    }

    shareTooltipTimeoutRef.current = setTimeout(() => {
      setIsShareTooltipVisible(false);
    }, 1800);
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActionError(null);
    setActionMessage(null);

    const payload = new FormData();
    payload.append("brand", formValues.brand);
    payload.append("price", formValues.price);
    payload.append("quantity", formValues.quantity);
    payload.append("weight", formValues.weight);
    payload.append("rating", formValues.rating);
    payload.append("bestFor", formValues.bestFor);
    payload.append("comments", formValues.comments);

    if (imageFile) {
      payload.append("image", imageFile);
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/beans/${bean.id}`, {
          method: "PATCH",
          body: payload,
        });

        const result = (await response.json()) as {
          error?: string;
          fieldErrors?: BeanUpdateErrors;
          message?: string;
          data?: BeanRecord;
        };

        if (!response.ok) {
          setFieldErrors(result.fieldErrors ?? {});
          setActionError(result.error ?? messages.updateError);
          return;
        }

        if (result.data) {
          setCurrentBean(result.data);
          setFormValues(getBeanFormValues(result.data));
        }
        setFieldErrors({});
        setImageFile(null);
        setActionMessage(result.message ?? messages.updatedMessage);
        setIsEditing(false);
        if (imageInputRef.current) {
          imageInputRef.current.value = "";
        }
        router.refresh();
      } catch {
        setActionError(messages.updateNetworkError);
      }
    });
  }

  function handleDelete() {
    setActionError(null);
    setActionMessage(null);

    const confirmed = window.confirm(
      messages.deleteConfirm,
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/beans/${bean.id}`, {
          method: "DELETE",
        });

        const result = (await response.json()) as {
          error?: string;
          message?: string;
        };

        if (!response.ok) {
          setActionError(result.error ?? messages.deleteError);
          return;
        }

        setActionMessage(result.message ?? messages.deletedMessage);
        setIsDeleted(true);
        window.setTimeout(() => {
          router.refresh();
        }, 700);
      } catch {
        setActionError(messages.deleteNetworkError);
      }
    });
  }

  if (isEditing) {
    return (
      <article className="card-surface rounded-[1.75rem] p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-accent uppercase">
              {messages.editBean}
            </p>
            <h3 className="display-font mt-2 text-2xl font-semibold">
              {currentBean.brand}
            </h3>
          </div>
          <button
            type="button"
            onClick={handleCancelEdit}
            className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted transition hover:bg-white/60"
          >
            {messages.cancel}
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleUpdate}>
          <BeanFormFields
            fieldErrors={fieldErrors}
            formValues={formValues}
            imageInputRef={imageInputRef}
            onChange={handleChange}
            onImageChange={handleImageChange}
            onQuickPickBrand={handleQuickPickBrand}
          />

          {actionError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {actionError}
            </div>
          ) : null}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? messages.savingChanges : messages.saveChanges}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-full border border-line px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {messages.close}
            </button>
          </div>
        </form>
      </article>
    );
  }

  if (isDeleted) {
    return (
      <article className="card-surface rounded-[1.75rem] px-5 py-8 text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-accent uppercase">
          {messages.beanRemoved}
        </p>
        <p className="mt-3 text-sm leading-7 text-muted">
          {actionMessage ?? messages.deletedMessage}
        </p>
      </article>
    );
  }

  return (
    <article className="card-surface flex h-full flex-col overflow-hidden rounded-[1.75rem]">
      <div className="bg-[#f1e4d3] p-4">
        <div className="relative mx-auto aspect-square max-w-[240px] overflow-hidden rounded-[1.25rem] border border-line bg-[#e7d6c4]">
          <div className="absolute inset-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentBean.imageUrl}
              alt={`${currentBean.brand} ${messages.savedBeans}`}
              className="h-full w-full object-contain transition duration-500 hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col space-y-5 p-5">
        <div className="grid grid-cols-[1fr_auto] items-start gap-4">
          <div className="min-h-[4.25rem] space-y-1">
            <h3 className="display-font text-2xl font-semibold">{currentBean.brand}</h3>
            <p className="text-sm text-muted">
              {messages.addedOn} {new Date(currentBean.createdAt).toLocaleDateString(messages.locale)}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="whitespace-nowrap rounded-full bg-[rgba(138,75,42,0.1)] px-3 py-1 text-sm font-semibold text-accent">
              {currentBean.rating > 0 ? `${currentBean.rating.toFixed(1)} / 5.0` : "Unrated"}
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={handleShareClick}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition hover:bg-white/65 hover:text-accent"
                aria-label="Sharing coming soon"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
                  <path d="M12 16V4" />
                  <path d="m8 8 4-4 4 4" />
                </svg>
              </button>
              {isShareTooltipVisible ? (
                <div className="absolute right-0 top-10 z-10 whitespace-nowrap rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-muted shadow-[0_12px_24px_rgba(76,44,23,0.12)]">
                  Sharing coming soon
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex min-h-[5.5rem] flex-col justify-between rounded-2xl border border-line bg-card p-3">
            <dt className="text-muted">{messages.priceLabel}</dt>
            <dd className="mt-1 text-base font-semibold text-foreground">
              {new Intl.NumberFormat(messages.locale, {
                style: "currency",
                currency: "EUR",
              }).format(currentBean.price)}
            </dd>
          </div>
          <div className="flex min-h-[5.5rem] flex-col justify-between rounded-2xl border border-line bg-card p-3">
            <dt className="text-muted">{messages.weightLabel}</dt>
            <dd className="mt-1 text-base font-semibold text-foreground">
              {safeWeight} g
            </dd>
          </div>
          <div className="flex min-h-[5.5rem] flex-col justify-between rounded-2xl border border-line bg-card p-3">
            <dt className="text-muted">{messages.roastLabel}</dt>
            <dd className="mt-1 text-base font-semibold text-foreground">
              {messages.bestForOptions[currentBean.bestFor as keyof typeof messages.bestForOptions] ?? currentBean.bestFor}
            </dd>
          </div>
        </dl>

        <div className="rounded-2xl border border-line bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-foreground">
              {messages.priceTrend}
            </p>
            <span className="rounded-full bg-[rgba(138,75,42,0.12)] px-3 py-1 text-xs font-semibold text-accent">
              {priceTrendLabel}
            </span>
          </div>
          <div className="mt-3 text-sm text-muted">
            {messages.unitPriceLabel}{" "}
            <span className="font-semibold text-foreground">
              {new Intl.NumberFormat(messages.locale, {
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 3,
              }).format(unitPrice)}
              /g
            </span>
          </div>
          <div className="mt-4 h-2 rounded-full bg-[rgba(138,75,42,0.12)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#b97b4f] to-[#5c3520]"
              style={{ width: `${Math.min(Math.max(pricePosition, 8), 100)}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted">
            <span>{messages.priceTrendLow}</span>
            <span>{messages.priceTrendHigh}</span>
          </div>
          <p className="mt-2 text-xs leading-5 text-muted">
            {priceStats.savedBeanCount > 1
              ? `Compared to My beans — avg €${priceStats.averageSavedUnitPrice.toFixed(3)}/g`
              : "Add more beans to compare prices"}
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-card p-4">
          <p className="text-sm font-semibold text-foreground">
            {messages.recommendedLabel}
          </p>
          <div className="mt-4 space-y-3">
            {visibleRoastMatches.map((drink) => (
              <div
                key={`${currentBean.id}-${drink.name}`}
                className="rounded-2xl border border-dashed border-line bg-white/55 px-4 py-3"
              >
                <p className="text-sm font-semibold text-foreground">{drink.name}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{drink.recipe}</p>
              </div>
            ))}
          </div>
          {!isRecommendationsExpanded && hiddenRoastMatchCount > 0 ? (
            <button
              type="button"
              onClick={() => setIsRecommendationsExpanded(true)}
              className="mt-3 text-sm font-semibold text-accent underline decoration-2 underline-offset-4"
            >
              + {hiddenRoastMatchCount} more drinks
            </button>
          ) : null}
          {isRecommendationsExpanded && hiddenRoastMatchCount > 0 ? (
            <button
              type="button"
              onClick={() => setIsRecommendationsExpanded(false)}
              className="mt-3 text-sm font-semibold text-accent underline decoration-2 underline-offset-4"
            >
              Hide extra drinks
            </button>
          ) : null}
        </div>

        <div className="space-y-3">
          <div className="group relative flex min-h-[60px] w-full flex-col rounded-2xl border border-dashed border-line bg-white/50 p-4">
            {isNotesEditing || !currentBean.comments ? (
              <textarea
                className="min-h-[60px] w-full resize-none bg-transparent text-[13px] leading-6 text-muted outline-none placeholder:text-muted"
                placeholder="Add your tasting notes after brewing..."
                value={noteDraft}
                onChange={(event) => setNoteDraft(event.target.value)}
                onBlur={handleNotesSave}
                onKeyDown={handleNotesKeyDown}
                disabled={isPending}
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsNotesEditing(true)}
                className="min-h-[60px] w-full pr-8 text-left text-[13px] leading-6 text-muted"
              >
                {currentBean.comments}
              </button>
            )}
            {currentBean.comments && !isNotesEditing ? (
              <button
                type="button"
                onClick={() => setIsNotesEditing(true)}
                className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-line bg-white/75 text-muted opacity-0 transition group-hover:opacity-100 hover:text-accent"
                aria-label="Edit tasting notes"
              >
                <svg
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </button>
            ) : null}
          </div>

          <div>
            <div className="flex items-center gap-1" aria-label="Rate after brewing">
              {[1, 2, 3, 4, 5].map((ratingValue) => {
                const isFilled = currentBean.rating >= ratingValue;

                return (
                  <button
                    key={ratingValue}
                    type="button"
                    onClick={() => handleRatingChange(ratingValue)}
                    className={`text-xl leading-none transition ${
                      isFilled ? "text-accent" : "text-muted/45 hover:text-accent"
                    }`}
                    aria-label={`Rate ${ratingValue} out of 5`}
                    disabled={isPending}
                  >
                    ★
                  </button>
                );
              })}
            </div>
            {currentBean.rating <= 0 ? (
              <p className="mt-1 text-[13px] text-muted">Rate after your first brew</p>
            ) : null}
          </div>
        </div>

        {actionError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </div>
        ) : null}

        {actionMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {actionMessage}
          </div>
        ) : null}

        <div className="mt-auto flex gap-3">
          <button
            type="button"
            onClick={handleStartEdit}
            disabled={isPending}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-line px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-white/65 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {messages.edit}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? messages.working : messages.delete}
          </button>
        </div>
      </div>
    </article>
  );
}

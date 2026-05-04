"use client";

import {
  ChangeEvent,
  CSSProperties,
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

export function BeanCard({ bean }: BeanCardProps) {
  const router = useRouter();
  const { messages } = useLanguage();
  const [currentBean, setCurrentBean] = useState(bean);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isNotesEditing, setIsNotesEditing] = useState(!bean.comments);
  const [isNotesFocused, setIsNotesFocused] = useState(false);
  const [noteDraft, setNoteDraft] = useState(bean.comments ?? "");
  const [isRecommendationsExpanded, setIsRecommendationsExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formValues, setFormValues] = useState(() => getBeanFormValues(bean));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<BeanUpdateErrors>({});
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const safeWeight = currentBean.weight > 0 ? currentBean.weight : 250;
  const unitPrice = currentBean.price / safeWeight;
  const costPerCup = unitPrice * 15;
  const roastMatches =
    roastDrinkMatches[currentBean.bestFor] ?? roastDrinkMatches.Medium;
  const visibleRoastMatches = isRecommendationsExpanded
    ? roastMatches
    : roastMatches.slice(0, 3);
  const hiddenRoastMatchCount = Math.max(roastMatches.length - 3, 0);
  const hasCustomImage =
    Boolean(currentBean.imageUrl) && currentBean.imageUrl !== "/default-bean.png";
  const detailCellStyle: CSSProperties = {
    borderColor: "var(--color-border-tertiary, var(--line))",
    borderWidth: "0.5px",
  };

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
    setIsNotesFocused(false);
  }

  function handleNotesKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleNotesSave();
    }
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
      <div className="h-[260px] w-full overflow-hidden bg-[#f0ebe4] sm:h-[300px]">
        {hasCustomImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentBean.imageUrl}
              alt={`${currentBean.brand} ${messages.savedBeans}`}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              aria-hidden="true"
              className="h-10 w-10 text-muted/55"
              fill="currentColor"
              viewBox="0 0 48 48"
            >
              <path d="M31.7 5.8c7.5 3.5 9.4 14.7 4.2 25.1-5.2 10.3-15.5 15.9-23 12.4S3.5 28.6 8.7 18.2C13.9 7.9 24.2 2.3 31.7 5.8Zm-1.4 3c-4.9 5.8-6.8 11.3-5.8 16.7.8 4.5-.3 8.8-3.5 12.9 4.4-1.8 8.7-5.8 11.8-11.9 4.4-8.8 3.3-17.1-2.5-17.7Z" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-5 p-5 font-sans">
        <div>
          <h3
            className="text-[20px] leading-7 font-normal text-[#3b2416]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            {currentBean.brand}
          </h3>
          <p className="mt-1 text-xs leading-5 text-muted">
            {messages.addedOn}{" "}
            {new Date(currentBean.createdAt).toLocaleDateString(messages.locale)}
          </p>
        </div>

        <dl className="text-sm">
          <div className="grid grid-cols-3">
            <div className="border border-solid px-3 py-2.5" style={detailCellStyle}>
              <dt className="text-[11px] leading-4 text-muted">{messages.priceLabel}</dt>
              <dd className="mt-1 text-[13px] font-semibold text-foreground">
                {new Intl.NumberFormat(messages.locale, {
                  style: "currency",
                  currency: "EUR",
                }).format(currentBean.price)}
              </dd>
            </div>
            <div className="border border-solid px-3 py-2.5" style={detailCellStyle}>
              <dt className="text-[11px] leading-4 text-muted">{messages.weightLabel}</dt>
              <dd className="mt-1 text-[13px] font-semibold text-foreground">
                {safeWeight} g
              </dd>
            </div>
            <div className="border border-solid px-3 py-2.5" style={detailCellStyle}>
              <dt className="text-[11px] leading-4 text-muted">{messages.roastLabel}</dt>
              <dd className="mt-1 text-[13px] font-semibold text-foreground">
                {messages.bestForOptions[currentBean.bestFor as keyof typeof messages.bestForOptions] ?? currentBean.bestFor}
              </dd>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="border border-solid px-3 py-2.5" style={detailCellStyle}>
              <dt className="text-[11px] leading-4 text-muted">{messages.unitPriceLabel}</dt>
              <dd className="mt-1 text-[13px] font-semibold text-foreground">
                {new Intl.NumberFormat(messages.locale, {
                  style: "currency",
                  currency: "EUR",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 3,
                }).format(unitPrice)}
                /g
              </dd>
            </div>
            <div className="border border-solid px-3 py-2.5" style={detailCellStyle}>
              <dt className="text-[11px] leading-4 text-muted">Cost per cup</dt>
              <dd className="mt-1 text-[13px] font-semibold text-foreground">
                {new Intl.NumberFormat(messages.locale, {
                  style: "currency",
                  currency: "EUR",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(costPerCup)}
              </dd>
            </div>
          </div>
        </dl>

        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
            Good for
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="min-w-0 flex-1 truncate text-[13px] leading-5 text-[#3b2416]">
              {visibleRoastMatches.map((drink) => drink.name).join(" · ")}
            </p>
            {!isRecommendationsExpanded && hiddenRoastMatchCount > 0 ? (
              <button
                type="button"
                onClick={() => setIsRecommendationsExpanded(true)}
                className="shrink-0 text-[13px] font-semibold text-muted transition hover:underline hover:underline-offset-4"
              >
                + {hiddenRoastMatchCount} more
              </button>
            ) : null}
          </div>
        </div>

        <div className="group relative flex min-h-[76px] w-full flex-col rounded-xl border border-dashed border-line px-3 py-2.5">
          {isNotesEditing || !currentBean.comments ? (
            <textarea
              className={`w-full resize-none bg-transparent text-[13px] leading-6 text-muted outline-none transition-[height] duration-200 ease-in-out placeholder:text-muted ${
                isNotesFocused ? "h-[100px]" : "h-[44px]"
              }`}
              placeholder="Add your notes after brewing..."
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
              onFocus={() => setIsNotesFocused(true)}
              onBlur={handleNotesSave}
              onKeyDown={handleNotesKeyDown}
              disabled={isPending}
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsNotesEditing(true);
                setIsNotesFocused(true);
              }}
              className="min-h-[44px] w-full text-left text-[13px] leading-6 text-muted"
            >
              {currentBean.comments}
            </button>
          )}
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

        <div
          className="mt-auto grid grid-cols-3 pt-3"
          style={{
            borderTop: "0.5px solid var(--color-border-tertiary, var(--line))",
          }}
        >
          <button
            type="button"
            onClick={handleStartEdit}
            disabled={isPending}
            className="inline-flex items-center justify-center px-3 py-3 text-[13px] font-semibold text-[#5d4636] transition hover:text-accent disabled:cursor-not-allowed disabled:opacity-70"
          >
            {messages.edit}
          </button>
          <button
            type="button"
            onClick={() => setIsRecommendationsExpanded((current) => !current)}
            className="inline-flex items-center justify-center px-3 py-3 text-[13px] font-semibold text-[#5d4636] transition hover:text-accent"
          >
            Recipes
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex items-center justify-center px-3 py-3 text-[13px] font-semibold text-red-700/75 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? messages.working : messages.delete}
          </button>
        </div>
      </div>
    </article>
  );
}

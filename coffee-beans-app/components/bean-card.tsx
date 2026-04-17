"use client";

import Image from "next/image";
import {
  ChangeEvent,
  FormEvent,
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
  };
};

export function BeanCard({ bean, priceStats }: BeanCardProps) {
  const router = useRouter();
  const { messages } = useLanguage();
  const [currentBean, setCurrentBean] = useState(bean);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formValues, setFormValues] = useState(() => getBeanFormValues(bean));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<BeanUpdateErrors>({});
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const priceRange = Math.max(priceStats.max - priceStats.min, 1);
  const pricePosition = ((currentBean.price - priceStats.min) / priceRange) * 100;
  const priceDifference = currentBean.price - priceStats.average;
  const safeWeight = currentBean.weight > 0 ? currentBean.weight : 250;
  const unitPrice = currentBean.price / safeWeight;
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
            <Image
              src={currentBean.imageUrl}
              alt={`${currentBean.brand} ${messages.savedBeans}`}
              fill
              unoptimized
              className="object-cover transition duration-500 hover:scale-[1.03]"
              sizes="(max-width: 768px) 70vw, 240px"
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
          <div className="whitespace-nowrap rounded-full bg-[rgba(138,75,42,0.1)] px-3 py-1 text-sm font-semibold text-accent">
            {currentBean.rating.toFixed(1)} / 5.0
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
            <dt className="text-muted">{messages.bestForLabel}</dt>
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
        </div>

        <div className="flex flex-1 flex-col rounded-2xl border border-dashed border-line bg-white/50 p-4">
          <p className="max-h-[8.75rem] overflow-y-auto pr-1 text-sm leading-7 text-muted">
            {currentBean.comments || messages.noComments}
          </p>
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
            className="inline-flex flex-1 items-center justify-center rounded-full bg-[#7b2d1d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#622112] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? messages.working : messages.delete}
          </button>
        </div>
      </div>
    </article>
  );
}

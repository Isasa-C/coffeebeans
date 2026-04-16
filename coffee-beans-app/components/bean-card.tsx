"use client";

import Image from "next/image";
import {
  ChangeEvent,
  FormEvent,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { getBeanFormValues } from "@/lib/bean-form";
import { formatCurrency, type BeanRecord } from "@/lib/utils";
import { type BeanUpdateErrors } from "@/lib/validations/bean";
import { BeanFormFields } from "./bean-form-fields";

type BeanCardProps = {
  bean: BeanRecord;
};

export function BeanCard({ bean }: BeanCardProps) {
  const router = useRouter();
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
          setActionError(result.error ?? "Unable to update this bean.");
          return;
        }

        if (result.data) {
          setCurrentBean(result.data);
          setFormValues(getBeanFormValues(result.data));
        }
        setFieldErrors({});
        setImageFile(null);
        setActionMessage(result.message ?? "Coffee bean updated successfully.");
        setIsEditing(false);
        if (imageInputRef.current) {
          imageInputRef.current.value = "";
        }
        router.refresh();
      } catch {
        setActionError("Network error while updating the bean. Please try again.");
      }
    });
  }

  function handleDelete() {
    setActionError(null);
    setActionMessage(null);

    const confirmed = window.confirm(
      "Are you sure you want to delete this coffee bean?",
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
          setActionError(result.error ?? "Unable to delete this bean.");
          return;
        }

        setActionMessage(result.message ?? "Coffee bean deleted successfully.");
        setIsDeleted(true);
        window.setTimeout(() => {
          router.refresh();
        }, 700);
      } catch {
        setActionError("Network error while deleting the bean. Please try again.");
      }
    });
  }

  if (isEditing) {
    return (
      <article className="card-surface rounded-[1.75rem] p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-accent uppercase">
              Edit bean
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
            Cancel
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
              {isPending ? "Saving changes..." : "Save changes"}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-full border border-line px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Close
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
          Bean removed
        </p>
        <p className="mt-3 text-sm leading-7 text-muted">
          {actionMessage ?? "Coffee bean deleted successfully."}
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
              alt={`${currentBean.brand} coffee beans`}
              fill
              className="object-cover transition duration-500 hover:scale-[1.03]"
              sizes="(max-width: 768px) 70vw, 240px"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col space-y-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="display-font text-2xl font-semibold">{currentBean.brand}</h3>
            <p className="mt-1 text-sm text-muted">
              Added {new Date(currentBean.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="rounded-full bg-[rgba(138,75,42,0.1)] px-3 py-1 text-sm font-semibold text-accent">
            {currentBean.rating.toFixed(1)} / 5
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-2xl border border-line bg-card p-3">
            <dt className="text-muted">Price</dt>
            <dd className="mt-1 text-base font-semibold text-foreground">
              {formatCurrency(currentBean.price)}
            </dd>
          </div>
          <div className="rounded-2xl border border-line bg-card p-3">
            <dt className="text-muted">Qty</dt>
            <dd className="mt-1 text-base font-semibold text-foreground">
              {currentBean.quantity}
            </dd>
          </div>
          <div className="rounded-2xl border border-line bg-card p-3">
            <dt className="text-muted">Best for</dt>
            <dd className="mt-1 text-base font-semibold text-foreground">
              {currentBean.bestFor}
            </dd>
          </div>
        </dl>

        <div className="rounded-2xl border border-dashed border-line bg-white/50 p-4">
          <p className="max-h-[8.75rem] overflow-y-auto pr-1 text-sm leading-7 text-muted">
            {currentBean.comments || "No tasting notes or comments added yet."}
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
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-[#7b2d1d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#622112] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Working..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}

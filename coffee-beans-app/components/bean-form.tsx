"use client";

import {
  ChangeEvent,
  FormEvent,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { initialBeanFormValues } from "@/lib/bean-form";
import { type BeanFormErrors } from "@/lib/validations/bean";
import { BeanFormFields } from "./bean-form-fields";

export function BeanForm() {
  const router = useRouter();
  const { messages } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [formValues, setFormValues] = useState(initialBeanFormValues);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<BeanFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
      [name as keyof typeof initialBeanFormValues]: undefined,
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);

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
        const response = await fetch("/api/beans", {
          method: "POST",
          body: payload,
        });

        const result = (await response.json()) as {
          error?: string;
          fieldErrors?: BeanFormErrors;
        };

        if (!response.ok) {
          setFieldErrors(result.fieldErrors ?? {});
          setSubmitError(result.error ?? messages.genericSaveError);
          return;
        }

        setFormValues(initialBeanFormValues);
        setImageFile(null);
        setFieldErrors({});
        setSuccessMessage(messages.beanSaved);

        if (imageInputRef.current) {
          imageInputRef.current.value = "";
        }

        router.refresh();
      } catch {
        setSubmitError(messages.networkSaveError);
      }
    });
  }

  return (
    <section className="card-surface rounded-[1.75rem] p-5 sm:p-6">
      <div className="mb-6 space-y-2">
        <h2 className="display-font text-3xl font-semibold text-accent">
          {messages.addBeanTitle}
        </h2>
        <p className="text-sm leading-7 text-muted">
          {messages.addBeanDescription}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <BeanFormFields
          fieldErrors={fieldErrors}
          formValues={formValues}
          imageInputRef={imageInputRef}
          onChange={handleChange}
          onImageChange={handleImageChange}
          onQuickPickBrand={handleQuickPickBrand}
        />

        <p className="text-xs leading-6 text-muted">
          {messages.imageHelp}
        </p>

        {submitError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? messages.savingBean : messages.saveBean}
        </button>
      </form>
    </section>
  );
}

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

export function BeanForm({ onSuccess }: { onSuccess?: () => void }) {
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
        onSuccess?.();
      } catch {
        setSubmitError(messages.networkSaveError);
      }
    });
  }

  return (
    <section className="bean-form-compact max-h-[calc(100vh-2rem)] overflow-y-auto rounded-[18px] border border-[rgba(76,44,23,0.14)] bg-[#f5efe5] p-4 shadow-[0_24px_80px_rgba(76,44,23,0.18)] sm:max-h-[calc(100vh-4rem)] sm:p-5">
      <div className="mb-4 pr-9">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9b7b62]">
          Library
        </p>
        <h2 className="font-serif text-[30px] font-medium leading-none tracking-[-0.5px] text-[#2b1b12]">
          {messages.addBeanTitle}
        </h2>
        <p className="mt-2 text-[13px] leading-6 text-[#735d4d]">
          {messages.addBeanDescription}
        </p>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <BeanFormFields
          fieldErrors={fieldErrors}
          formValues={formValues}
          imageInputRef={imageInputRef}
          onChange={handleChange}
          onImageChange={handleImageChange}
          onQuickPickBrand={handleQuickPickBrand}
        />

        <p className="text-[11px] leading-5 text-[#735d4d]">
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
          className="inline-flex w-full items-center justify-center rounded-full bg-[#d4673e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b35530] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? messages.savingBean : messages.saveBean}
        </button>
      </form>
    </section>
  );
}

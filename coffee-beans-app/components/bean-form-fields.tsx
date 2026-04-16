import type { ChangeEvent, RefObject } from "react";
import type { BeanFormValues } from "@/lib/bean-form";
import {
  bestForOptions,
  type BeanFormErrors,
} from "@/lib/validations/bean";
import { FieldError } from "./field-error";

const brandOptions = [
  "The Coffee",
  "Starbucks",
  "Delonghi",
];

type BeanFormFieldsProps = {
  fieldErrors: BeanFormErrors;
  formValues: BeanFormValues;
  imageInputRef?: RefObject<HTMLInputElement | null>;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onQuickPickBrand?: (brand: string) => void;
};

export function BeanFormFields({
  fieldErrors,
  formValues,
  imageInputRef,
  onChange,
  onImageChange,
  onQuickPickBrand,
}: BeanFormFieldsProps) {
  return (
    <>
      <div>
        <label className="mb-2 block text-sm font-semibold" htmlFor="brand">
          Brand
        </label>
        <input
          id="brand"
          name="brand"
          className="field"
          placeholder="Choose or type a brand"
          value={formValues.brand}
          onChange={onChange}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {brandOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onQuickPickBrand?.(option)}
              className={`rounded-full px-2 py-1 text-[6px] font-semibold text-white transition ${
                formValues.brand === option
                  ? "bg-[#5c3520] shadow-[0_8px_20px_rgba(92,53,32,0.2)]"
                  : "bg-[#8a4b2a] hover:bg-[#6f3519]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <FieldError message={fieldErrors.brand?.[0]} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor="price">
            Price (€)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            className="field"
            placeholder="18.50"
            value={formValues.price}
            onChange={onChange}
          />
          <FieldError message={fieldErrors.price?.[0]} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor="quantity">
            Qty
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            step="1"
            className="field"
            placeholder="1"
            value={formValues.quantity}
            onChange={onChange}
          />
          <FieldError message={fieldErrors.quantity?.[0]} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor="rating">
            Rating
          </label>
          <input
            id="rating"
            name="rating"
            type="number"
            min="1"
            max="5"
            step="0.1"
            className="field"
            placeholder="4"
            value={formValues.rating}
            onChange={onChange}
          />
          <FieldError message={fieldErrors.rating?.[0]} />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold" htmlFor="bestFor">
          Best For
        </label>
        <select
          id="bestFor"
          name="bestFor"
          className="field appearance-none"
          value={formValues.bestFor}
          onChange={onChange}
        >
          {bestForOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <FieldError message={fieldErrors.bestFor?.[0]} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold" htmlFor="comments">
          Comments
        </label>
        <textarea
          id="comments"
          name="comments"
          rows={4}
          className="field resize-none"
          placeholder="Chocolate notes, citrus finish, excellent with espresso..."
          value={formValues.comments}
          onChange={onChange}
        />
        <FieldError message={fieldErrors.comments?.[0]} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold" htmlFor="image">
          Bean Image (optional)
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          ref={imageInputRef}
          className="field file:mr-4 file:rounded-full file:border-0 file:bg-[rgba(138,75,42,0.12)] file:px-4 file:py-2 file:font-semibold file:text-accent"
          onChange={onImageChange}
        />
        <FieldError message={fieldErrors.image?.[0]} />
      </div>
    </>
  );
}

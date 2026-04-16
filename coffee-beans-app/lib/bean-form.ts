import type { BeanRecord } from "@/lib/utils";

const DEFAULT_WEIGHT_GRAMS = 250;

export const initialBeanFormValues = {
  brand: "",
  price: "",
  quantity: "1",
  weight: DEFAULT_WEIGHT_GRAMS.toString(),
  rating: "4",
  bestFor: "Latte",
  comments: "",
};

export type BeanFormValues = typeof initialBeanFormValues;

export function getBeanFormValues(bean: BeanRecord): BeanFormValues {
  const weight = typeof bean.weight === "number" && bean.weight > 0
    ? bean.weight
    : DEFAULT_WEIGHT_GRAMS;

  return {
    brand: bean.brand,
    price: bean.price.toString(),
    quantity: bean.quantity.toString(),
    weight: weight.toString(),
    rating: bean.rating.toString(),
    bestFor: bean.bestFor,
    comments: bean.comments ?? "",
  };
}

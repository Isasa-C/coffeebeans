import type { BeanRecord } from "@/lib/utils";

export const initialBeanFormValues = {
  brand: "",
  price: "",
  quantity: "1",
  rating: "4",
  bestFor: "Latte",
  comments: "",
};

export type BeanFormValues = typeof initialBeanFormValues;

export function getBeanFormValues(bean: BeanRecord): BeanFormValues {
  return {
    brand: bean.brand,
    price: bean.price.toString(),
    quantity: bean.quantity.toString(),
    rating: bean.rating.toString(),
    bestFor: bean.bestFor,
    comments: bean.comments ?? "",
  };
}

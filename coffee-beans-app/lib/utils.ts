import type { CoffeeBean } from "@prisma/client";

export type BeanRecord = {
  id: string;
  brand: string;
  price: number;
  quantity: number;
  rating: number;
  bestFor: string;
  comments: string | null;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function formatBeanRecord(bean: CoffeeBean): BeanRecord {
  return {
    id: bean.id,
    brand: bean.brand,
    price: Number(bean.price),
    quantity: bean.quantity,
    rating: bean.rating,
    bestFor: bean.bestFor,
    comments: bean.comments,
    imageUrl: bean.imageUrl,
    createdAt: bean.createdAt.toISOString(),
    updatedAt: bean.updatedAt.toISOString(),
  };
}

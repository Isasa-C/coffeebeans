import type { CoffeeBean, CoffeeShopOrder } from "@prisma/client";
import type { CoffeeShopPriceEntry } from "@/lib/coffee-shop-prices";

const DEFAULT_WEIGHT_GRAMS = 250;

export type BeanRecord = {
  id: string;
  brand: string;
  price: number;
  quantity: number;
  weight: number;
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
    weight: typeof bean.weight === "number" && bean.weight > 0 ? bean.weight : DEFAULT_WEIGHT_GRAMS,
    rating: bean.rating,
    bestFor: bean.bestFor,
    comments: bean.comments,
    imageUrl: bean.imageUrl,
    createdAt: bean.createdAt.toISOString(),
    updatedAt: bean.updatedAt.toISOString(),
  };
}

export function formatCoffeeShopOrderRecord(order: CoffeeShopOrder): CoffeeShopPriceEntry {
  return {
    id: order.id,
    brand: order.brand,
    drinkType: order.drinkType as CoffeeShopPriceEntry["drinkType"],
    temperature: order.temperature as CoffeeShopPriceEntry["temperature"],
    milkType: order.milkType as CoffeeShopPriceEntry["milkType"],
    size: order.size as CoffeeShopPriceEntry["size"],
    finalPrice: Number(order.finalPrice),
    oatMilkExtra: Number(order.oatMilkExtra),
    date: order.date,
    notes: order.notes ?? undefined,
  };
}

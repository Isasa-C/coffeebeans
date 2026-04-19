import { z } from "zod";

const drinkTypeValues = ["Latte", "Americano"] as const;
const temperatureValues = ["Hot", "Iced"] as const;
const milkTypeValues = ["Normal", "Oat", "None"] as const;
const sizeValues = ["Small", "Standard", "Large"] as const;

export const coffeeShopOrderSchema = z.object({
  id: z.string().trim().min(1).max(120),
  brand: z.string().trim().min(1).max(120),
  drinkType: z.enum(drinkTypeValues),
  temperature: z.enum(temperatureValues),
  milkType: z.enum(milkTypeValues),
  size: z.enum(sizeValues),
  finalPrice: z.number().positive().max(1000),
  oatMilkExtra: z.number().min(0).max(1000),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().trim().max(1000).optional(),
});

export type CoffeeShopOrderPayload = z.infer<typeof coffeeShopOrderSchema>;

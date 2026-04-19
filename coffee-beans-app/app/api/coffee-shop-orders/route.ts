import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { type CoffeeShopPriceEntry } from "@/lib/coffee-shop-prices";
import { formatCoffeeShopOrderRecord } from "@/lib/utils";
import { coffeeShopOrderSchema } from "@/lib/validations/coffee-shop-order";

export const runtime = "nodejs";

export async function GET() {
  try {
    const orders = await prisma.coffeeShopOrder.findMany({
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      data: orders.map(formatCoffeeShopOrderRecord),
    });
  } catch (error) {
    console.error("Failed to fetch coffee shop orders", error);

    return NextResponse.json(
      { error: "Unable to load coffee shop orders right now." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CoffeeShopPriceEntry;
    const payload = coffeeShopOrderSchema.safeParse(body);

    if (!payload.success) {
      return NextResponse.json(
        {
          error: "Please correct the order details and try again.",
          fieldErrors: payload.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const savedOrder = await prisma.coffeeShopOrder.upsert({
      where: {
        id: payload.data.id,
      },
      update: {
        brand: payload.data.brand,
        drinkType: payload.data.drinkType,
        temperature: payload.data.temperature,
        milkType: payload.data.milkType,
        size: payload.data.size,
        finalPrice: payload.data.finalPrice,
        oatMilkExtra: payload.data.oatMilkExtra,
        date: payload.data.date,
        notes: payload.data.notes || null,
      },
      create: {
        id: payload.data.id,
        brand: payload.data.brand,
        drinkType: payload.data.drinkType,
        temperature: payload.data.temperature,
        milkType: payload.data.milkType,
        size: payload.data.size,
        finalPrice: payload.data.finalPrice,
        oatMilkExtra: payload.data.oatMilkExtra,
        date: payload.data.date,
        notes: payload.data.notes || null,
      },
    });

    return NextResponse.json(
      {
        data: formatCoffeeShopOrderRecord(savedOrder),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to save coffee shop order", error);

    return NextResponse.json(
      { error: "We couldn't save that order right now. Please try again." },
      { status: 500 },
    );
  }
}

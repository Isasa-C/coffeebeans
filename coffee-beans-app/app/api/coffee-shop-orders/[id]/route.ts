import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    await prisma.coffeeShopOrder.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete coffee shop order", error);

    return NextResponse.json(
      { error: "We couldn't delete that order right now. Please try again." },
      { status: 500 },
    );
  }
}

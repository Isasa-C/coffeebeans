import { unlink } from "node:fs/promises";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatBeanRecord } from "@/lib/utils";
import { saveUploadedImage } from "@/lib/uploads";
import { beanFormSchema } from "@/lib/validations/bean";

export const runtime = "nodejs";

export async function GET() {
  try {
    const beans = await prisma.coffeeBean.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      data: beans.map(formatBeanRecord),
    });
  } catch (error) {
    console.error("Failed to fetch coffee beans", error);

    return NextResponse.json(
      { error: "Unable to load the coffee bean catalog right now." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let uploadedFilePath: string | null = null;

  try {
    const formData = await request.formData();
    const image = formData.get("image");

    const payload = beanFormSchema.safeParse({
      brand: formData.get("brand"),
      price: formData.get("price"),
      quantity: formData.get("quantity"),
      rating: formData.get("rating"),
      bestFor: formData.get("bestFor"),
      comments: formData.get("comments"),
      image,
    });

    if (!payload.success) {
      return NextResponse.json(
        {
          error: "Please correct the highlighted fields and try again.",
          fieldErrors: payload.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const savedImage = await saveUploadedImage(payload.data.image);
    uploadedFilePath = savedImage.filePath;

    const createdBean = await prisma.coffeeBean.create({
      data: {
        brand: payload.data.brand,
        price: payload.data.price,
        quantity: payload.data.quantity,
        rating: payload.data.rating,
        bestFor: payload.data.bestFor,
        comments: payload.data.comments || null,
        imageUrl: savedImage.publicUrl,
      },
    });

    return NextResponse.json(
      {
        data: formatBeanRecord(createdBean),
      },
      { status: 201 },
    );
  } catch (error) {
    if (uploadedFilePath) {
      await unlink(uploadedFilePath).catch(() => undefined);
    }

    console.error("Failed to create coffee bean", error);

    return NextResponse.json(
      { error: "We couldn't save that bean right now. Please try again." },
      { status: 500 },
    );
  }
}

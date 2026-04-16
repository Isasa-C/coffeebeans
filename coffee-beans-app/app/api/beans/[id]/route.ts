import { unlink } from "node:fs/promises";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteUploadedImage, saveUploadedImage } from "@/lib/uploads";
import { formatBeanRecord } from "@/lib/utils";
import { beanUpdateSchema } from "@/lib/validations/bean";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  let uploadedFilePath: string | null = null;

  try {
    const existingBean = await prisma.coffeeBean.findUnique({
      where: { id },
    });

    if (!existingBean) {
      return NextResponse.json(
        { error: "Coffee bean not found." },
        { status: 404 },
      );
    }

    const formData = await request.formData();
    const image = formData.get("image");

    const payload = beanUpdateSchema.safeParse({
      brand: formData.get("brand"),
      price: formData.get("price"),
      quantity: formData.get("quantity"),
      weight: formData.get("weight"),
      rating: formData.get("rating"),
      bestFor: formData.get("bestFor"),
      comments: formData.get("comments"),
      image: image instanceof File && image.size > 0 ? image : null,
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

    let imageUrl = existingBean.imageUrl;

    if (payload.data.image) {
      const savedImage = await saveUploadedImage(payload.data.image);
      uploadedFilePath = savedImage.filePath;
      imageUrl = savedImage.publicUrl;
    }

    const updatedBean = await prisma.coffeeBean.update({
      where: { id },
      data: {
        brand: payload.data.brand,
        price: payload.data.price,
        quantity: payload.data.quantity,
        weight: payload.data.weight,
        rating: payload.data.rating,
        bestFor: payload.data.bestFor,
        comments: payload.data.comments || null,
        imageUrl,
      },
    });

    if (payload.data.image) {
      await deleteUploadedImage(existingBean.imageUrl);
    }

    return NextResponse.json({
      data: formatBeanRecord(updatedBean),
      message: "Coffee bean updated successfully.",
    });
  } catch (error) {
    if (uploadedFilePath) {
      await unlink(uploadedFilePath).catch(() => undefined);
    }

    console.error("Failed to update coffee bean", error);

    return NextResponse.json(
      { error: "We couldn't update that bean right now. Please try again." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const existingBean = await prisma.coffeeBean.findUnique({
      where: { id },
    });

    if (!existingBean) {
      return NextResponse.json(
        { error: "Coffee bean not found." },
        { status: 404 },
      );
    }

    await prisma.coffeeBean.delete({
      where: { id },
    });

    await deleteUploadedImage(existingBean.imageUrl);

    return NextResponse.json({
      message: "Coffee bean deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete coffee bean", error);

    return NextResponse.json(
      { error: "We couldn't delete that bean right now. Please try again." },
      { status: 500 },
    );
  }
}

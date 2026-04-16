import { mkdir, unlink, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { del, put } from "@vercel/blob";

const uploadDirectory = path.join(process.cwd(), "public", "uploads");

const fileExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function saveUploadedImage(file: File) {
  const extension = fileExtensions[file.type] ?? "jpg";
  const fileName = `${randomUUID()}.${extension}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`coffee-beans/${fileName}`, file, {
      access: "public",
      addRandomSuffix: false,
    });

    return {
      filePath: null,
      publicUrl: blob.url,
    };
  }

  await mkdir(uploadDirectory, { recursive: true });

  const filePath = path.join(uploadDirectory, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  return {
    filePath,
    publicUrl: `/uploads/${fileName}`,
  };
}

export async function deleteUploadedImage(imageUrl: string | null | undefined) {
  if (!imageUrl) {
    return;
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      await del(imageUrl).catch(() => undefined);
    }
    return;
  }

  if (imageUrl.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", imageUrl);
    await unlink(filePath).catch(() => undefined);
  }
}

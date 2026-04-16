import { mkdir, unlink, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

const uploadDirectory = path.join(process.cwd(), "public", "uploads");

const fileExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function saveUploadedImage(file: File) {
  await mkdir(uploadDirectory, { recursive: true });

  const extension = fileExtensions[file.type] ?? "jpg";
  const fileName = `${randomUUID()}.${extension}`;
  const filePath = path.join(uploadDirectory, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  return {
    filePath,
    publicUrl: `/uploads/${fileName}`,
  };
}

export async function deleteUploadedImage(imageUrl: string | null | undefined) {
  if (!imageUrl || !imageUrl.startsWith("/uploads/")) {
    return;
  }

  const filePath = path.join(process.cwd(), "public", imageUrl);
  await unlink(filePath).catch(() => undefined);
}

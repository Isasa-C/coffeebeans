import { z } from "zod";

const MAX_FILE_SIZE = Math.floor(4.5 * 1024 * 1024);
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const bestForOptions = ["Latte", "Espresso", "Americano"] as const;

const baseBeanSchema = z.object({
  brand: z
    .string({ required_error: "Brand is required." })
    .trim()
    .min(2, "Brand must be at least 2 characters.")
    .max(80, "Brand must be 80 characters or less."),
  price: z.coerce
    .number({ invalid_type_error: "Price is required." })
    .positive("Price must be greater than 0.")
    .max(1000, "Price must be $1000 or less."),
  quantity: z.coerce
    .number({ invalid_type_error: "Quantity is required." })
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1.")
    .max(9999, "Quantity is too large."),
  rating: z.coerce
    .number({ invalid_type_error: "Rating is required." })
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating must be 5 or lower."),
  bestFor: z.enum(bestForOptions, {
    errorMap: () => ({
      message: "Choose whether this bean is best for Latte, Espresso, or Americano.",
    }),
  }),
  comments: z
    .string()
    .trim()
    .max(500, "Comments must be 500 characters or less.")
    .optional()
    .or(z.literal("")),
});

const uploadedImageSchema = z.custom<File>(
  (value) => value instanceof File && value.size > 0,
  "Please upload a bean image.",
).superRefine((file, ctx) => {
  if (file.size > MAX_FILE_SIZE) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Image must be 4.5 MB or smaller.",
    });
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Upload a JPG, PNG, or WEBP image.",
    });
  }
});

export const beanFormSchema = baseBeanSchema.extend({
  image: uploadedImageSchema,
});

export const beanUpdateSchema = baseBeanSchema.extend({
  image: z.union([uploadedImageSchema, z.null(), z.undefined()]),
});

export type BeanFormErrors = Partial<
  Record<keyof z.infer<typeof beanFormSchema>, string[] | undefined>
>;

export type BeanUpdateErrors = Partial<
  Record<keyof z.infer<typeof beanUpdateSchema>, string[] | undefined>
>;

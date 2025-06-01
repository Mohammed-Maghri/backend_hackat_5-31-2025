import z from "zod";

export const categoryAddSchema = z.object({
  category: z
    .string({
      required_error: "Category is required",
      invalid_type_error: "Category must be a string",
    })
    .min(3, { message: "Category name must be at least 3 characters long" })
    .max(25, { message: "Category name must not exceed 50 characters" }),
});

export type CategoryAddSchemaType = z.infer<typeof categoryAddSchema>;

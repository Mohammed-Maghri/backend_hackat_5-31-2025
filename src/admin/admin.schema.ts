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

export const eventUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  date: z.string().datetime().optional(),
  image_url: z.string().url().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  status: z.enum(["upcoming", "completed", "cancelled", "pending"]).optional(),
  category_id: z.number().optional(),
  pictures: z.string().optional(),
  creator_id: z.number().optional(),
  category_name: z.string().optional(),
  slots: z.number().optional(),
  total_slots: z.number().optional(),
});
export type EventUpdateSchemaType = z.infer<typeof eventUpdateSchema>;

export const removeCategorySchema = z.object({
  id: z
    .number({
      required_error: "ID is required",
      invalid_type_error: "ID must be a number",
    })
    .int({ message: "ID must be an integer" }),
});

export type RemoveCategorySchemaType = z.infer<typeof removeCategorySchema>;
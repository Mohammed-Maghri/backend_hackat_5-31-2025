import z from "zod";

export const eventCreationSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(20, { message: "Title must be less than 20 characters" })
    .refine((val) => val.trim().length !== 0, {
      message: "Please Enter characters",
    }),
  description: z
    .string()
    .min(5, { message: "Description should have at least 5 characters" })
    .max(50, { message: "Description should not exceed 50 characters" }),
  location: z
    .string()
    .min(1, { message: "Location is required" })
    .max(50, { message: "Location must not exceed 50 characters" }),
  date: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: "Invalid date format" }
  ),
  image_url: z
    .string()
    .url({ message: "Invalid image URL" })
    .optional()
    .or(z.literal("").transform(() => undefined)), // Allow empty string as optional

  status: z
    .enum(["upcoming", "completed", "cancelled", "pending"])
    .optional()
    .default("pending"),
  category_id: z
    .number()
    .int()
    .positive({ message: "Category ID must be a positive integer" })
    .optional(),
  latitude: z.number({
    required_error: "Latitude is required",
    invalid_type_error: "Latitude must be a number",
  }),
  longitude: z.number({
    required_error: "Longitude is required",
    invalid_type_error: "Longitude must be a number",
  }),
});

export type eventCreationType = z.infer<typeof eventCreationSchema>;

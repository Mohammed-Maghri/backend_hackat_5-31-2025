import z from "zod";

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

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

  date: z
    .string()
    .datetime({ message: "Invalid date format. Must be ISO 8601." }),

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
    .positive({ message: "Category ID must be a positive integer" }),
  latitude: z.number({
    required_error: "Latitude is required",
    invalid_type_error: "Latitude must be a number",
  }),
  longitude: z.number({
    required_error: "Longitude is required",
    invalid_type_error: "Longitude must be a number",
  }),
  slots: z
    .number({
      required_error: "Slots are required",
      invalid_type_error: "Slots must be a number",
    })
    .int()
    .positive({ message: "Slots must be a positive integer" }),
});

export type eventCreationType = z.infer<typeof eventCreationSchema>;

export const eventParamsSchema = z.object({
  category_id: z.number().optional(),
  title: z
    .string()
    .optional()
    .refine((val) => !val || val.trim().length === 0, {
      message: "Invalid Title ",
    }),
  start_date: z
    .string()
    .datetime("Invalid start Date, please provide a valid ISO Date")
    .optional(),
  end_date: z
    .string()
    .datetime("Invalid End Date, please provide a valid ISO Date")
    .optional(),
  page: z.string().optional(),
});

export type eventParamsType = z.infer<typeof eventParamsSchema>;

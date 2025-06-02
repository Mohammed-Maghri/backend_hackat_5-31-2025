import z from "zod";

export const feedbackSchema = z.object({
  event_id: z
    .number()
    .int()
    .positive({ message: "Event ID must be a positive integer" }),
  rating: z.number().int().min(1).max(5),
  login: z.string({ required_error: "Must have login" }),
  comment: z
    .string()
    .min(4, { message: "Comment should be at least 4 characters" })
    .max(200, { message: "Comment must be under 200 characters" }),
});

export type feedbackSchemaType = z.infer<typeof feedbackSchema>;

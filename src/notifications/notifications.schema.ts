import z from "zod";

export const notificationZodObject = z.object({
  to: z.string({ required_error: "ExpoPushtoken is required" }),
  sound: z.string({ required_error: "Sound is required" }),
  title: z.string({ required_error: "Notification title is required" }),
  body: z.string({
    required_error: "Notification body is required",
    invalid_type_error: "Invalid type for body",
  }),
});

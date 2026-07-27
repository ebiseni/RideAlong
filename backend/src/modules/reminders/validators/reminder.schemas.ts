import { z } from "zod";

export const createReminderSchema = z.object({
  body: z.object({
    vehicleDocumentId: z
      .string()
      .uuid("Vehicle Document ID must be a valid UUID"),

    reminderDate: z.coerce.date({
      message: "Reminder date is required",
    }),
  }),
});

export const updateReminderSchema = z.object({
  body: z.object({
    reminderDate: z.coerce.date().optional(),

    status: z
      .enum(["PENDING", "SENT", "DISMISSED"])
      .optional(),

    notificationSent: z.boolean().optional(),
  }),
});
import { z } from "zod";

/**
 * Create Appointment Validation Schema
 *
 * Used when creating a new appointment.
 * All fields are required except note.
 */
export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date().refine(
    (date) => date > new Date(),
    "Appointment schedule must be in the future"
  ),
  reason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
  note: z.string().optional(),
});

/**
 * Schedule Appointment Validation Schema
 *
 * Used when scheduling an existing appointment.
 * Only schedule is required.
 */
export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date().refine(
    (date) => date > new Date(),
    "Appointment schedule must be in the future"
  ),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

/**
 * Cancel Appointment Validation Schema
 *
 * Used when cancelling an appointment.
 * Cancellation reason is required.
 */
export const CancelAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "Cancellation reason must be at least 2 characters")
    .max(500, "Cancellation reason must be at most 500 characters"),
});

/**
 * Get appointment schema based on type
 *
 * @param type - Appointment form type
 * @returns Appropriate Zod schema
 */
export function getAppointmentSchema(type: string) {
  switch (type) {
    case "create":
      return CreateAppointmentSchema;
    case "cancel":
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}

// Type exports
export type CreateAppointmentValues = z.infer<typeof CreateAppointmentSchema>;
export type ScheduleAppointmentValues = z.infer<typeof ScheduleAppointmentSchema>;
export type CancelAppointmentValues = z.infer<typeof CancelAppointmentSchema>;


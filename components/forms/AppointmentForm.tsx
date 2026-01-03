"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { z } from "zod";

import { SelectItem } from "@/components/ui/select";
import { Doctors } from "@/constants";
import {
  getAppointmentSchema,
  CancelAppointmentSchema,
} from "@/lib/validations/appointment.validation";
import {
  CREATE_APPOINTMENT_MUTATION,
  UPDATE_APPOINTMENT_MUTATION,
  CANCEL_APPOINTMENT_MUTATION,
  CreateAppointmentMutationData,
  UpdateAppointmentMutationData,
  CancelAppointmentMutationData,
  CreateAppointmentInput,
} from "@/lib/graphql/mutations/appointment.mutations";

import "react-datepicker/dist/react-datepicker.css";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";

/**
 * Appointment Type
 */
interface Appointment {
  id: string;
  primaryPhysician: string;
  schedule: Date | string;
  reason: string;
  note?: string;
  cancellationReason?: string;
  status?: string;
}

/**
 * Appointment Form Component
 *
 * Handles creating, scheduling, and cancelling appointments.
 * Supports three modes: create, schedule, cancel
 */
export const AppointmentForm = ({
  userId,
  patientId,
  type = "create",
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: "create" | "schedule" | "cancel";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const AppointmentFormValidation = getAppointmentSchema(type);

  // GraphQL mutations
  const [createAppointment] = useMutation<CreateAppointmentMutationData>(
    CREATE_APPOINTMENT_MUTATION
  );
  const [updateAppointment] = useMutation<UpdateAppointmentMutationData>(
    UPDATE_APPOINTMENT_MUTATION
  );
  const [cancelAppointment] = useMutation<CancelAppointmentMutationData>(
    CANCEL_APPOINTMENT_MUTATION
  );

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment.schedule)
        : (() => {
            // Use a fixed date calculation to avoid hydration mismatch
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(9, 0, 0, 0); // Set to 9 AM
            return tomorrow;
          })(),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  /**
   * Handle form submission
   */
  const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      if (type === "create" && patientId) {
        // Create new appointment
        const input: CreateAppointmentInput = {
          patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: values.schedule.toISOString(),
          reason: values.reason!,
          note: values.note,
        };

        const { data } = await createAppointment({
          variables: { input },
        });

        if (
          data?.createAppointment.success &&
          data.createAppointment.appointment
        ) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${data.createAppointment.appointment.id}`
          );
        } else {
          const errorMessage =
            data?.createAppointment.errors?.[0]?.message ||
            "Failed to create appointment";
          setError(errorMessage);
        }
      } else if (type === "cancel" && appointment?.id) {
        // Cancel appointment
        // Type guard: ensure we have cancellationReason (it's required in CancelAppointmentSchema)
        const cancelValues = values as z.infer<typeof CancelAppointmentSchema>;

        // Ensure cancellationReason exists
        if (
          !cancelValues.cancellationReason ||
          cancelValues.cancellationReason.trim().length < 2
        ) {
          setError("Cancellation reason is required");
          setIsLoading(false);
          return;
        }

        const { data, errors } = await cancelAppointment({
          variables: {
            id: appointment.id,
            reason: cancelValues.cancellationReason,
          },
        });

        // Check for GraphQL errors
        if (errors && errors.length > 0) {
          setError(errors[0].message || "Failed to cancel appointment");
          setIsLoading(false);
          return;
        }

        if (data?.cancelAppointment.success) {
          setOpen && setOpen(false);
          form.reset();
          // Refresh the page or update UI
          router.refresh();
        } else {
          const errorMessage =
            data?.cancelAppointment.errors?.[0]?.message ||
            "Failed to cancel appointment";
          setError(errorMessage);
        }
      } else if (type === "schedule" && appointment?.id) {
        // Schedule appointment (update with schedule)
        const { data } = await updateAppointment({
          variables: {
            id: appointment.id,
            input: {
              schedule: values.schedule.toISOString(),
              status: "SCHEDULED",
            },
          },
        });

        if (data?.updateAppointment.success) {
          setOpen && setOpen(false);
          form.reset();
          router.refresh();
        } else {
          const errorMessage =
            data?.updateAppointment.errors?.[0]?.message ||
            "Failed to schedule appointment";
          setError(errorMessage);
        }
      }
    } catch (err: any) {
      console.error("Appointment error:", err);
      // Extract error message from GraphQL error if available
      const errorMessage =
        err?.graphQLErrors?.[0]?.message ||
        err?.networkError?.message ||
        err?.message ||
        "An unexpected error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  let buttonLabel: string;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      buttonLabel = "Submit Appointment";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">
              Request a new appointment in 10 seconds.
            </p>
          </section>
        )}

        {/* Error display */}
        {error && (
          <div className="rounded-md bg-red-500/10 p-4 text-red-500">
            {error}
          </div>
        )}

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {Doctors.map((doctor, i) => (
                <SelectItem key={doctor.name + i} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    {doctor.image && (
                      <Image
                        src={doctor.image}
                        width={32}
                        height={32}
                        alt="doctor"
                        className="rounded-full border border-dark-500"
                      />
                    )}
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />

            <div
              className={`flex flex-col gap-6 ${
                type === "create" && "xl:flex-row"
              }`}
            >
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Appointment reason"
                placeholder="Annual monthly check-up"
                disabled={type === "schedule"}
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Comments/notes"
                placeholder="Prefer afternoon appointments, if possible"
                disabled={type === "schedule"}
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Urgent meeting came up"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;

"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { AppointmentModal } from "../AppointmentModal";
import { PatientDetailsModal } from "../PatientDetailsModal";
import { StatusBadge } from "../StatusBadge";

/**
 * Appointment Type
 */
export interface Appointment {
  id: string;
  primaryPhysician: string;
  schedule: string | Date;
  status: "scheduled" | "pending" | "cancelled";
  reason: string;
  note?: string;
  cancellationReason?: string;
  patient: {
    id: string;
    userId: string;
    birthDate: string;
    gender: string;
    address: string;
    occupation: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    primaryPhysician: string;
    insuranceProvider: string;
    insurancePolicyNumber: string;
    allergies?: string;
    currentMedication?: string;
    familyMedicalHistory?: string;
    pastMedicalHistory?: string;
    identificationType?: string;
    identificationNumber?: string;
    identificationDocumentUrl?: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string;
    };
  };
}

/**
 * Data Table Columns Definition
 *
 * Defines columns for the appointments data table in admin dashboard.
 * Includes patient name, status, schedule, doctor, and actions.
 */
export const columns: ColumnDef<Appointment>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "patientEmail",
    header: "Email",
    cell: ({ row }) => {
      const appointment = row.original;
      const patientEmail = appointment.patient.user?.email || "-";
      return (
        <p className="text-14-regular text-dark-600" title={patientEmail}>
          {patientEmail}
        </p>
      );
    },
  },
  {
    accessorKey: "patientPhone",
    header: "Phone",
    cell: ({ row }) => {
      const appointment = row.original;
      const patientPhone = appointment.patient.user?.phone || "-";
      return (
        <p className="text-14-regular text-dark-600" title={patientPhone}>
          {patientPhone}
        </p>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;
      // Normalize status to lowercase for StatusBadge
      const normalizedStatus =
        typeof appointment.status === "string"
          ? appointment.status.toLowerCase()
          : appointment.status;
      return (
        <div className="min-w-[115px]">
          <StatusBadge
            status={normalizedStatus as "scheduled" | "pending" | "cancelled"}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;
      const scheduleDate =
        typeof appointment.schedule === "string"
          ? new Date(appointment.schedule)
          : appointment.schedule;
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(scheduleDate).dateTime}
        </p>
      );
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {
      const appointment = row.original;

      const doctor = Doctors.find(
        (doctor) => doctor.name === appointment.primaryPhysician
      );

      const doctorImage = doctor?.image || "/assets/images/dr-green.png";

      return (
        <div className="flex items-center gap-3">
          {doctorImage && (
            <Image
              src={doctorImage}
              alt="doctor"
              width={100}
              height={100}
              className="size-8"
            />
          )}
          <p className="whitespace-nowrap">
            Dr. {doctor?.name || appointment.primaryPhysician}
          </p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;

      if (!appointment.patient?.userId) {
        return null;
      }

      return (
        <div className="flex gap-1">
          <PatientDetailsModal patient={appointment.patient} />
          <AppointmentModal
            patientId={appointment.patient.id}
            userId={appointment.patient.userId}
            appointment={{
              id: appointment.id,
              primaryPhysician: appointment.primaryPhysician,
              schedule: appointment.schedule,
              reason: appointment.reason,
              note: appointment.note,
              status: appointment.status,
            }}
            type="schedule"
            title="Schedule Appointment"
            description="Please confirm the following details to schedule."
          />
          <AppointmentModal
            patientId={appointment.patient.id}
            userId={appointment.patient.userId}
            appointment={{
              id: appointment.id,
              primaryPhysician: appointment.primaryPhysician,
              schedule: appointment.schedule,
              reason: appointment.reason,
              note: appointment.note,
              status: appointment.status,
            }}
            type="cancel"
            title="Cancel Appointment"
            description="Are you sure you want to cancel your appointment?"
          />
        </div>
      );
    },
  },
];

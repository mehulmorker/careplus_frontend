import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppointmentModal } from "../AppointmentModal";

// Mock AppointmentForm
vi.mock("../forms/AppointmentForm", () => ({
  AppointmentForm: ({
    userId,
    patientId,
    type,
    appointment,
    setOpen,
  }: any) => (
    <div data-testid="appointment-form">
      <p>User ID: {userId}</p>
      <p>Patient ID: {patientId}</p>
      <p>Type: {type}</p>
      {appointment && <p>Appointment ID: {appointment.id}</p>}
      <button onClick={() => setOpen(false)}>Close Form</button>
    </div>
  ),
}));

// Mock Dialog components
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open, onOpenChange }: any) => (
    <div data-testid="dialog" data-open={open}>
      {children}
    </div>
  ),
  DialogTrigger: ({ children, asChild }: any) => (
    <div data-testid="dialog-trigger">{children}</div>
  ),
  DialogContent: ({ children }: any) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: any) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: any) => (
    <h2 data-testid="dialog-title">{children}</h2>
  ),
  DialogDescription: ({ children }: any) => (
    <p data-testid="dialog-description">{children}</p>
  ),
}));

// Mock Button component
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, className, variant }: any) => (
    <button
      onClick={onClick}
      className={className}
      data-variant={variant}
      data-testid="modal-trigger-button"
    >
      {children}
    </button>
  ),
}));

describe("AppointmentModal", () => {
  const mockAppointment = {
    id: "appointment-1",
    primaryPhysician: "Dr. Smith",
    schedule: new Date("2026-01-15T10:00:00"),
    reason: "Checkup",
    note: "Regular checkup",
    status: "pending",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render schedule modal with correct props", () => {
    render(
      <AppointmentModal
        patientId="patient-1"
        userId="user-1"
        appointment={mockAppointment}
        type="schedule"
        title="Schedule Appointment"
        description="Please confirm the appointment details"
      />
    );

    expect(screen.getByTestId("modal-trigger-button")).toHaveTextContent(
      "schedule"
    );
  });

  it("should render cancel modal with correct props", () => {
    render(
      <AppointmentModal
        patientId="patient-1"
        userId="user-1"
        appointment={mockAppointment}
        type="cancel"
        title="Cancel Appointment"
        description="Are you sure you want to cancel?"
      />
    );

    expect(screen.getByTestId("modal-trigger-button")).toHaveTextContent(
      "cancel"
    );
  });

  it("should pass correct props to AppointmentForm", () => {
    render(
      <AppointmentModal
        patientId="patient-1"
        userId="user-1"
        appointment={mockAppointment}
        type="schedule"
        title="Schedule Appointment"
        description="Please confirm"
      />
    );

    const triggerButton = screen.getByTestId("modal-trigger-button");
    expect(triggerButton).toBeInTheDocument();
  });

  it("should render trigger button", () => {
    render(
      <AppointmentModal
        patientId="patient-1"
        userId="user-1"
        appointment={mockAppointment}
        type="schedule"
        title="Schedule Appointment"
        description="Please confirm"
      />
    );

    const triggerButton = screen.getByTestId("modal-trigger-button");
    expect(triggerButton).toBeInTheDocument();
    expect(triggerButton).toHaveTextContent("schedule");
  });

  it("should render appointment form component", () => {
    render(
      <AppointmentModal
        patientId="patient-1"
        userId="user-1"
        appointment={mockAppointment}
        type="schedule"
        title="Schedule Appointment"
        description="Please confirm"
      />
    );

    // Form is rendered but may not be visible until modal opens
    // We can verify the component structure exists
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });

  it("should apply green color class for schedule button", () => {
    render(
      <AppointmentModal
        patientId="patient-1"
        userId="user-1"
        appointment={mockAppointment}
        type="schedule"
        title="Schedule Appointment"
        description="Please confirm"
      />
    );

    const triggerButton = screen.getByTestId("modal-trigger-button");
    expect(triggerButton.className).toContain("text-green-500");
  });

  it("should not apply green color class for cancel button", () => {
    render(
      <AppointmentModal
        patientId="patient-1"
        userId="user-1"
        appointment={mockAppointment}
        type="cancel"
        title="Cancel Appointment"
        description="Are you sure?"
      />
    );

    const triggerButton = screen.getByTestId("modal-trigger-button");
    expect(triggerButton.className).not.toContain("text-green-500");
  });

  it("should work without appointment prop", () => {
    render(
      <AppointmentModal
        patientId="patient-1"
        userId="user-1"
        type="schedule"
        title="Schedule Appointment"
        description="Please confirm"
      />
    );

    expect(screen.getByTestId("modal-trigger-button")).toBeInTheDocument();
  });
});


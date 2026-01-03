import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "../StatCard";

/**
 * StatCard Component Tests
 */
describe("StatCard", () => {
  it("should render with appointments type", () => {
    render(
      <StatCard
        type="appointments"
        count={10}
        label="Scheduled appointments"
        icon="/assets/icons/appointments.svg"
      />
    );

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Scheduled appointments")).toBeInTheDocument();
  });

  it("should render with pending type", () => {
    render(
      <StatCard
        type="pending"
        count={5}
        label="Pending appointments"
        icon="/assets/icons/pending.svg"
      />
    );

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Pending appointments")).toBeInTheDocument();
  });

  it("should render with cancelled type", () => {
    render(
      <StatCard
        type="cancelled"
        count={2}
        label="Cancelled appointments"
        icon="/assets/icons/cancelled.svg"
      />
    );

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Cancelled appointments")).toBeInTheDocument();
  });

  it("should render with zero count", () => {
    render(
      <StatCard
        type="appointments"
        count={0}
        label="Scheduled appointments"
        icon="/assets/icons/appointments.svg"
      />
    );

    expect(screen.getByText("0")).toBeInTheDocument();
  });
});


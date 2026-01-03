import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "../StatusBadge";

/**
 * StatusBadge Component Tests
 */
describe("StatusBadge", () => {
  it("should render scheduled status", () => {
    render(<StatusBadge status="scheduled" />);

    expect(screen.getByText("scheduled")).toBeInTheDocument();
  });

  it("should render pending status", () => {
    render(<StatusBadge status="pending" />);

    expect(screen.getByText("pending")).toBeInTheDocument();
  });

  it("should render cancelled status", () => {
    render(<StatusBadge status="cancelled" />);

    expect(screen.getByText("cancelled")).toBeInTheDocument();
  });
});


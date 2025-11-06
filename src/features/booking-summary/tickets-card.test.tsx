import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TicketsCard from "./tickets-card";
import type { ReactNode } from "react";

vi.mock("@/components/ui/card", () => ({
  Card: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children }: { children: ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }: { children: ReactNode }) => (
    <h3 data-testid="card-title">{children}</h3>
  ),
  CardContent: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/ui/separator", () => ({
  Separator: () => <hr data-testid="separator" />,
}));

vi.mock("lucide-react", () => ({
  Ticket: ({ className }: { className: string }) => (
    <svg data-testid="ticket-icon" className={className} />
  ),
}));

const mockProps = {
  movieName: "Dies Irae",
  name: "ABC-Multiplex",
  selectedSeatIds: ["A1", "A2", "B1"],
};

describe("TicketsCard Component", () => {
  describe("Rendering", () => {
    it("should render card component", () => {
      render(<TicketsCard {...mockProps} />);
      expect(screen.getByTestId("card")).toBeInTheDocument();
    });

    it("should render all seat elements", () => {
      render(<TicketsCard {...mockProps} />);
      mockProps.selectedSeatIds.forEach((seatId) => {
        expect(screen.getByText(seatId)).toBeInTheDocument();
      });
    });
  });
});

describe("Movie and Theatre Information", () => {
  it("should display movie name", () => {
    render(<TicketsCard {...mockProps} />);
    expect(screen.getByText("Dies Irae")).toBeInTheDocument();
  });

  it("should display theatre name", () => {
    render(<TicketsCard {...mockProps} />);
    expect(screen.getByText("ABC-Multiplex")).toBeInTheDocument();
  });
});

describe("Selected Seats Display", () => {
  it("should display all selected seat IDs", () => {
    render(<TicketsCard {...mockProps} />);
    expect(screen.getByText("A1")).toBeInTheDocument();
    expect(screen.getByText("A2")).toBeInTheDocument();
    expect(screen.getByText("B1")).toBeInTheDocument();
  });

  it("should render correct number of seats", () => {
    render(<TicketsCard {...mockProps} />);
    const seatElements = screen
      .getAllByText(/A1|A2|B1/)
      .filter((el) => el.className?.includes("px-4"));
    expect(seatElements).toHaveLength(3);
  });

  it("should handle single seat", () => {
    const singleSeatProps = {
      ...mockProps,
      selectedSeatIds: ["C1"],
    };
    render(<TicketsCard {...singleSeatProps} />);
    expect(screen.getByText("C1")).toBeInTheDocument();
  });

  it("should handle multiple seats (more than 3)", () => {
    const multipleSeatProps = {
      ...mockProps,
      selectedSeatIds: ["A1", "A2", "B1", "B2", "C1"],
    };
    render(<TicketsCard {...multipleSeatProps} />);
    ["A1", "A2", "B1", "B2", "C1"].forEach((seatId) => {
      expect(screen.getByText(seatId)).toBeInTheDocument();
    });
  });

  it("should handle empty seat array", () => {
    const emptySeatsProps = {
      ...mockProps,
      selectedSeatIds: [],
    };
    render(<TicketsCard {...emptySeatsProps} />);
    expect(screen.getByText("Selected Seats")).toBeInTheDocument();
  });
});

describe("Different Props Values", () => {
  it("should handle different movie names", () => {
    const customProps = {
      ...mockProps,
      movieName: "Eternal Echoes",
    };
    render(<TicketsCard {...customProps} />);
    expect(screen.getByText("Eternal Echoes")).toBeInTheDocument();
  });

  it("should handle different theatre names", () => {
    const customProps = {
      ...mockProps,
      name: "Metro Cineplex",
    };
    render(<TicketsCard {...customProps} />);
    expect(screen.getByText("Metro Cineplex")).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import BookingSummary from "./BookingSummary";
import type { BookingData } from "./BookingSummary";
import { mockLocation, mockNavigate } from "@/test/setup";

// Mock useLocation
const mockBookingData: BookingData = {
  screen: "Screen 1",
  time: "10:00 AM",
  name: "ABC-Multiplex",
  movieName: "Dies Irae",
  totalPrice: 500,
  selectedSeatIds: ["A1", "A2"],
  numberOfSelectedSeats: 2,
};

// Mock store
const mockSetBookedSeats = vi.fn();
const mockSetSeats = vi.fn();
vi.mock("@/store", () => ({
  default: () => ({
    bookedSeats: {
      "movie-1": [{ A1: "silver" }, { A2: "silver" }],
    },
    setBookedSeats: mockSetBookedSeats,
    uniqueMovieId: "movie-1",
    seats: {
      "movie-1": [
        { A1: { status: "available", type: "silver" } },
        { A2: { status: "available", type: "silver" } },
      ],
    },
    setSeats: mockSetSeats,
  }),
}));

// Mock child components with support for data-testid
vi.mock("./tickets-card", () => ({
  default: (props: {
    movieName: string;
    name: string;
    selectedSeatIds: string[];
    "data-testid"?: string;
  }) => (
    <div data-testid={props["data-testid"] ?? "tickets-card"}>
      {props.movieName} - {props.name} - {props.selectedSeatIds.join(", ")}
    </div>
  ),
}));

vi.mock("./price-card", () => ({
  default: (props: { totalPrice: number; "data-testid"?: string }) => (
    <div data-testid={props["data-testid"] ?? "price-card"}>
      ₹{props.totalPrice}
    </div>
  ),
}));

vi.mock("./error-page", () => ({
  default: () => <div data-testid="error-page">Error Page</div>,
}));

vi.mock("./booking-success-alert", () => ({
  default: ({ isOpen }: { isOpen?: boolean }) =>
    isOpen ? <div data-testid="success-alert">Success Alert</div> : null,
}));

// Mock UI components
vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <button onClick={onClick} className={className} data-testid="button">
      {children}
    </button>
  ),
}));

const renderBookingSummary = (
  bookingData: BookingData | null = mockBookingData
) => {
  mockLocation.mockReturnValue({
    state: { bookingData },
    pathname: "/booking-summary",
  });

  return render(
    <BrowserRouter>
      <BookingSummary />
    </BrowserRouter>
  );
};

describe("BookingSummary Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render booking summary heading", () => {
      renderBookingSummary();
      expect(screen.getByText("Booking Summary")).toBeInTheDocument();
    });

    it("should render TicketsCard component", () => {
      renderBookingSummary();
      expect(screen.getByTestId("tickets-card")).toBeInTheDocument();
    });

    it("should render PriceCard component", () => {
      renderBookingSummary();
      expect(screen.getByTestId("price-card")).toBeInTheDocument();
    });

    it("should render cancel button", () => {
      renderBookingSummary();
      expect(
        screen.getByRole("button", { name: /Cancel & Book another/i })
      ).toBeInTheDocument();
    });

    it("should render confirm button", () => {
      renderBookingSummary();
      expect(
        screen.getByRole("button", { name: /Confirm booking/i })
      ).toBeInTheDocument();
    });
  });

  describe("Props Passing", () => {
    it("should pass movie name to TicketsCard", () => {
      renderBookingSummary();
      expect(screen.getByTestId("tickets-card")).toHaveTextContent("Dies Irae");
    });

    it("should pass theatre name to TicketsCard", () => {
      renderBookingSummary();
      expect(screen.getByTestId("tickets-card")).toHaveTextContent(
        "ABC-Multiplex"
      );
    });

    it("should pass selected seat IDs to TicketsCard", () => {
      renderBookingSummary();
      expect(screen.getByTestId("tickets-card")).toHaveTextContent("A1, A2");
    });

    it("should pass total price to PriceCard", () => {
      renderBookingSummary();
      expect(screen.getByTestId("price-card")).toHaveTextContent("₹500");
    });
  });

  describe("Cancel Functionality", () => {
    it("should remove booked seats when cancel clicked", async () => {
      const user = userEvent.setup();
      renderBookingSummary();
      const cancelBtn = screen.getByRole("button", {
        name: /Cancel & Book another/i,
      });
      await user.click(cancelBtn);
      expect(mockSetBookedSeats).toHaveBeenCalled();
    });

    it("should navigate to home when cancel clicked", async () => {
      const user = userEvent.setup();
      renderBookingSummary();
      const cancelBtn = screen.getByRole("button", {
        name: /Cancel & Book another/i,
      });
      await user.click(cancelBtn);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  describe("Confirm Payment Functionality", () => {
    it("should update seat status to unavailable when confirm clicked", async () => {
      const user = userEvent.setup();
      renderBookingSummary();
      const confirmBtn = screen.getByRole("button", {
        name: /Confirm booking/i,
      });
      await user.click(confirmBtn);
      expect(mockSetSeats).toHaveBeenCalled();
    });

    it("should remove booked seats when confirm clicked", async () => {
      const user = userEvent.setup();
      renderBookingSummary();
      const confirmBtn = screen.getByRole("button", {
        name: /Confirm booking/i,
      });
      await user.click(confirmBtn);
      expect(mockSetBookedSeats).toHaveBeenCalled();
    });

    it("should show success alert when confirm clicked", async () => {
      const user = userEvent.setup();
      renderBookingSummary();
      const confirmBtn = screen.getByRole("button", {
        name: /Confirm booking/i,
      });
      await user.click(confirmBtn);
      expect(screen.queryByTestId("success-alert")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should render error page when no booking data", () => {
      renderBookingSummary(null);
      expect(screen.getByTestId("error-page")).toBeInTheDocument();
    });

    it("should not render booking content when no booking data", () => {
      renderBookingSummary(null);
      expect(screen.queryByText("Booking Summary")).not.toBeInTheDocument();
      expect(screen.queryByTestId("tickets-card")).not.toBeInTheDocument();
    });
  });

  describe("Data Processing", () => {
    it("should handle seat status update correctly", async () => {
      const user = userEvent.setup();
      renderBookingSummary();
      const confirmBtn = screen.getByRole("button", {
        name: /Confirm booking/i,
      });
      await user.click(confirmBtn);
      expect(mockSetSeats).toHaveBeenCalled();
      const callArgs = mockSetSeats.mock.calls[0]?.[0];
      expect(callArgs).toBeDefined();
    });

    it("should handle multiple selected seats", () => {
      const multipleSeatsData = {
        ...mockBookingData,
        selectedSeatIds: ["A1", "A2", "B1", "B2"],
        numberOfSelectedSeats: 4,
      };
      renderBookingSummary(multipleSeatsData);
      expect(screen.getByTestId("tickets-card")).toHaveTextContent(
        "A1, A2, B1, B2"
      );
    });

    it("should handle single selected seat", () => {
      const singleSeatData = {
        ...mockBookingData,
        selectedSeatIds: ["A1"],
        numberOfSelectedSeats: 1,
      };
      renderBookingSummary(singleSeatData);
      expect(screen.getByTestId("tickets-card")).toHaveTextContent("A1");
    });
  });

  describe("Different Booking Data", () => {
    it("should handle different movie names", () => {
      const customData = {
        ...mockBookingData,
        movieName: "Eternal Echoes",
      };
      renderBookingSummary(customData);
      expect(screen.getByTestId("tickets-card")).toHaveTextContent(
        "Eternal Echoes"
      );
    });

    it("should handle different theatre names", () => {
      const customData = {
        ...mockBookingData,
        name: "Metro Cineplex",
      };
      renderBookingSummary(customData);
      expect(screen.getByTestId("tickets-card")).toHaveTextContent(
        "Metro Cineplex"
      );
    });

    it("should handle different total prices", () => {
      const customData = {
        ...mockBookingData,
        totalPrice: 1000,
      };
      renderBookingSummary(customData);
      expect(screen.getByTestId("price-card")).toHaveTextContent("₹1000");
    });

    it("should handle different screen information", () => {
      const customData = {
        ...mockBookingData,
        screen: "Screen 5",
        time: "07:30 PM",
      };
      renderBookingSummary(customData);
      expect(screen.getByTestId("tickets-card")).toBeInTheDocument();
    });
  });

  describe("Component Integration", () => {
    it("should render all components together", () => {
      renderBookingSummary();
      expect(screen.getByText("Booking Summary")).toBeInTheDocument();
      expect(screen.getByTestId("tickets-card")).toBeInTheDocument();
      expect(screen.getByTestId("price-card")).toBeInTheDocument();
      expect(screen.getAllByTestId("button").length).toBe(2);
    });

    it("should pass correct data to child components", () => {
      renderBookingSummary();
      const ticketsCard = screen.getByTestId("tickets-card");
      expect(ticketsCard).toHaveTextContent("Dies Irae");
      expect(ticketsCard).toHaveTextContent("ABC-Multiplex");
      expect(ticketsCard).toHaveTextContent("A1, A2");
    });
  });
});

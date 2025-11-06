import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import SeatBooking from "./SeatBooking";
import type { ShowDetailsCardProps } from "./types";

const mockLocation = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useLocation: () => mockLocation(),
  };
});

vi.mock("./components/show-details-card", () => ({
  default: (props: ShowDetailsCardProps) => (
    <div data-testid="show-details-card">
      {props.movieName} — {props.name}
    </div>
  ),
}));

vi.mock("./components/screen-indicator", () => ({
  default: () => <div data-testid="screen-indicator">Screen Indicator</div>,
}));

vi.mock("./components/seats-selection", () => ({
  default: (props: ShowDetailsCardProps) => (
    <div data-testid="seats-selection">Seats: {props.screen}</div>
  ),
}));

vi.mock("./components/seat-pricing-card", () => ({
  default: () => <div data-testid="seat-pricing-card">Pricing</div>,
}));

vi.mock("./components/booking-summary-card", () => ({
  default: (props: ShowDetailsCardProps) => (
    <div data-testid="booking-summary-card">Summary: {props.time}</div>
  ),
}));

const mockShowDetails: ShowDetailsCardProps = {
  screen: "Screen 1",
  time: "10:00 AM",
  name: "ABC-Multiplex",
  movieName: "Dies Irae",
};

const renderSeatBooking = (
  showDetails: ShowDetailsCardProps = mockShowDetails
) => {
  mockLocation.mockReturnValue({
    state: { showDetails },
    pathname: "/seat-booking",
  });

  return render(
    <BrowserRouter>
      <SeatBooking />
    </BrowserRouter>
  );
};

describe("SeatBooking Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render ShowDetailsCard component", () => {
      renderSeatBooking();
      expect(screen.getByTestId("show-details-card")).toBeInTheDocument();
    });

    it("should render ScreenIndicator component", () => {
      renderSeatBooking();
      expect(screen.getByTestId("screen-indicator")).toBeInTheDocument();
    });

    it("should render SeatsSelection component", () => {
      renderSeatBooking();
      expect(screen.getByTestId("seats-selection")).toBeInTheDocument();
    });

    it("should render SeatPricingCard component", () => {
      renderSeatBooking();
      expect(screen.getByTestId("seat-pricing-card")).toBeInTheDocument();
    });

    it("should render BookingSummaryCard component", () => {
      renderSeatBooking();
      expect(screen.getByTestId("booking-summary-card")).toBeInTheDocument();
    });
  });

  describe("Props Passing", () => {
    it("should pass showDetails to ShowDetailsCard", () => {
      renderSeatBooking();
      const component = screen.getByTestId("show-details-card");
      expect(component).toHaveTextContent("Dies Irae");
    });

    it("should pass showDetails to SeatsSelection", () => {
      renderSeatBooking();
      const component = screen.getByTestId("seats-selection");
      expect(component).toHaveTextContent("Screen 1");
    });

    it("should pass showDetails to BookingSummaryCard", () => {
      renderSeatBooking();
      const component = screen.getByTestId("booking-summary-card");
      expect(component).toHaveTextContent("10:00 AM");
    });

    it("should pass correct screen name", () => {
      renderSeatBooking();
      expect(screen.getByText(/Screen 1/)).toBeInTheDocument();
    });

    it("should pass correct time", () => {
      renderSeatBooking();
      expect(screen.getByText(/10:00 AM/)).toBeInTheDocument();
    });

    it("should pass correct movie name", () => {
      renderSeatBooking();
      expect(screen.getByText(/Dies Irae/)).toBeInTheDocument();
    });

    it("should pass correct theatre name", () => {
      renderSeatBooking();
      expect(screen.getByText(/ABC-Multiplex/)).toBeInTheDocument();
    });
  });

  describe("State Management", () => {
    it("should fetch showDetails from location state", () => {
      mockLocation.mockReturnValue({
        state: { showDetails: mockShowDetails },
        pathname: "/seat-booking",
      });

      renderSeatBooking();
      expect(screen.getByText(/Dies Irae/)).toBeInTheDocument();
    });

    it("should handle undefined showDetails gracefully", () => {
      mockLocation.mockReturnValue({
        state: { showDetails: undefined },
        pathname: "/seat-booking",
      });

      render(
        <BrowserRouter>
          <SeatBooking />
        </BrowserRouter>
      );

      // Should render without errors even with undefined showDetails
      expect(screen.getByTestId("show-details-card")).toBeInTheDocument();
    });
  });

  describe("Different Show Details", () => {
    it("should handle different movie name", () => {
      const customShowDetails: ShowDetailsCardProps = {
        screen: "Screen 2",
        time: "02:00 PM",
        name: "XYZ-Multiplex",
        movieName: "Baahubali",
      };

      renderSeatBooking(customShowDetails);
      expect(screen.getByText(/Baahubali/)).toBeInTheDocument();
    });

    it("should handle different screen", () => {
      const customShowDetails: ShowDetailsCardProps = {
        screen: "Screen 5",
        time: "07:30 PM",
        name: "PQR-Cinema",
        movieName: "The Pet Detective",
      };

      renderSeatBooking(customShowDetails);
      expect(screen.getByText(/Screen 5/)).toBeInTheDocument();
    });

    it("should handle different time", () => {
      const customShowDetails: ShowDetailsCardProps = {
        screen: "Screen 3",
        time: "11:45 PM",
        name: "LMN-Multiplex",
        movieName: "Nellikkampoyil",
      };

      renderSeatBooking(customShowDetails);
      expect(screen.getByText(/11:45 PM/)).toBeInTheDocument();
    });

    it("should handle different theatre", () => {
      const customShowDetails: ShowDetailsCardProps = {
        screen: "Screen 1",
        time: "06:00 PM",
        name: "Grand Cinema",
        movieName: "Movie Name",
      };

      renderSeatBooking(customShowDetails);
      expect(screen.getByText(/Grand Cinema/)).toBeInTheDocument();
    });
  });

  describe("Component Integration", () => {
    it("should render all components together", () => {
      renderSeatBooking();

      expect(screen.getByTestId("show-details-card")).toBeInTheDocument();
      expect(screen.getByTestId("screen-indicator")).toBeInTheDocument();
      expect(screen.getByTestId("seats-selection")).toBeInTheDocument();
      expect(screen.getByTestId("seat-pricing-card")).toBeInTheDocument();
      expect(screen.getByTestId("booking-summary-card")).toBeInTheDocument();
    });
  });
});

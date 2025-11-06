import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingSummaryCard from "./booking-summary-card";
import type { ShowDetailsCardProps } from "../types";
import type { BookedSeatsRecord, SeatType } from "@/lib/types";

interface MockStoreState {
  bookedSeats: BookedSeatsRecord;
  setBookedSeats: (seats: BookedSeatsRecord) => void;
  uniqueMovieId: string | null;
}

type StoreSelector = (state: MockStoreState) => unknown;

const mockSetBookedSeats = vi.fn();
const mockNavigate = vi.fn();

const createMockStore = (
  overrides: Partial<MockStoreState> = {}
): MockStoreState => ({
  bookedSeats: {
    "movie-1": [{ A1: "silver" }, { A2: "silver" }, { B1: "gold" }],
  },
  setBookedSeats: mockSetBookedSeats,
  uniqueMovieId: "movie-1",
  ...overrides,
});

const { mockedUseEventAppStore } = vi.hoisted(() => ({
  mockedUseEventAppStore: vi.fn<(selector: StoreSelector) => unknown>(),
}));

vi.mock("@/store", () => ({
  // IMPORTANT: use the hoisted mock; don't reference any non-hoisted variables here
  default: (selector: StoreSelector) => mockedUseEventAppStore(selector),
}));

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../utils", () => ({
  getKeysArray: vi.fn(
    (seats: Array<Record<string, SeatType>>) =>
      seats?.flatMap((seat) => Object.keys(seat)) || []
  ),
  SEAT_CATEGORY_CONFIG: {
    silver: { label: "Silver", color: "bg-blue-500", price: 150 },
    gold: { label: "Gold", color: "bg-yellow-500", price: 200 },
    platinum: { label: "Platinum", color: "bg-purple-500", price: 250 },
  },
  TOTAL_SEATS: 8,
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={className} data-testid="card">
      {children}
    </div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="card-title">{children}</h2>
  ),
  CardContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={className} data-testid="card-content">
      {children}
    </div>
  ),
  CardFooter: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={className} data-testid="card-footer">
      {children}
    </div>
  ),
}));

vi.mock("@/components/ui/separator", () => ({
  Separator: () => <div data-testid="separator" />,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    disabled,
    onClick,
    className,
    variant,
  }: {
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
    variant?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-testid="button"
      data-variant={variant}
    >
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => (open ? <div data-testid="alert-dialog">{children}</div> : null),
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="alert-content">{children}</div>
  ),
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogTitle: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={className} data-testid="alert-title">
      {children}
    </div>
  ),
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="alert-description">{children}</div>
  ),
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogAction: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button onClick={onClick} data-testid="alert-action">
      {children}
    </button>
  ),
}));

const mockShowDetails: ShowDetailsCardProps = {
  screen: "Screen 1",
  time: "10:00 AM",
  name: "ABC-Multiplex",
  movieName: "Dies Irae",
};

beforeEach(() => {
  vi.clearAllMocks();
  // now we provide the real implementation for the hoisted mock
  mockedUseEventAppStore.mockImplementation((selector: StoreSelector) =>
    selector(createMockStore())
  );
});

describe("BookingSummaryCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the store mock to the default behaviour
    mockedUseEventAppStore.mockImplementation((selector) =>
      selector(createMockStore())
    );
  });

  describe("Rendering", () => {
    it("should render booking summary title", () => {
      render(<BookingSummaryCard {...mockShowDetails} />);
      expect(screen.getByText("Booking Summary")).toBeInTheDocument();
    });

    it("should render card footer with buttons", () => {
      render(<BookingSummaryCard {...mockShowDetails} />);
      expect(screen.getByTestId("card-footer")).toBeInTheDocument();
    });
  });

  describe("Seat Display", () => {
    it("should display number of selected seats", () => {
      render(<BookingSummaryCard {...mockShowDetails} />);
      expect(screen.getByText(/Seats:/)).toBeInTheDocument();
      expect(screen.getByText(/3\/8/)).toBeInTheDocument();
    });

    it("should display seat IDs", () => {
      render(<BookingSummaryCard {...mockShowDetails} />);
      expect(screen.getByText(/IDs:/)).toBeInTheDocument();
      expect(screen.getByText(/A1, A2, B1/)).toBeInTheDocument();
    });

    it("should display N/A when no seats selected", () => {
      mockedUseEventAppStore.mockImplementation((selector) =>
        selector({
          bookedSeats: {},
          setBookedSeats: mockSetBookedSeats,
          uniqueMovieId: "movie-1",
        })
      );

      render(<BookingSummaryCard {...mockShowDetails} />);
      expect(screen.getByText("N/A")).toBeInTheDocument();
    });
  });

  describe("Total Price Calculation", () => {
    it("should calculate total price correctly", () => {
      render(<BookingSummaryCard {...mockShowDetails} />);
      // A1 (silver: 150) + A2 (silver: 150) + B1 (gold: 200) = 500
      expect(screen.getByText(/₹500/)).toBeInTheDocument();
    });

    it("should display total price with rupee symbol", () => {
      render(<BookingSummaryCard {...mockShowDetails} />);
      expect(screen.getByText(/₹/)).toBeInTheDocument();
    });

    it("should update total when seats change", () => {
      mockedUseEventAppStore.mockImplementation((selector) =>
        selector({
          bookedSeats: { "movie-1": [{ A1: "gold" }] }, // 200
          setBookedSeats: mockSetBookedSeats,
          uniqueMovieId: "movie-1",
        })
      );

      render(<BookingSummaryCard {...mockShowDetails} />);
      expect(screen.getByText(/₹200/)).toBeInTheDocument();
    });
  });

  describe("Buttons", () => {
    it("should render Remove Selected Seats button", () => {
      render(<BookingSummaryCard {...mockShowDetails} />);
      expect(
        screen.getByRole("button", { name: /Remove selected seats/i })
      ).toBeInTheDocument();
    });

    it("should render Proceed to Payment button", () => {
      render(<BookingSummaryCard {...mockShowDetails} />);
      expect(
        screen.getByRole("button", { name: /Proceed to payment/i })
      ).toBeInTheDocument();
    });

    it("should disable buttons when no seats selected", () => {
      mockedUseEventAppStore.mockImplementation((selector) =>
        selector({
          bookedSeats: {},
          setBookedSeats: mockSetBookedSeats,
          uniqueMovieId: "movie-1",
        })
      );

      render(<BookingSummaryCard {...mockShowDetails} />);
      const buttons = screen.getAllByTestId("button");
      buttons.forEach((btn) => {
        expect(btn).toBeDisabled();
      });
    });

    it("should enable buttons when seats are selected", () => {
      render(<BookingSummaryCard {...mockShowDetails} />);
      const buttons = screen.getAllByTestId("button");
      buttons.forEach((btn) => {
        expect(btn).not.toBeDisabled();
      });
    });
  });

  describe("Remove Seats Alert", () => {
    it("should show alert when remove button clicked", async () => {
      const user = userEvent.setup();
      render(<BookingSummaryCard {...mockShowDetails} />);

      const removeBtn = screen.getByRole("button", {
        name: /Remove selected seats/i,
      });
      await user.click(removeBtn);

      expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();
    });

    it("should call clearBookedSeats when confirmed", async () => {
      const user = userEvent.setup();
      render(<BookingSummaryCard {...mockShowDetails} />);

      const removeBtn = screen.getByRole("button", {
        name: /Remove selected seats/i,
      });
      await user.click(removeBtn);

      const confirmBtn = screen.getByRole("button", { name: /Okay/i });
      await user.click(confirmBtn);

      expect(mockSetBookedSeats).toHaveBeenCalled();
    });
  });

  describe("Payment Navigation", () => {
    it("should navigate to payment page with booking data", async () => {
      const user = userEvent.setup();
      render(<BookingSummaryCard {...mockShowDetails} />);

      const proceedBtn = screen.getByRole("button", {
        name: /Proceed to payment/i,
      });
      await user.click(proceedBtn);

      expect(mockNavigate).toHaveBeenCalledWith(
        "/booking-summary",
        expect.objectContaining({
          state: expect.objectContaining({
            bookingData: expect.any(Object),
          }),
        })
      );
    });

    it("should include show details in booking data", async () => {
      const user = userEvent.setup();
      render(<BookingSummaryCard {...mockShowDetails} />);

      const proceedBtn = screen.getByRole("button", {
        name: /Proceed to payment/i,
      });
      await user.click(proceedBtn);

      const callArgs = mockNavigate.mock.calls[0];
      const bookingData = callArgs[1].state.bookingData;

      expect(bookingData).toMatchObject({
        screen: mockShowDetails.screen,
        time: mockShowDetails.time,
        name: mockShowDetails.name,
        movieName: mockShowDetails.movieName,
      });
    });

    it("should include total price in booking data", async () => {
      const user = userEvent.setup();
      render(<BookingSummaryCard {...mockShowDetails} />);

      const proceedBtn = screen.getByRole("button", {
        name: /Proceed to payment/i,
      });
      await user.click(proceedBtn);

      const callArgs = mockNavigate.mock.calls[0];
      const bookingData = callArgs[1].state.bookingData;

      expect(bookingData.totalPrice).toBe(500);
    });

    it("should include selected seat IDs in booking data", async () => {
      const user = userEvent.setup();
      render(<BookingSummaryCard {...mockShowDetails} />);

      const proceedBtn = screen.getByRole("button", {
        name: /Proceed to payment/i,
      });
      await user.click(proceedBtn);

      const callArgs = mockNavigate.mock.calls[0];
      const bookingData = callArgs[1].state.bookingData;

      expect(bookingData.selectedSeatIds).toEqual(["A1", "A2", "B1"]);
    });

    it("should include number of selected seats in booking data", async () => {
      const user = userEvent.setup();
      render(<BookingSummaryCard {...mockShowDetails} />);

      const proceedBtn = screen.getByRole("button", {
        name: /Proceed to payment/i,
      });
      await user.click(proceedBtn);

      const callArgs = mockNavigate.mock.calls[0];
      const bookingData = callArgs[1].state.bookingData;

      expect(bookingData.numberOfSelectedSeats).toBe(3);
    });
  });

  describe("Props Handling", () => {
    it("should accept ShowDetailsCardProps", () => {
      render(<BookingSummaryCard {...mockShowDetails} />);
      expect(screen.getByTestId("card")).toBeInTheDocument();
    });

    it("should handle different show details", () => {
      const customShowDetails: ShowDetailsCardProps = {
        screen: "Screen 5",
        time: "07:30 PM",
        name: "XYZ-Multiplex",
        movieName: "Baahubali",
      };

      render(<BookingSummaryCard {...customShowDetails} />);
      expect(screen.getByText("Booking Summary")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle no booked seats gracefully", () => {
      mockedUseEventAppStore.mockImplementation((selector) =>
        selector({
          bookedSeats: {},
          setBookedSeats: mockSetBookedSeats,
          uniqueMovieId: "movie-1",
        })
      );

      render(<BookingSummaryCard {...mockShowDetails} />);
      expect(screen.getByText("0/8")).toBeInTheDocument();
      expect(screen.getByText("₹0")).toBeInTheDocument();
    });

    it("should handle null uniqueMovieId", () => {
      mockedUseEventAppStore.mockImplementation((selector) =>
        selector({
          bookedSeats: {},
          setBookedSeats: mockSetBookedSeats,
          uniqueMovieId: null,
        })
      );

      render(<BookingSummaryCard {...mockShowDetails} />);
      expect(screen.getByText("0/8")).toBeInTheDocument();
    });

    it("should handle missing movie in bookedSeats", () => {
      mockedUseEventAppStore.mockImplementation((selector) =>
        selector({
          bookedSeats: { "other-movie": [] },
          setBookedSeats: mockSetBookedSeats,
          uniqueMovieId: "movie-1",
        })
      );

      render(<BookingSummaryCard {...mockShowDetails} />);
      expect(screen.getByText("0/8")).toBeInTheDocument();
    });
  });
});

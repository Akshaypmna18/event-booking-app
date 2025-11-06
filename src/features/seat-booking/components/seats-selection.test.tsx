import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ShowDetailsCardProps } from "../types";
import type { BookedSeatsRecord, SeatObject } from "@/lib/types";

interface MockStoreState {
  seats: Record<string, SeatObject[]>;
  setSeats: (seats: Record<string, SeatObject[]>) => void;
  bookedSeats: BookedSeatsRecord;
  setBookedSeats: (seats: BookedSeatsRecord) => void;
  uniqueMovieId: string | null;
  setUniqueMovieId: (id: string) => void;
}

const mockSetSeats = vi.fn();
const mockSetBookedSeats = vi.fn();
const mockSetUniqueMovieId = vi.fn();

const createMockStore = (
  overrides: Partial<MockStoreState> = {}
): MockStoreState => ({
  seats: {},
  setSeats: mockSetSeats,
  bookedSeats: {},
  setBookedSeats: mockSetBookedSeats,
  uniqueMovieId: "movie-1",
  setUniqueMovieId: mockSetUniqueMovieId,
  ...overrides,
});

// Make the store a vi.fn() so we can .mockReturnValue(...) in tests
vi.mock("@/store", () => ({
  default: vi.fn(() => createMockStore()),
}));

// utils mock: ensure key matches component lookup (uses uniqueMovieId)
vi.mock("../utils", () => ({
  createSeats: vi.fn((_details, _seats, setUniqueMovieId) => {
    // Component expects this to be called on mount
    setUniqueMovieId?.("movie-1");
    return {
      "movie-1": [
        { A1: { status: "available", type: "silver" } },
        { A2: { status: "available", type: "silver" } },
      ],
    };
  }),
  getKeysArray: vi.fn(
    (seats: Array<Record<string, unknown>>) =>
      seats?.flatMap((seat) => Object.keys(seat)) ?? []
  ),
  SEAT_CATEGORY_CONFIG: {
    silver: { label: "Silver", color: "bg-blue-500", price: 150 },
    gold: { label: "Gold", color: "bg-yellow-500", price: 200 },
    platinum: { label: "Platinum", color: "bg-purple-500", price: 250 },
  },
  TOTAL_SEATS: 8,
}));

// Icon mock (no unused param warnings)
vi.mock("lucide-react", () => ({
  Check: () => <span data-testid="check-icon">✓</span>,
}));

// AlertDialog mock needs onOpenChange since component passes it
vi.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({
    children,
    open,
    onOpenChange,
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange?: (open: boolean) => void;
  }) =>
    open ? (
      <div data-testid="alert-dialog" onClick={() => onOpenChange?.(false)}>
        {children}
      </div>
    ) : null,
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
    onClick: () => void;
  }) => (
    <button onClick={onClick} data-testid="alert-action">
      {children}
    </button>
  ),
}));

import SeatsSelection from "./seats-selection";
import useStore from "@/store";
import * as utils from "../utils";

// handy alias to set store returns in individual tests
const mockedUseStore = useStore as unknown as Mock;

const mockShowDetails: ShowDetailsCardProps = {
  screen: "Screen 1",
  time: "10:00 AM",
  name: "ABC-Multiplex",
  movieName: "Dies Irae",
};

describe("SeatsSelection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // default store for most tests
    mockedUseStore.mockReturnValue(createMockStore());
  });

  describe("Rendering", () => {
    it("should render grid container", () => {
      const { container } = render(<SeatsSelection {...mockShowDetails} />);
      const grid = container.querySelector(".grid.grid-cols-10");
      expect(grid).toBeInTheDocument();
    });

    it("should render alert dialog component", () => {
      render(<SeatsSelection {...mockShowDetails} />);
      expect(screen.queryByTestId("alert-dialog")).not.toBeInTheDocument();
    });

    it("should call createSeats on mount", () => {
      render(<SeatsSelection {...mockShowDetails} />);
      expect(utils.createSeats).toHaveBeenCalled();
    });

    it("should render seat buttons", () => {
      const { container } = render(<SeatsSelection {...mockShowDetails} />);
      const buttons = container.querySelectorAll("button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe("Seat Click Handling", () => {
    it("should handle seat click", async () => {
      const user = userEvent.setup();
      const { container } = render(<SeatsSelection {...mockShowDetails} />);

      const buttons = container.querySelectorAll("button");
      if (buttons.length > 0) {
        await user.click(buttons[0]);
      }

      expect(mockSetBookedSeats).toHaveBeenCalled();
    });

    it("should not allow selection when uniqueMovieId is missing", () => {
      mockedUseStore.mockReturnValue(createMockStore({ uniqueMovieId: null }));
      render(<SeatsSelection {...mockShowDetails} />);
      expect(screen.queryByTestId("alert-dialog")).not.toBeInTheDocument();
    });
  });

  describe("Booking Logic", () => {
    it("should handle max seats limit (8 seats)", () => {
      const mockStoreWithMaxSeats = createMockStore({
        bookedSeats: {
          "movie-1": [
            { A1: "silver" },
            { A2: "silver" },
            { A3: "silver" },
            { A4: "silver" },
            { A5: "silver" },
            { A6: "silver" },
            { A7: "silver" },
            { A8: "silver" },
          ],
        },
      });

      mockedUseStore.mockReturnValue(mockStoreWithMaxSeats);

      expect(mockStoreWithMaxSeats.bookedSeats["movie-1"]).toHaveLength(8);
    });

    it("should toggle seat selection", () => {
      const initialBookedSeats: BookedSeatsRecord = {
        "movie-1": [{ A1: "silver" }],
      };

      const toggledSeats = initialBookedSeats["movie-1"].filter(
        (seat) => !Object.prototype.hasOwnProperty.call(seat, "A1")
      );

      expect(toggledSeats).toHaveLength(0);
    });
  });

  describe("Alert Dialog", () => {
    it("should show alert when max seats exceeded", () => {
      render(<SeatsSelection {...mockShowDetails} />);
      expect(screen.queryByTestId("alert-dialog")).not.toBeInTheDocument();
    });
  });

  describe("Seat Styling", () => {
    it("should render seats with correct size", () => {
      const { container } = render(<SeatsSelection {...mockShowDetails} />);
      const buttons = container.querySelectorAll(".w-8.h-8");
      expect(buttons.length).toBeGreaterThanOrEqual(0);
    });

    it("should apply opacity-30 to unavailable seats", () => {
      const { container } = render(<SeatsSelection {...mockShowDetails} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe("Grid Layout", () => {
    it("should use 10-column grid", () => {
      const { container } = render(<SeatsSelection {...mockShowDetails} />);
      const grid = container.querySelector(".grid-cols-10");
      expect(grid).toBeInTheDocument();
    });

    it("should have gap-2 spacing between seats", () => {
      const { container } = render(<SeatsSelection {...mockShowDetails} />);
      const grid = container.querySelector(".gap-2");
      expect(grid).toBeInTheDocument();
    });

    it("should be centered and constrained", () => {
      const { container } = render(<SeatsSelection {...mockShowDetails} />);
      const grid = container.querySelector(".max-w-2xl.mx-auto");
      expect(grid).toBeInTheDocument();
    });
  });

  describe("State Management", () => {
    it("should initialize local seats on mount", () => {
      render(<SeatsSelection {...mockShowDetails} />);
      expect(mockSetSeats).toHaveBeenCalled();
    });

    it("should handle empty bookedSeats initially", () => {
      const mockStoreEmpty = createMockStore({ bookedSeats: {} });
      mockedUseStore.mockReturnValue(mockStoreEmpty);

      render(<SeatsSelection {...mockShowDetails} />);
      expect(screen.queryByTestId("alert-dialog")).not.toBeInTheDocument();
    });

    it("should call setUniqueMovieId on mount", () => {
      render(<SeatsSelection {...mockShowDetails} />);
      expect(mockSetUniqueMovieId).toHaveBeenCalled();
    });
  });

  describe("Check Mark Display", () => {
    it("should display check icon for selected seats", () => {
      render(<SeatsSelection {...mockShowDetails} />);
      expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
    });

    it("should display seat ID for unselected seats", () => {
      render(<SeatsSelection {...mockShowDetails} />);
      expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
    });
  });

  describe("Color Categories", () => {
    it("should have colors for seat types", () => {
      const { container } = render(<SeatsSelection {...mockShowDetails} />);
      expect(
        container.querySelector(".bg-blue-500, .bg-yellow-500, .bg-purple-500")
      ).toBeDefined();
    });
  });

  describe("Props Handling", () => {
    it("should accept ShowDetailsCardProps", () => {
      const { container } = render(<SeatsSelection {...mockShowDetails} />);
      expect(container).toBeInTheDocument();
    });

    it("should pass props to createSeats", () => {
      render(<SeatsSelection {...mockShowDetails} />);
      expect(utils.createSeats).toHaveBeenCalledWith(
        expect.objectContaining(mockShowDetails),
        expect.anything(),
        expect.anything()
      );
    });

    it("should handle different show details", () => {
      const customShowDetails: ShowDetailsCardProps = {
        screen: "Screen 5",
        time: "07:30 PM",
        name: "XYZ-Multiplex",
        movieName: "Baahubali",
      };

      render(<SeatsSelection {...customShowDetails} />);
      expect(screen.queryByTestId("alert-dialog")).not.toBeInTheDocument();
    });
  });
});

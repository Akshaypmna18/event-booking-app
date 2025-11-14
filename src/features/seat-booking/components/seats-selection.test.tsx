import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SeatsSelection from "./seats-selection";
import useStore from "@/store";
import * as utils from "../utils";
import * as services from "@/lib/services";
import type { ShowDetailsCardProps } from "../types";
import type { BookedSeatsRecord, SeatObject } from "@/lib/types";
import type { Mock } from "vitest";

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
  seats: {
    "movie-1": [
      { A1: { status: "available", type: "silver" } },
      { A2: { status: "available", type: "silver" } },
    ],
  },
  setSeats: mockSetSeats,
  bookedSeats: {},
  setBookedSeats: mockSetBookedSeats,
  uniqueMovieId: "movie-1",
  setUniqueMovieId: mockSetUniqueMovieId,
  ...overrides,
});

vi.mock("@/store", () => ({
  default: vi.fn(() => createMockStore()),
}));

vi.mock("../utils", () => ({
  createSeats: vi.fn((details, theatres, seats, setUniqueMovieId) => {
    setUniqueMovieId?.("movie-1");
    return {
      "movie-1": [
        { A1: { status: "available", type: "silver" } },
        { A2: { status: "available", type: "silver" } },
        { A3: { status: "booked", type: "silver" } },
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

vi.mock("@/lib/services", () => ({
  getTheatres: vi.fn(),
}));

vi.mock("@/lib/utils", () => ({
  getErrorMessage: vi.fn((error) => error?.message || "Unknown error"),
}));

vi.mock("lucide-react", () => ({
  Check: () => <span data-testid="check-icon">✓</span>,
}));

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
  AlertDialogContent: ({
    children,
  }: {
    children: React.ReactNode;
    onOpenAutoFocus?: (e: Event) => void;
  }) => <div data-testid="alert-content">{children}</div>,
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

vi.mock("@/components/LoadingFallback", () => ({
  default: () => <div data-testid="loading-fallback">Loading...</div>,
}));

const mockedUseStore = useStore as unknown as Mock;

const mockShowDetails: ShowDetailsCardProps = {
  screen: "Screen 1",
  time: "10:00 AM",
  name: "ABC-Multiplex",
  movieName: "Dies Irae",
};

const renderSeatsSelection = (
  props: ShowDetailsCardProps = mockShowDetails
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <SeatsSelection {...props} />
    </QueryClientProvider>
  );
};

describe("SeatsSelection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseStore.mockReturnValue(createMockStore());
    vi.mocked(services.getTheatres).mockResolvedValue([]);
  });

  describe("Layout Structure", () => {
    it("should render grid container", async () => {
      const { container } = renderSeatsSelection();
      await waitFor(() => {
        const grid = container.querySelector(".grid.grid-cols-10");
        expect(grid).toBeInTheDocument();
      });
    });

    it("should use 10-column grid layout", async () => {
      const { container } = renderSeatsSelection();
      await waitFor(() => {
        const grid = container.querySelector(".grid-cols-10");
        expect(grid).toBeInTheDocument();
      });
    });

    it("should have proper spacing and centering", async () => {
      const { container } = renderSeatsSelection();
      await waitFor(() => {
        const grid = container.querySelector(".gap-2.max-w-2xl.mx-auto");
        expect(grid).toBeInTheDocument();
      });
    });
  });

  describe("Seat Rendering", () => {
    it("should render seat buttons", async () => {
      const { container } = renderSeatsSelection();
      await waitFor(() => {
        const buttons = container.querySelectorAll("button");
        expect(buttons.length).toBeGreaterThan(0);
      });
    });

    it("should render available seats as clickable", async () => {
      renderSeatsSelection();
      await waitFor(() => {
        const a1Button = screen.getByText("A1");
        expect(a1Button.closest("button")).not.toBeDisabled();
      });
    });

    it("should render booked seats as disabled", async () => {
      renderSeatsSelection();
      await waitFor(() => {
        const a3Button = screen.getByText("A3");
        expect(a3Button.closest("button")).toBeDisabled();
      });
    });

    it("should apply correct size to seat buttons", async () => {
      const { container } = renderSeatsSelection();
      await waitFor(() => {
        const buttons = container.querySelectorAll(".w-8.h-8");
        expect(buttons.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Seat Selection Logic", () => {
    it("should handle seat click", async () => {
      const user = userEvent.setup();
      renderSeatsSelection();

      await waitFor(() => {
        expect(screen.getByText("A1")).toBeInTheDocument();
      });

      const a1Button = screen.getByText("A1").closest("button");
      await user.click(a1Button!);

      expect(mockSetBookedSeats).toHaveBeenCalled();
    });

    it("should show check icon for selected seats", async () => {
      mockedUseStore.mockReturnValue(
        createMockStore({
          bookedSeats: {
            "movie-1": [{ A1: "silver" }],
          },
        })
      );

      renderSeatsSelection();

      await waitFor(() => {
        expect(screen.getByTestId("check-icon")).toBeInTheDocument();
      });
    });
  });

  describe("Alert Dialog", () => {
    it("should show alert when exceeding max seats", async () => {
      const user = userEvent.setup();

      mockedUseStore.mockReturnValue(
        createMockStore({
          seats: {
            "movie-1": [
              { A1: { status: "available", type: "silver" } },
              { A2: { status: "available", type: "silver" } },
              { A3: { status: "available", type: "silver" } },
            ],
          },
          bookedSeats: {
            "movie-1": [
              { A1: "silver" },
              { A2: "silver" },
              { B1: "silver" },
              { B2: "silver" },
              { B3: "silver" },
              { B4: "silver" },
              { B5: "silver" },
              { B6: "silver" },
            ],
          },
        })
      );

      renderSeatsSelection();

      await waitFor(() => {
        expect(screen.getByText("A3")).toBeInTheDocument();
      });

      // A3 is NOT booked yet, clicking it will be the 9th seat
      const a3Button = screen.getByText("A3").closest("button");
      await user.click(a3Button!);

      await waitFor(() => {
        expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();
      });
    });

    it("should close alert when action button clicked", async () => {
      const user = userEvent.setup();

      mockedUseStore.mockReturnValue(
        createMockStore({
          seats: {
            "movie-1": [
              { A1: { status: "available", type: "silver" } },
              { A2: { status: "available", type: "silver" } },
              { A3: { status: "available", type: "silver" } },
            ],
          },
          bookedSeats: {
            "movie-1": [
              { A1: "silver" },
              { A2: "silver" },
              { B1: "silver" },
              { B2: "silver" },
              { B3: "silver" },
              { B4: "silver" },
              { B5: "silver" },
              { B6: "silver" },
            ],
          },
        })
      );

      renderSeatsSelection();

      await waitFor(() => {
        expect(screen.getByText("A3")).toBeInTheDocument();
      });

      const a3Button = screen.getByText("A3").closest("button");
      await user.click(a3Button!);

      await waitFor(() => {
        expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();
      });

      const okayButton = screen.getByTestId("alert-action");
      await user.click(okayButton);

      await waitFor(() => {
        expect(screen.queryByTestId("alert-dialog")).not.toBeInTheDocument();
      });
    });
  });

  describe("Loading and Error States", () => {
    it("should show loading state", () => {
      vi.mocked(services.getTheatres).mockImplementation(
        () => new Promise(() => {})
      );

      renderSeatsSelection();

      expect(screen.getByTestId("loading-fallback")).toBeInTheDocument();
    });

    it("should show error message when query fails", async () => {
      vi.mocked(services.getTheatres).mockRejectedValue(
        new Error("Failed to load")
      );

      renderSeatsSelection();

      expect(
        await screen.findByText(/Error loading movies/i)
      ).toBeInTheDocument();
      expect(await screen.findByText(/Failed to load/i)).toBeInTheDocument();
    });
  });

  describe("State Management", () => {
    it("should call setSeats on mount", async () => {
      renderSeatsSelection();

      await waitFor(() => {
        expect(mockSetSeats).toHaveBeenCalled();
      });
    });

    it("should call setUniqueMovieId on mount", async () => {
      renderSeatsSelection();

      await waitFor(() => {
        expect(mockSetUniqueMovieId).toHaveBeenCalled();
      });
    });

    it("should call createSeats with show details", async () => {
      renderSeatsSelection();

      await waitFor(() => {
        expect(utils.createSeats).toHaveBeenCalledWith(
          expect.objectContaining(mockShowDetails),
          expect.anything(),
          expect.anything(),
          expect.anything()
        );
      });
    });
  });
});

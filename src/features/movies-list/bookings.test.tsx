import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Bookings from "./bookings";
import * as services from "@/lib/services";
import type { BookingsResponse } from "@/lib/types";

type CarouselProps = { children: React.ReactNode };

vi.mock("@/lib/services", () => ({
  getBookings: vi.fn(),
}));

vi.mock("@/components/ui/carousel", () => ({
  Carousel: ({ children }: CarouselProps) => (
    <div data-testid="carousel">{children}</div>
  ),
  CarouselContent: ({ children }: CarouselProps) => <div>{children}</div>,
  CarouselItem: ({ children }: CarouselProps) => <div>{children}</div>,
  CarouselNext: () => <button>Next</button>,
  CarouselPrevious: () => <button>Previous</button>,
}));

vi.mock("@/components/ui/separator", () => ({
  Separator: () => <hr data-testid="separator" />,
}));

const mockBookingsData: BookingsResponse = {
  key: "bookings",
  count: 2,
  bookings: [
    {
      movieName: "Booking Movie 1",
      theatreName: "Theatre 1",
      screen: "Screen 1",
      time: "7:00 PM",
      image: "https://example.com/poster1.jpg",
      selectedSeats: ["A1", "A2"],
      price: 300,
    },
    {
      movieName: "Booking Movie 2",
      theatreName: "Theatre 2",
      screen: "Screen 2",
      time: "9:00 PM",
      image: "https://example.com/poster2.jpg",
      selectedSeats: ["B1", "B2"],
      price: 400,
    },
  ],
};

const renderBookings = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <Bookings />
    </QueryClientProvider>
  );
};

describe("Bookings Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Loading State", () => {
    it("should render nothing when not fetched", () => {
      vi.mocked(services.getBookings).mockImplementation(
        () => new Promise(() => {})
      );

      const { container } = renderBookings();

      expect(container.firstChild).toBeNull();
    });
  });

  describe("Error State", () => {
    it("should display heading when error occurs", async () => {
      vi.mocked(services.getBookings).mockRejectedValue(
        new Error("Failed to fetch")
      );

      renderBookings();

      const heading = await screen.findByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Your bookings");
    });

    it("should display error message", async () => {
      vi.mocked(services.getBookings).mockRejectedValue(
        new Error("Network error")
      );

      renderBookings();

      expect(
        await screen.findByText(/Error loading bookings/i)
      ).toBeInTheDocument();
      expect(await screen.findByText(/Network error/i)).toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("should render nothing when no bookings", async () => {
      vi.mocked(services.getBookings).mockResolvedValue({
        key: "bookings",
        count: 0,
        bookings: [],
      });

      const { container } = renderBookings();

      await waitFor(() => {
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe("Success State with Bookings", () => {
    it("should render heading with count", async () => {
      vi.mocked(services.getBookings).mockResolvedValue(mockBookingsData);

      renderBookings();

      const heading = await screen.findByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Your bookings (2)");
    });

    it("should render carousel", async () => {
      vi.mocked(services.getBookings).mockResolvedValue(mockBookingsData);

      renderBookings();

      const carousel = await screen.findByTestId("carousel");
      expect(carousel).toBeInTheDocument();
    });

    it("should render booking cards with movie names", async () => {
      vi.mocked(services.getBookings).mockResolvedValue(mockBookingsData);

      renderBookings();

      expect(await screen.findByText("Booking Movie 1")).toBeInTheDocument();
      expect(await screen.findByText("Booking Movie 2")).toBeInTheDocument();
    });

    it("should render correct number of booking cards", async () => {
      vi.mocked(services.getBookings).mockResolvedValue(mockBookingsData);

      renderBookings();

      await screen.findByText("Booking Movie 1");

      const headings = screen.getAllByRole("heading", { level: 3 });
      expect(headings).toHaveLength(2);
    });

    it("should render carousel navigation buttons", async () => {
      vi.mocked(services.getBookings).mockResolvedValue(mockBookingsData);

      renderBookings();

      await screen.findByTestId("carousel");

      const nextButton = screen.getByRole("button", { name: /next/i });
      const prevButton = screen.getByRole("button", { name: /previous/i });

      expect(nextButton).toBeInTheDocument();
      expect(prevButton).toBeInTheDocument();
    });

    it("should render separator", async () => {
      vi.mocked(services.getBookings).mockResolvedValue(mockBookingsData);

      renderBookings();

      const separator = await screen.findByTestId("separator");
      expect(separator).toBeInTheDocument();
    });
  });

  describe("Query Logic", () => {
    it("should call getBookings service", async () => {
      vi.mocked(services.getBookings).mockResolvedValue(mockBookingsData);

      renderBookings();

      await screen.findByRole("heading", { level: 2 });

      expect(services.getBookings).toHaveBeenCalled();
    });
  });
});

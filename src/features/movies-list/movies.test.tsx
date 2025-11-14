import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Movies from "./movies";
import * as services from "@/lib/services";
import { BrowserRouter } from "react-router";

vi.mock("@/lib/services", () => ({
  getMovies: vi.fn(),
}));

const mockMovies = [
  {
    id: "1",
    title: "Movie One",
    genre: "Action",
    language: "English",
    releaseDate: "2025-01-01",
    duration: "120 min",
    rating: 4.5,
    poster: "https://example.com/poster1.jpg",
    description: "Action movie",
    cast: ["Actor One"],
    director: "Director One",
    theatres: [],
  },
  {
    id: "2",
    title: "Movie Two",
    genre: "Comedy",
    language: "English",
    releaseDate: "2025-02-01",
    duration: "110 min",
    rating: 4.0,
    poster: "https://example.com/poster2.jpg",
    description: "Comedy movie",
    cast: ["Actor Two"],
    director: "Director Two",
    theatres: [],
  },
];

const renderMovies = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Movies />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe("Movies Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Layout Structure", () => {
    it("should render heading", async () => {
      vi.mocked(services.getMovies).mockResolvedValue(mockMovies);
      renderMovies();

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it("should render 4 skeleton cards when loading", async () => {
      vi.mocked(services.getMovies).mockImplementation(
        () => new Promise(() => {})
      );

      renderMovies();

      const skeletons = screen.getAllByTestId("movie-card-skelton");
      expect(skeletons).toHaveLength(4);
    });
  });

  describe("Error State", () => {
    it("should display error message when query fails", async () => {
      vi.mocked(services.getMovies).mockRejectedValue(
        new Error("Failed to fetch")
      );

      renderMovies();

      const errorHeading = await screen.findByText(/Error loading movies/i);
      expect(errorHeading).toBeInTheDocument();
    });
  });

  describe("Success State", () => {
    it("should render movie cards when data loads", async () => {
      vi.mocked(services.getMovies).mockResolvedValue(mockMovies);

      renderMovies();

      expect(await screen.findByText("Movie One")).toBeInTheDocument();
      expect(await screen.findByText("Movie Two")).toBeInTheDocument();
    });
  });
});

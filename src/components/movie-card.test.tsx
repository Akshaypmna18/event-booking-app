import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import MovieCard from "@/components/movie-card";
import { type Movie } from "@/lib/types";
import { mockNavigate } from "@/test/setup";

const mockMovie: Movie = {
  id: "movie-1",
  title: "Dies Irae",
  genre: "Horror/Thriller",
  language: "Malayalam",
  duration: "120 min",
  rating: 4.5,
  poster: "https://example.com/poster.jpg",
  description:
    "A wealthy young architect named Rohan faces terrifying supernatural events after the suicide of his schoolmate.",
  cast: ["Pranav Mohanlal", "Sushmitha Bhatt", "Shine Tom Chacko"],
  director: "Rahul Sadasivan",
  theatres: [
    {
      name: "ABC-Multiplex",
      shows: [
        {
          screen: "Screen 1",
          time: "10:00 AM",
        },
      ],
    },
  ],
};

// Helper function to render component
const renderMovieCard = (movie: Movie = mockMovie, isMovieListPage = true) => {
  return render(
    <BrowserRouter>
      <MovieCard movie={movie} isMovieListPage={isMovieListPage} />
    </BrowserRouter>
  );
};

describe("MovieCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render movie title", () => {
      renderMovieCard();
      expect(screen.getByText("Dies Irae")).toBeInTheDocument();
    });

    it("should render movie rating", () => {
      renderMovieCard();
      expect(screen.getByText(/4\.5/)).toBeInTheDocument();
    });

    it("should render movie genre", () => {
      renderMovieCard();
      expect(screen.getByText(/Horror\/Thriller/)).toBeInTheDocument();
    });

    it("should render movie language", () => {
      renderMovieCard();
      expect(screen.getByText(/Malayalam/)).toBeInTheDocument();
    });

    it("should render movie duration", () => {
      renderMovieCard();
      expect(screen.getByText(/120 min/)).toBeInTheDocument();
    });

    it("should render movie description", () => {
      renderMovieCard();
      expect(
        screen.getByText(/A wealthy young architect named Rohan/)
      ).toBeInTheDocument();
    });

    it("should render all cast members", () => {
      renderMovieCard();
      expect(screen.getByText(/Pranav Mohanlal/)).toBeInTheDocument();
      expect(screen.getByText(/Sushmitha Bhatt/)).toBeInTheDocument();
      expect(screen.getByText(/Shine Tom Chacko/)).toBeInTheDocument();
    });

    it("should render director name", () => {
      renderMovieCard();
      expect(screen.getByText(/Rahul Sadasivan/)).toBeInTheDocument();
    });

    it("should render movie poster with correct alt text", () => {
      renderMovieCard();
      const poster = screen.getByAltText("Dies Irae");
      expect(poster).toBeInTheDocument();
      expect(poster).toHaveAttribute("src", "https://example.com/poster.jpg");
    });
  });

  describe("Conditional Book Button", () => {
    it("should render Book button when isMovieListPage is true", () => {
      renderMovieCard(mockMovie, true);
      const bookButton = screen.getByRole("button", { name: /book/i });
      expect(bookButton).toBeInTheDocument();
    });

    it("should NOT render Book button when isMovieListPage is false", () => {
      renderMovieCard(mockMovie, false);
      const bookButton = screen.queryByRole("button", { name: /book/i });
      expect(bookButton).not.toBeInTheDocument();
    });

    it("should render Book button by default (when isMovieListPage not specified)", () => {
      render(
        <BrowserRouter>
          <MovieCard movie={mockMovie} />
        </BrowserRouter>
      );
      const bookButton = screen.queryByRole("button", { name: /book/i });
      expect(bookButton).not.toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should navigate to theatre list when Book button is clicked", async () => {
      const user = userEvent.setup();
      renderMovieCard();

      const bookButton = screen.getByRole("button", { name: /book/i });
      await user.click(bookButton);

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/theatre-list", {
        state: { movie: mockMovie },
      });
    });

    it("should pass complete movie data when navigating", async () => {
      const user = userEvent.setup();
      renderMovieCard();

      const bookButton = screen.getByRole("button", { name: /book/i });
      await user.click(bookButton);

      const navigationCall = mockNavigate.mock.calls[0];
      expect(navigationCall[1].state.movie).toEqual(mockMovie);
    });
  });
});

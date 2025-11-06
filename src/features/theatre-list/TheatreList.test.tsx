import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import TheatreList from "./TheatreList";
import { type Movie } from "@/lib/types";
import { mockLocation } from "@/test/setup";

const mockMovie: Movie = {
  id: "movie-1",
  title: "Dies Irae",
  genre: "Horror/Thriller",
  language: "Malayalam",
  duration: "120 min",
  rating: 4.5,
  poster: "https://example.com/poster.jpg",
  description:
    "A wealthy young architect named Rohan faces terrifying supernatural events.",
  cast: ["Pranav Mohanlal", "Sushmitha Bhatt"],
  director: "Rahul Sadasivan",
  theatres: [
    {
      name: "ABC-Multiplex",
      shows: [
        { screen: "Screen 1", time: "10:00 AM" },
        { screen: "Screen 2", time: "01:30 PM" },
      ],
    },
    {
      name: "XYZ-Multiplex",
      shows: [
        { screen: "Screen 1", time: "02:00 PM" },
        { screen: "Screen 3", time: "05:00 PM" },
      ],
    },
  ],
};

const renderTheatreList = (movie: Movie | null = mockMovie) => {
  mockLocation.mockReturnValue({
    state: { movie },
    pathname: "/theatre-list",
  });

  return render(
    <BrowserRouter>
      <TheatreList />
    </BrowserRouter>
  );
};

describe("TheatreList Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Page Structure", () => {
    it("should render page heading", () => {
      renderTheatreList();
      expect(screen.getByText("Available Theatres")).toBeInTheDocument();
    });

    it("should render movie card with movie details", () => {
      renderTheatreList();
      expect(screen.getByText("Dies Irae")).toBeInTheDocument();
      expect(screen.getByText(/Pranav Mohanlal/)).toBeInTheDocument();
    });

    it("should have container with proper classes", () => {
      const { container } = renderTheatreList();
      const section = container.querySelector("section");
      expect(section).toHaveClass("container", "mx-auto", "px-4", "py-8");
    });
  });

  describe("Theatre Rendering", () => {
    it("should render all theatres from movie data", () => {
      renderTheatreList();

      expect(screen.getByText("ABC-Multiplex")).toBeInTheDocument();
      expect(screen.getByText("XYZ-Multiplex")).toBeInTheDocument();
    });

    it("should render correct number of theatre cards", () => {
      renderTheatreList();

      // Both theatre names should appear
      const abcTheatre = screen.getByText("ABC-Multiplex");
      const xyzTheatre = screen.getByText("XYZ-Multiplex");

      expect(abcTheatre).toBeInTheDocument();
      expect(xyzTheatre).toBeInTheDocument();
    });

    it("should render shows for each theatre", () => {
      renderTheatreList();

      // Use getAllByText for duplicate screen names
      const screen1Elements = screen.getAllByText("Screen 1");
      expect(screen1Elements).toHaveLength(2); // ABC and XYZ both have Screen 1

      // Unique screens - can use getByText
      expect(screen.getByText("Screen 2")).toBeInTheDocument();
      expect(screen.getByText("Screen 3")).toBeInTheDocument();

      // Times are unique - can use getByText
      expect(screen.getByText("10:00 AM")).toBeInTheDocument();
      expect(screen.getByText("01:30 PM")).toBeInTheDocument();
      expect(screen.getByText("02:00 PM")).toBeInTheDocument();
      expect(screen.getByText("05:00 PM")).toBeInTheDocument();
    });

    it("should render all screen headings", () => {
      renderTheatreList();

      const screenHeadings = screen.getAllByRole("heading", { level: 4 });
      expect(screenHeadings.length).toBeGreaterThan(0);
    });
  });

  describe("No Movie Data Handling", () => {
    it("should display message when no movie data is available", () => {
      renderTheatreList(null);

      expect(screen.getByText("No movie data available")).toBeInTheDocument();
    });

    it("should not render movie card when no movie data", () => {
      renderTheatreList(null);

      expect(screen.queryByText("Dies Irae")).not.toBeInTheDocument();
    });

    it("should not render theatres when no movie data", () => {
      renderTheatreList(null);

      expect(screen.queryByText("ABC-Multiplex")).not.toBeInTheDocument();
      expect(screen.queryByText("Available Theatres")).not.toBeInTheDocument();
    });
  });

  describe("Component Integration", () => {
    it("should render MovieCard component", () => {
      renderTheatreList();

      // Check if MovieCard rendered by verifying movie title
      const movieTitle = screen.getByText("Dies Irae");
      expect(movieTitle).toBeInTheDocument();
    });

    it("should render multiple TheatreCard components", () => {
      renderTheatreList();

      // Verify both theatre names (rendered by TheatreCard)
      const theatre1 = screen.getByRole("heading", {
        name: "ABC-Multiplex",
        level: 2,
      });
      const theatre2 = screen.getByRole("heading", {
        name: "XYZ-Multiplex",
        level: 2,
      });

      expect(theatre1).toBeInTheDocument();
      expect(theatre2).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle movie with no theatres", () => {
      const movieWithNoTheatres: Movie = {
        ...mockMovie,
        theatres: [],
      };

      renderTheatreList(movieWithNoTheatres);

      expect(screen.getByText("Available Theatres")).toBeInTheDocument();
      expect(screen.queryByText("ABC-Multiplex")).not.toBeInTheDocument();
    });

    it("should handle movie with single theatre", () => {
      const movieWithOneTheatre: Movie = {
        ...mockMovie,
        theatres: [
          {
            name: "ABC-Multiplex",
            shows: [{ screen: "Screen 1", time: "10:00 AM" }],
          },
        ],
      };

      renderTheatreList(movieWithOneTheatre);

      expect(screen.getByText("ABC-Multiplex")).toBeInTheDocument();
      expect(screen.queryByText("XYZ-Multiplex")).not.toBeInTheDocument();
    });
  });
});

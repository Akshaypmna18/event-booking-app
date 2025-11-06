import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import MoviesList from "./MoviesList";

// Mock the movies data
vi.mock("@/data/movies.json", () => ({
  default: [
    {
      id: "1",
      title: "Dies Irae",
      genre: "Horror/Thriller",
      language: "Malayalam",
      releaseDate: "2025-10-31",
      duration: "120 min",
      rating: 4.5,
      poster: "https://example.com/poster1.jpg",
      description:
        "A wealthy young architect named Rohan faces terrifying supernatural events.",
      cast: ["Pranav Mohanlal", "Sushmitha Bhatt"],
      director: "Rahul Sadasivan",
      theatres: [],
    },
    {
      id: "2",
      title: "Nellikkampoyil Night Riders",
      genre: "Horror/Comedy",
      language: "Malayalam",
      releaseDate: "2025-10-23",
      duration: "135 min",
      rating: 3.5,
      poster: "https://example.com/poster2.jpg",
      description: "Set in a border village wrapped in age-old myths.",
      cast: ["Mathew Thomas", "Roshan Shanavas"],
      director: "Noufal Abdullah",
      theatres: [],
    },
    {
      id: "3",
      title: "The Pet Detective",
      genre: "Action/Comedy",
      language: "Malayalam",
      releaseDate: "2025-10-16",
      duration: "145 min",
      rating: 4.0,
      poster: "https://example.com/poster3.jpg",
      description:
        "Private detective Tony Jose Alula takes on a mysterious case.",
      cast: ["Sharaf U Dheen", "Anupama Parameswaran"],
      director: "Praneesh Vijayan",
      theatres: [],
    },
    {
      id: "4",
      title: "Baahubali: The Beginning",
      genre: "Action/Fantasy",
      language: "Malayalam",
      releaseDate: "2015-07-10",
      duration: "159 min",
      rating: 4.4,
      poster: "https://example.com/poster4.jpg",
      description: "An epic fantasy action film.",
      cast: ["Prabhas", "Rana Daggubati"],
      director: "S.S. Rajamouli",
      theatres: [],
    },
  ],
}));

// Helper function to render component
const renderMoviesList = () => {
  return render(
    <BrowserRouter>
      <MoviesList />
    </BrowserRouter>
  );
};

describe("MoviesList Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Page Structure", () => {
    it("should render page heading", () => {
      renderMoviesList();
      // expect(screen.getByText("Now Showing")).toBeInTheDocument(); prefer heading is mandatory rather that specific text
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("should render page subtitle", () => {
      renderMoviesList();
      // expect(        screen.getByText("Book your tickets for the latest movies")      ).toBeInTheDocument(); prefer sub-heading is mandatory rather that specific text
      const subtitle = screen.getByTestId("page-subtitle");
      expect(subtitle).toBeInTheDocument();
    });
  });

  describe("Movies Rendering", () => {
    it("should render all movies from data", () => {
      renderMoviesList();

      expect(screen.getByText("Dies Irae")).toBeInTheDocument();
      expect(
        screen.getByText("Nellikkampoyil Night Riders")
      ).toBeInTheDocument();
      expect(screen.getByText("The Pet Detective")).toBeInTheDocument();
      expect(screen.getByText("Baahubali: The Beginning")).toBeInTheDocument();
    });

    it("should render correct number of movie cards", () => {
      renderMoviesList();

      const bookButtons = screen.getAllByRole("button", { name: /book/i });
      expect(bookButtons).toHaveLength(4);
    });

    it("should render movies with different genres", () => {
      renderMoviesList();

      expect(screen.getByText(/Horror\/Thriller/)).toBeInTheDocument();
      expect(screen.getByText(/Horror\/Comedy/)).toBeInTheDocument();
      expect(screen.getByText(/Action\/Comedy/)).toBeInTheDocument();
      expect(screen.getByText(/Action\/Fantasy/)).toBeInTheDocument();
    });

    it("should render all movie ratings", () => {
      renderMoviesList();

      expect(screen.getByTestId("rating-1")).toHaveTextContent(/⭐\s*4\.5/);
      expect(screen.getByTestId("rating-2")).toHaveTextContent(/⭐\s*3\.5/);
      expect(screen.getByTestId("rating-3")).toHaveTextContent(/⭐\s*4/);
      expect(screen.getByTestId("rating-4")).toHaveTextContent(/⭐\s*4\.4/);
    });
  });

  describe("Movie Data Display", () => {
    it("should display directors for all movies", () => {
      renderMoviesList();

      expect(screen.getByText(/Rahul Sadasivan/)).toBeInTheDocument();
      expect(screen.getByText(/Noufal Abdullah/)).toBeInTheDocument();
      expect(screen.getByText(/Praneesh Vijayan/)).toBeInTheDocument();
      expect(screen.getByText(/S\.S\. Rajamouli/)).toBeInTheDocument();
    });

    it("should display cast members for all movies", () => {
      renderMoviesList();

      expect(screen.getByText(/Pranav Mohanlal/)).toBeInTheDocument();
      expect(screen.getByText(/Mathew Thomas/)).toBeInTheDocument();
      expect(screen.getByText(/Sharaf U Dheen/)).toBeInTheDocument();
      expect(screen.getByText(/Prabhas/)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have accessible buttons for all movies", () => {
      renderMoviesList();

      const buttons = screen.getAllByRole("button", { name: /book/i });
      buttons.forEach((button) => {
        expect(button).toBeInTheDocument();
      });
    });

    it("should have alt text for all movie posters", () => {
      renderMoviesList();

      const diesIraePoster = screen.getByAltText("Dies Irae");
      const nightRidersPoster = screen.getByAltText(
        "Nellikkampoyil Night Riders"
      );
      const petDetectivePoster = screen.getByAltText("The Pet Detective");
      const baahubaliPoster = screen.getByAltText("Baahubali: The Beginning");

      expect(diesIraePoster).toBeInTheDocument();
      expect(nightRidersPoster).toBeInTheDocument();
      expect(petDetectivePoster).toBeInTheDocument();
      expect(baahubaliPoster).toBeInTheDocument();
    });
  });
});

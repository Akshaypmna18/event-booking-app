import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import MoviesList from "./MoviesList";

vi.mock("./movies", () => ({
  default: () => <div data-testid="movies-section">Movies Section</div>,
}));

vi.mock("./bookings", () => ({
  default: () => <div data-testid="bookings-section">Bookings Section</div>,
}));

const renderMoviesList = () => {
  return render(
    <BrowserRouter>
      <MoviesList />
    </BrowserRouter>
  );
};

describe("MoviesList Page", () => {
  describe("Page Structure", () => {
    it("should render page heading", () => {
      renderMoviesList();
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("should render page subtitle", () => {
      renderMoviesList();
      const subtitle = screen.getByTestId("page-subtitle");
      expect(subtitle).toBeInTheDocument();
    });
  });

  describe("Child Components", () => {
    it("should render BookingsSection component", () => {
      renderMoviesList();
      const bookingsSection = screen.getByTestId("bookings-section");
      expect(bookingsSection).toBeInTheDocument();
    });

    it("should render MoviesSection component", () => {
      renderMoviesList();
      const moviesSection = screen.getByTestId("movies-section");
      expect(moviesSection).toBeInTheDocument();
    });

    it("should render both sections in correct order", () => {
      renderMoviesList();
      const bookingsSection = screen.getByTestId("bookings-section");
      const moviesSection = screen.getByTestId("movies-section");

      expect(bookingsSection).toBeInTheDocument();
      expect(moviesSection).toBeInTheDocument();
    });
  });
});

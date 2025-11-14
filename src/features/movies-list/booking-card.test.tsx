import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingMovieCard from "./booking-card";

const mockBooking = {
  id: "1",
  movieName: "Test Movie",
  theatreName: "Test Theatre",
  screen: "Screen 1",
  time: "7:00 PM",
  image: "https://example.com/poster.jpg",
  selectedSeats: ["A1", "A2", "A3"],
  price: 450,
};

describe("BookingMovieCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Card Layout", () => {
    it("should render movie name as heading", () => {
      render(<BookingMovieCard movie={mockBooking} />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Test Movie");
    });

    it("should render theatre name", () => {
      render(<BookingMovieCard movie={mockBooking} />);

      expect(screen.getByText("Test Theatre")).toBeInTheDocument();
    });

    it("should render movie image with alt text", () => {
      render(<BookingMovieCard movie={mockBooking} />);

      const image = screen.getByAltText("Test MovieTest Theatre");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "https://example.com/poster.jpg");
    });

    it("should render screen and time badges", () => {
      render(<BookingMovieCard movie={mockBooking} />);

      expect(screen.getByText("Screen 1")).toBeInTheDocument();
      expect(screen.getByText("7:00 PM")).toBeInTheDocument();
    });
  });

  describe("Dialog Logic", () => {
    it("should not show dialog by default", () => {
      render(<BookingMovieCard movie={mockBooking} />);

      const dialogTitle = screen.queryByText("Booking Details");
      expect(dialogTitle).not.toBeInTheDocument();
    });

    it("should open dialog when card is clicked", async () => {
      const user = userEvent.setup();
      render(<BookingMovieCard movie={mockBooking} />);

      const card = screen.getByRole("heading", { level: 3 }).closest("div");
      await user.click(card!);

      const dialogTitle = await screen.findByText("Booking Details");
      expect(dialogTitle).toBeInTheDocument();
    });

    it("should show movie details in dialog", async () => {
      const user = userEvent.setup();
      render(<BookingMovieCard movie={mockBooking} />);

      const card = screen.getByRole("heading", { level: 3 }).closest("div");
      await user.click(card!);

      expect(await screen.findByText("Movie")).toBeInTheDocument();
      expect(await screen.findByText("Theatre")).toBeInTheDocument();
    });
  });

  describe("Props Display in Dialog", () => {
    it("should display selected seats", async () => {
      const user = userEvent.setup();
      render(<BookingMovieCard movie={mockBooking} />);

      const card = screen.getByRole("heading", { level: 3 }).closest("div");
      await user.click(card!);

      expect(await screen.findByText("A1")).toBeInTheDocument();
      expect(await screen.findByText("A2")).toBeInTheDocument();
      expect(await screen.findByText("A3")).toBeInTheDocument();
    });

    it("should display price", async () => {
      const user = userEvent.setup();
      render(<BookingMovieCard movie={mockBooking} />);

      const card = screen.getByRole("heading", { level: 3 }).closest("div");
      await user.click(card!);

      expect(await screen.findByText(/₹450/)).toBeInTheDocument();
    });

    it("should render correct number of seats", async () => {
      const user = userEvent.setup();
      render(<BookingMovieCard movie={mockBooking} />);

      const card = screen.getByRole("heading", { level: 3 }).closest("div");
      await user.click(card!);

      await screen.findByText("A1");

      const seats = ["A1", "A2", "A3"];
      seats.forEach((seat) => {
        expect(screen.getByText(seat)).toBeInTheDocument();
      });
    });
  });

  describe("Download Action", () => {
    it("should have download link with correct href", async () => {
      const user = userEvent.setup();
      render(<BookingMovieCard movie={mockBooking} />);

      const card = screen.getByRole("heading", { level: 3 }).closest("div");
      await user.click(card!);

      await screen.findByText("Booking Details");

      const downloadLink = screen.getByRole("link");
      expect(downloadLink).toHaveAttribute("href", "/qr-code-sample.png");
    });

    it("should have download button", async () => {
      const user = userEvent.setup();
      render(<BookingMovieCard movie={mockBooking} />);

      const card = screen.getByRole("heading", { level: 3 }).closest("div");
      await user.click(card!);

      const downloadButton = await screen.findByRole("button", {
        name: /download ticket/i,
      });
      expect(downloadButton).toBeInTheDocument();
    });
  });
});

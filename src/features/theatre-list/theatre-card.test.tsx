import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import TheatreCard from "./theatre-card";
import { type Theatre } from "@/lib/types";

// Mock useNavigate
const mockNavigate = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockTheatre: Theatre = {
  name: "ABC-Multiplex",
  shows: [
    {
      screen: "Screen 1",
      time: "10:00 AM",
    },
    {
      screen: "Screen 2",
      time: "01:30 PM",
    },
    {
      screen: "Screen 3",
      time: "04:00 PM",
    },
  ],
};

// Helper function to render component
const renderTheatreCard = (theatre: Theatre = mockTheatre) => {
  return render(
    <BrowserRouter>
      <TheatreCard {...theatre} />
    </BrowserRouter>
  );
};

// Helper to find clickable badge by screen name
const findBadgeByScreen = (screenName: string) => {
  const heading = screen.getByRole("heading", { name: screenName, level: 4 });
  // The badge has class "rounded-sm" and onClick handler
  const badge = heading.closest(".rounded-sm");
  return badge;
};

describe("TheatreCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render theatre name", () => {
      renderTheatreCard();
      expect(screen.getByText("ABC-Multiplex")).toBeInTheDocument();
    });

    it("should render all shows", () => {
      renderTheatreCard();

      expect(screen.getByText("Screen 1")).toBeInTheDocument();
      expect(screen.getByText("10:00 AM")).toBeInTheDocument();

      expect(screen.getByText("Screen 2")).toBeInTheDocument();
      expect(screen.getByText("01:30 PM")).toBeInTheDocument();

      expect(screen.getByText("Screen 3")).toBeInTheDocument();
      expect(screen.getByText("04:00 PM")).toBeInTheDocument();
    });

    it("should render correct number of show badges", () => {
      renderTheatreCard();

      const screen1 = screen.getByText("Screen 1");
      const screen2 = screen.getByText("Screen 2");
      const screen3 = screen.getByText("Screen 3");

      expect(screen1).toBeInTheDocument();
      expect(screen2).toBeInTheDocument();
      expect(screen3).toBeInTheDocument();
    });

    it("should render screen name and time together in each badge", () => {
      renderTheatreCard();

      // Verify Screen 1 badge has both screen and time
      const screen1Element = screen.getByText("Screen 1");
      const badge1 = screen1Element.closest("div");
      expect(badge1).toHaveTextContent("Screen 1");
      expect(badge1).toHaveTextContent("10:00 AM");
    });
  });

  describe("User Interactions", () => {
    it("should navigate to seat booking when show badge is clicked", async () => {
      const user = userEvent.setup();
      renderTheatreCard();

      const firstShowBadge = findBadgeByScreen("Screen 1");
      await user.click(firstShowBadge!);

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/seat-booking", {
        state: {
          show: {
            screen: "Screen 1",
            time: "10:00 AM",
          },
        },
      });
    });

    it("should pass correct show data when different shows are clicked", async () => {
      const user = userEvent.setup();
      renderTheatreCard();

      // Click second show
      const secondShowBadge = findBadgeByScreen("Screen 2");
      await user.click(secondShowBadge!);

      expect(mockNavigate).toHaveBeenCalledWith("/seat-booking", {
        state: {
          show: {
            screen: "Screen 2",
            time: "01:30 PM",
          },
        },
      });

      vi.clearAllMocks();

      // Click third show
      const thirdShowBadge = findBadgeByScreen("Screen 3");
      await user.click(thirdShowBadge!);

      expect(mockNavigate).toHaveBeenCalledWith("/seat-booking", {
        state: {
          show: {
            screen: "Screen 3",
            time: "04:00 PM",
          },
        },
      });
    });

    it("should call navigate only once per click", async () => {
      const user = userEvent.setup();
      renderTheatreCard();

      const firstShowBadge = findBadgeByScreen("Screen 1");
      await user.click(firstShowBadge!);

      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple clicks on same show", async () => {
      const user = userEvent.setup();
      renderTheatreCard();

      const firstShowBadge = findBadgeByScreen("Screen 1");

      await user.click(firstShowBadge!);
      await user.click(firstShowBadge!);

      expect(mockNavigate).toHaveBeenCalledTimes(2);
      expect(mockNavigate).toHaveBeenCalledWith("/seat-booking", {
        state: {
          show: {
            screen: "Screen 1",
            time: "10:00 AM",
          },
        },
      });
    });
  });

  describe("Component Structure", () => {
    it("should render theatre name as h2 heading", () => {
      renderTheatreCard();

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("ABC-Multiplex");
    });

    it("should render screen names as h4 headings", () => {
      renderTheatreCard();

      const headings = screen.getAllByRole("heading", { level: 4 });
      expect(headings).toHaveLength(3);
      expect(headings[0]).toHaveTextContent("Screen 1");
      expect(headings[1]).toHaveTextContent("Screen 2");
      expect(headings[2]).toHaveTextContent("Screen 3");
    });
  });

  describe("Key Generation", () => {
    it("should handle shows with same screen but different times", () => {
      const theatreWithDuplicateScreens: Theatre = {
        name: "Test Theatre",
        shows: [
          { screen: "Screen 1", time: "10:00 AM" },
          { screen: "Screen 1", time: "02:00 PM" },
        ],
      };

      renderTheatreCard(theatreWithDuplicateScreens);

      expect(screen.getByText("10:00 AM")).toBeInTheDocument();
      expect(screen.getByText("02:00 PM")).toBeInTheDocument();
    });
  });
});

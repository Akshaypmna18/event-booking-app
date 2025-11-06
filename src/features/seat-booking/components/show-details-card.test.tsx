import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ShowDetailsCard from "./show-details-card";
import type { ShowDetailsCardProps } from "../types";

const mockShowDetails: ShowDetailsCardProps = {
  screen: "Screen 1",
  time: "10:00 AM",
  name: "ABC-Multiplex",
  movieName: "Dies Irae",
};

const renderShowDetailsCard = (
  props: ShowDetailsCardProps = mockShowDetails
) => {
  return render(<ShowDetailsCard {...props} />);
};

describe("ShowDetailsCard Component", () => {
  describe("Rendering", () => {
    it("should render movie name", () => {
      renderShowDetailsCard();
      expect(screen.getByText(/Dies Irae/)).toBeInTheDocument();
    });

    it("should render theatre name", () => {
      renderShowDetailsCard();
      expect(screen.getByText(/ABC-Multiplex/)).toBeInTheDocument();
    });

    it("should render movie and theatre in correct format", () => {
      renderShowDetailsCard();
      expect(screen.getByText("Dies Irae : ABC-Multiplex")).toBeInTheDocument();
    });

    it("should render screen badge", () => {
      renderShowDetailsCard();
      expect(screen.getByText("Screen 1")).toBeInTheDocument();
    });

    it("should render time badge", () => {
      renderShowDetailsCard();
      expect(screen.getByText("10:00 AM")).toBeInTheDocument();
    });

    it("should render heading as h3", () => {
      renderShowDetailsCard();
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Dies Irae : ABC-Multiplex");
    });
  });

  describe("Component Structure", () => {
    it("should have proper card structure", () => {
      const { container } = renderShowDetailsCard();
      const card = container.querySelector('[data-slot="card"]');
      expect(card).toBeInTheDocument();
    });

    it("should have content wrapper", () => {
      const { container } = renderShowDetailsCard();
      const cardContent = container.querySelector('[data-slot="card-content"]');
      expect(cardContent).toBeInTheDocument();
    });

    it("should have proper spacing classes", () => {
      const { container } = renderShowDetailsCard();
      const cardContent = container.querySelector('[data-slot="card-content"]');
      expect(cardContent).toHaveClass("space-y-3");
    });
  });

  describe("Different Props", () => {
    it("should render different movie names", () => {
      renderShowDetailsCard({
        ...mockShowDetails,
        movieName: "Baahubali",
      });
      expect(screen.getByText(/Baahubali/)).toBeInTheDocument();
    });

    it("should render different theatre names", () => {
      renderShowDetailsCard({
        ...mockShowDetails,
        name: "XYZ-Multiplex",
      });
      expect(screen.getByText(/XYZ-Multiplex/)).toBeInTheDocument();
    });

    it("should render different screen numbers", () => {
      renderShowDetailsCard({
        ...mockShowDetails,
        screen: "Screen 5",
      });
      expect(screen.getByText("Screen 5")).toBeInTheDocument();
    });

    it("should render different time slots", () => {
      renderShowDetailsCard({
        ...mockShowDetails,
        time: "07:30 PM",
      });
      expect(screen.getByText("07:30 PM")).toBeInTheDocument();
    });

    it("should handle long movie names", () => {
      renderShowDetailsCard({
        ...mockShowDetails,
        movieName: "The Lord of the Rings: The Return of the King",
      });
      expect(screen.getByText(/The Lord of the Rings/)).toBeInTheDocument();
    });

    it("should handle long theatre names", () => {
      renderShowDetailsCard({
        ...mockShowDetails,
        name: "Grand Cinema Multiplex Entertainment Complex",
      });
      expect(screen.getByText(/Grand Cinema Multiplex/)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have accessible heading", () => {
      renderShowDetailsCard();
      const heading = screen.getByRole("heading");
      expect(heading).toBeInTheDocument();
    });

    it("should render badges with proper text", () => {
      renderShowDetailsCard();
      // Badges should be readable
      expect(screen.getByText("Screen 1")).toBeVisible();
      expect(screen.getByText("10:00 AM")).toBeVisible();
    });
  });

  describe("Layout", () => {
    it("should display items in horizontal layout", () => {
      const { container } = renderShowDetailsCard();
      const flexContainer = container.querySelector(".flex.items-center");
      expect(flexContainer).toBeInTheDocument();
    });

    it("should have proper gap between elements", () => {
      const { container } = renderShowDetailsCard();
      const flexContainer = container.querySelector(".flex.items-center");
      expect(flexContainer).toHaveClass("gap-3");
    });
  });

  describe("Edge Cases", () => {
    it("should handle special characters in movie name", () => {
      renderShowDetailsCard({
        ...mockShowDetails,
        movieName: "Die Hard: With a Vengeance",
      });
      expect(screen.getByText(/Die Hard:/)).toBeInTheDocument();
    });

    it("should handle AM/PM time format", () => {
      renderShowDetailsCard({
        ...mockShowDetails,
        time: "11:45 PM",
      });
      expect(screen.getByText("11:45 PM")).toBeInTheDocument();
    });
  });
});

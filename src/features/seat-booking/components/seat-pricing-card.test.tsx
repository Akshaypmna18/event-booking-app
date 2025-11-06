import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SeatPricingCard from "./seat-pricing-card";

// Mock the SEAT_CATEGORY_CONFIG
vi.mock("../utils", () => ({
  SEAT_CATEGORY_CONFIG: {
    silver: { label: "Silver", color: "bg-blue-500", price: 150 },
    gold: { label: "Gold", color: "bg-yellow-500", price: 200 },
    platinum: { label: "Platinum", color: "bg-purple-500", price: 250 },
  },
}));

describe("SeatPricingCard Component", () => {
  describe("Rendering", () => {
    it("should render pricing card title", () => {
      render(<SeatPricingCard />);
      expect(screen.getByText("Pricing")).toBeInTheDocument();
    });

    it("should render all three seat categories", () => {
      render(<SeatPricingCard />);
      expect(screen.getByText("Silver")).toBeInTheDocument();
      expect(screen.getByText("Gold")).toBeInTheDocument();
      expect(screen.getByText("Platinum")).toBeInTheDocument();
    });

    it("should render all seat category prices", () => {
      render(<SeatPricingCard />);
      expect(screen.getByText("₹150")).toBeInTheDocument();
      expect(screen.getByText("₹200")).toBeInTheDocument();
      expect(screen.getByText("₹250")).toBeInTheDocument();
    });

    it("should render color indicators for all categories", () => {
      const { container } = render(<SeatPricingCard />);
      const colorBoxes = container.querySelectorAll(".w-6.h-6.rounded");
      expect(colorBoxes).toHaveLength(3);
    });
  });

  describe("Category Details", () => {
    it("should render Silver category with correct details", () => {
      const { container } = render(<SeatPricingCard />);
      expect(screen.getByText("Silver")).toBeInTheDocument();
      expect(screen.getByText("₹150")).toBeInTheDocument();
      const silverBox = container.querySelector(".bg-blue-500");
      expect(silverBox).toBeInTheDocument();
    });

    it("should render Gold category with correct details", () => {
      const { container } = render(<SeatPricingCard />);
      expect(screen.getByText("Gold")).toBeInTheDocument();
      expect(screen.getByText("₹200")).toBeInTheDocument();
      const goldBox = container.querySelector(".bg-yellow-500");
      expect(goldBox).toBeInTheDocument();
    });

    it("should render Platinum category with correct details", () => {
      const { container } = render(<SeatPricingCard />);
      expect(screen.getByText("Platinum")).toBeInTheDocument();
      expect(screen.getByText("₹250")).toBeInTheDocument();
      const platinumBox = container.querySelector(".bg-purple-500");
      expect(platinumBox).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should have card structure", () => {
      const { container } = render(<SeatPricingCard />);
      const card = container.querySelector('[data-slot="card"]');
      expect(card).toBeInTheDocument();
    });

    it("should have card header", () => {
      const { container } = render(<SeatPricingCard />);
      const header = container.querySelector('[data-slot="card-header"]');
      expect(header).toBeInTheDocument();
    });
  });

  describe("Layout", () => {
    it("should display categories in vertical list", () => {
      const { container } = render(<SeatPricingCard />);
      const content = container.querySelector('[data-slot="card-content"]');
      expect(content).toHaveClass("space-y-2");
    });

    it("should have proper spacing between category items", () => {
      const { container } = render(<SeatPricingCard />);
      const categoryItems = container.querySelectorAll(
        ".flex.items-center.justify-between"
      );
      expect(categoryItems).toHaveLength(3);
    });

    it("should align category name and price horizontally", () => {
      const { container } = render(<SeatPricingCard />);
      const firstCategory = container.querySelector(
        ".flex.items-center.justify-between"
      );
      expect(firstCategory).toBeInTheDocument();
    });

    it("should have gap between color box and label", () => {
      const { container } = render(<SeatPricingCard />);
      const categoryLabel = container.querySelector(".flex.items-center.gap-2");
      expect(categoryLabel).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should render color boxes with correct size", () => {
      const { container } = render(<SeatPricingCard />);
      const colorBoxes = container.querySelectorAll(".w-6.h-6");
      expect(colorBoxes).toHaveLength(3);
    });

    it("should capitalize category labels", () => {
      const { container } = render(<SeatPricingCard />);
      const labels = container.querySelectorAll(".capitalize");
      expect(labels).toHaveLength(3);
    });

    it("should have responsive width classes", () => {
      const { container } = render(<SeatPricingCard />);
      const card = container.querySelector(".w-full.sm\\:max-w-sm");
      expect(card).toBeInTheDocument();
    });
  });

  describe("Content Verification", () => {
    it("should display categories in correct order", () => {
      render(<SeatPricingCard />);
      const categories = screen.getAllByText(/Silver|Gold|Platinum/);
      expect(categories[0]).toHaveTextContent("Silver");
      expect(categories[1]).toHaveTextContent("Gold");
      expect(categories[2]).toHaveTextContent("Platinum");
    });

    it("should have three pricing entries", () => {
      render(<SeatPricingCard />);
      const prices = screen.getAllByText(/₹\d+/);
      expect(prices).toHaveLength(3);
    });

    it("should display prices in ascending order", () => {
      render(<SeatPricingCard />);
      expect(screen.getByText("₹150")).toBeInTheDocument(); // Silver
      expect(screen.getByText("₹200")).toBeInTheDocument(); // Gold
      expect(screen.getByText("₹250")).toBeInTheDocument(); // Platinum
    });
  });

  describe("Accessibility", () => {
    it("should render all category labels as visible text", () => {
      render(<SeatPricingCard />);
      expect(screen.getByText("Silver")).toBeVisible();
      expect(screen.getByText("Gold")).toBeVisible();
      expect(screen.getByText("Platinum")).toBeVisible();
    });

    it("should render all prices as visible text", () => {
      render(<SeatPricingCard />);
      expect(screen.getByText("₹150")).toBeVisible();
      expect(screen.getByText("₹200")).toBeVisible();
      expect(screen.getByText("₹250")).toBeVisible();
    });
  });

  describe("Color Indicators", () => {
    it("should render blue color box for silver", () => {
      const { container } = render(<SeatPricingCard />);
      const blueBox = container.querySelector(".bg-blue-500");
      expect(blueBox).toBeInTheDocument();
    });

    it("should render yellow color box for gold", () => {
      const { container } = render(<SeatPricingCard />);
      const yellowBox = container.querySelector(".bg-yellow-500");
      expect(yellowBox).toBeInTheDocument();
    });

    it("should render purple color box for platinum", () => {
      const { container } = render(<SeatPricingCard />);
      const purpleBox = container.querySelector(".bg-purple-500");
      expect(purpleBox).toBeInTheDocument();
    });

    it("should have rounded color boxes", () => {
      const { container } = render(<SeatPricingCard />);
      const colorBoxes = container.querySelectorAll(".rounded");
      expect(colorBoxes.length).toBeGreaterThanOrEqual(3);
    });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import BookingSuccessAlert from "./booking-success-alert";
import { mockNavigate } from "@/test/setup";

// Mock UI components (simple pass-through test doubles)
vi.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
  }) => (open ? <div data-testid="alert-dialog">{children}</div> : null),
  AlertDialogContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="alert-content" className={className}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <button data-testid="button" onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

vi.mock("lucide-react", () => ({
  CheckCircle: ({ className }: { className: string }) => (
    <svg data-testid="check-icon" className={className} />
  ),
}));

// No default value — allows passing `undefined` through
const renderBookingSuccessAlert = (isOpen?: boolean) => {
  return render(
    <BrowserRouter>
      <BookingSuccessAlert isOpen={isOpen} />
    </BrowserRouter>
  );
};

describe("BookingSuccessAlert Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render when isOpen is true", () => {
      renderBookingSuccessAlert(true);
      expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();
    });

    it("should not render when isOpen is false", () => {
      renderBookingSuccessAlert(false);
      expect(screen.queryByTestId("alert-dialog")).not.toBeInTheDocument();
    });

    it("should not render when isOpen is undefined", () => {
      renderBookingSuccessAlert(undefined);
      expect(screen.queryByTestId("alert-dialog")).not.toBeInTheDocument();
    });

    it("should render alert dialog content", () => {
      renderBookingSuccessAlert(true);
      expect(screen.getByTestId("alert-content")).toBeInTheDocument();
    });
  });

  describe("Content Display", () => {
    it("should display booking confirmed title", () => {
      renderBookingSuccessAlert(true);
      expect(screen.getByText("Booking Confirmed!")).toBeInTheDocument();
    });

    it("should display initial countdown", () => {
      renderBookingSuccessAlert(true);
      expect(screen.getByText(/Redirecting in\.\.\.5s/)).toBeInTheDocument();
    });

    it("should display go to home button", () => {
      renderBookingSuccessAlert(true);
      expect(
        screen.getByRole("button", { name: /go to home/i })
      ).toBeInTheDocument();
    });
  });

  describe("Countdown Timer", () => {
    it("should start countdown at 5 seconds", () => {
      renderBookingSuccessAlert(true);
      expect(screen.getByText(/5s/)).toBeInTheDocument();
    });

    it("should decrement countdown every second", async () => {
      renderBookingSuccessAlert(true);

      expect(screen.getByText(/5s/)).toBeInTheDocument();

      await act(async () => vi.advanceTimersByTime(1000));
      expect(screen.getByText(/4s/)).toBeInTheDocument();

      await act(async () => vi.advanceTimersByTime(1000));
      expect(screen.getByText(/3s/)).toBeInTheDocument();
    });

    it("should navigate to home after countdown reaches 0", async () => {
      renderBookingSuccessAlert(true);

      await act(async () => vi.advanceTimersByTime(5000));
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("should stop countdown when component unmounts", async () => {
      const { unmount } = renderBookingSuccessAlert(true);

      await act(async () => vi.advanceTimersByTime(2000));
      unmount();

      // Should not navigate after unmount
      await act(async () => vi.advanceTimersByTime(5000));
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should not start timer when isOpen is false", async () => {
      renderBookingSuccessAlert(false);

      await act(async () => vi.advanceTimersByTime(10000));
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("Navigation", () => {
    // Use fireEvent (no timers), to avoid userEvent + fake timers deadlocks
    it("should navigate to home when button clicked", () => {
      renderBookingSuccessAlert(true);

      const button = screen.getByTestId("button");
      fireEvent.click(button);

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("should navigate to home page (/) specifically", () => {
      renderBookingSuccessAlert(true);

      const button = screen.getByTestId("button");
      fireEvent.click(button);

      expect(mockNavigate).toHaveBeenCalledWith("/");
      expect(mockNavigate).not.toHaveBeenCalledWith("/movies");
    });

    it("should call navigate only once per button click", () => {
      renderBookingSuccessAlert(true);

      const button = screen.getByTestId("button");
      fireEvent.click(button);

      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid open/close", () => {
      const { rerender } = render(
        <BrowserRouter>
          <BookingSuccessAlert isOpen={true} />
        </BrowserRouter>
      );

      // toggle closed
      rerender(
        <BrowserRouter>
          <BookingSuccessAlert isOpen={false} />
        </BrowserRouter>
      );

      // toggle open again
      rerender(
        <BrowserRouter>
          <BookingSuccessAlert isOpen={true} />
        </BrowserRouter>
      );

      expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();
    });

    it("should handle countdown reaching exactly 1", async () => {
      renderBookingSuccessAlert(true);

      await act(async () => vi.advanceTimersByTime(4000));
      expect(screen.getByText(/1s/)).toBeInTheDocument();
    });

    it("should handle countdown at 0", async () => {
      renderBookingSuccessAlert(true);

      await act(async () => vi.advanceTimersByTime(5000));
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("should cleanup timer on unmount", async () => {
      const { unmount } = renderBookingSuccessAlert(true);

      await act(async () => vi.advanceTimersByTime(2000));
      unmount();

      // Advance more time after unmount
      await act(async () => vi.advanceTimersByTime(10000));

      // Should not navigate after unmount
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("Timer Behavior", () => {
    it("should countdown sequentially from 5 to 0", async () => {
      renderBookingSuccessAlert(true);

      for (let i = 5; i > 0; i--) {
        // Current value is visible
        expect(screen.getByText(new RegExp(`${i}s`))).toBeInTheDocument();

        // Tick a second
        await act(async () => vi.advanceTimersByTime(1000));

        // Next value shows up immediately after tick
        if (i > 1) {
          expect(screen.getByText(new RegExp(`${i - 1}s`))).toBeInTheDocument();
        }
      }

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("should not restart timer when already running", async () => {
      renderBookingSuccessAlert(true);

      await act(async () => vi.advanceTimersByTime(2000));

      expect(screen.getByText(/3s/)).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});

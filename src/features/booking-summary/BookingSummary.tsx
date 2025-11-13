import { Button } from "@/components/ui/button";
import TicketsCard from "./tickets-card";
import PriceCard from "./price-card";
import { useLocation, useNavigate } from "react-router";
import useEventAppStore from "@/store";
import ErrorPage from "./error-page";
import BookingSuccessAlert from "./booking-success-alert";
import { useState } from "react";
import type { ShowDetailsCardProps } from "../seat-booking/types";
import type { SeatObject, SeatStatus } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking } from "@/lib/services";
import type { Booking } from "@/lib/types";
import { toast } from "sonner";

export interface BookingData extends ShowDetailsCardProps {
  totalPrice: number;
  selectedSeatIds: string[];
  numberOfSelectedSeats: number;
  poster: string;
}

export default function BookingSummary() {
  const location = useLocation();
  const bookingData: BookingData = location.state?.bookingData;

  const { name, movieName, selectedSeatIds, totalPrice, screen, time, poster } =
    bookingData ?? {};

  const { bookedSeats, setBookedSeats, uniqueMovieId, seats, setSeats } =
    useEventAppStore();

  const [isOpen, setIsOpen] = useState<boolean | undefined>();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (booking: Booking) => createBooking(booking),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      updateLocalStorageSeatsData();
      removeBookedSeats();
      setIsOpen(true);
    },
    onError: (error) => {
      toast.error("Booking failed", {
        description: error?.message || "Please try again later.",
        action: {
          label: "Close",
          onClick: () => toast.dismiss(),
        },
      });
    },
  });

  const removeBookedSeats = (): void => {
    if (!uniqueMovieId) return;

    const updatedSeats = { ...bookedSeats };
    delete updatedSeats[uniqueMovieId];
    setBookedSeats(updatedSeats);
  };

  const updateLocalStorageSeatsData = (): void => {
    if (!uniqueMovieId) return;

    const seatsArrayofCurrentMovie = seats?.[uniqueMovieId];

    const updatedSeats = seatsArrayofCurrentMovie.map((seatObj) => {
      const seatKey = Object.keys(seatObj)[0]; // e.g., "A1"
      if (selectedSeatIds.includes(seatKey)) {
        const current = seatObj[seatKey];
        return {
          [seatKey]: {
            ...current,
            status: "unavailable" as SeatStatus, // change status
          },
        };
      }
      return seatObj;
    });

    const updatedData: Record<string, SeatObject[]> = {
      ...seats,
      [uniqueMovieId]: updatedSeats,
    };

    setSeats(updatedData);
  };

  const handleCancel = (): void => {
    removeBookedSeats();
    navigate("/");
  };

  const handlePayment = (): void => {
    mutation.mutate({
      movieName,
      theatreName: name,
      screen,
      time,
      image: poster,
      selectedSeats: selectedSeatIds,
      price: totalPrice,
    });
  };

  if (!bookingData) return <ErrorPage />;

  return (
    <section className="container mx-auto px-4 py-8 space-y-4 min-h-dvh">
      <BookingSuccessAlert isOpen={isOpen} />
      <div className="space-y-4 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Booking Summary</h1>
        </div>

        <TicketsCard
          name={name}
          movieName={movieName}
          selectedSeatIds={selectedSeatIds}
        />
        <PriceCard totalPrice={totalPrice} />

        <div className="flex gap-4">
          <Button onClick={handleCancel} variant="outline" className="flex-1">
            Cancel & Book another
          </Button>
          <Button onClick={handlePayment} className="flex-1 ">
            Confirm booking
          </Button>
        </div>
      </div>
    </section>
  );
}

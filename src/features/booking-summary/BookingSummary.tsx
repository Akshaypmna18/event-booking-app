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

export interface BookingData extends ShowDetailsCardProps {
  totalPrice: number;
  selectedSeatIds: string[];
  numberOfSelectedSeats: number;
}

export default function BookingSummary() {
  const location = useLocation();
  const bookingData: BookingData = location.state?.bookingData;

  const { bookedSeats, setBookedSeats, uniqueMovieId, seats, setSeats } =
    useEventAppStore();

  const [isOpen, setIsOpen] = useState<boolean | undefined>();

  const navigate = useNavigate();

  const removeBookedSeats = (): void => {
    if (!uniqueMovieId) return;

    const updatedSeats = { ...bookedSeats };
    delete updatedSeats[uniqueMovieId];
    setBookedSeats(updatedSeats);
  };

  const updateLocalStorageSeatsData = (): void => {
    if (!uniqueMovieId) return;

    const seatsArrayofCurrentMovie = seats?.[uniqueMovieId];

    const selectedSeats = bookingData?.selectedSeatIds;

    const updatedSeats = seatsArrayofCurrentMovie.map((seatObj) => {
      const seatKey = Object.keys(seatObj)[0]; // e.g., "A1"
      if (selectedSeats.includes(seatKey)) {
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
    updateLocalStorageSeatsData();
    removeBookedSeats();
    setIsOpen(true);
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
          name={bookingData?.name}
          movieName={bookingData?.movieName}
          selectedSeatIds={bookingData?.selectedSeatIds}
        />
        <PriceCard totalPrice={bookingData?.totalPrice} />

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

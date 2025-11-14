import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useEventAppStore from "@/store";
import { useState, type Dispatch, type SetStateAction } from "react";
import { getKeysArray, SEAT_CATEGORY_CONFIG, TOTAL_SEATS } from "../utils";
import { useNavigate } from "react-router";
import type { ShowDetailsCardProps } from "../types";

interface BookingData extends ShowDetailsCardProps {
  totalPrice: number;
  selectedSeatIds: string[];
  numberOfSelectedSeats: number;
}

export default function BookingSummaryCard({
  ...showDetails
}: ShowDetailsCardProps) {
  const bookedSeats = useEventAppStore((state) => state.bookedSeats);
  const setBookedSeats = useEventAppStore((state) => state.setBookedSeats);
  const uniqueMovieId = useEventAppStore((state) => state.uniqueMovieId);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const seatsForMovie = uniqueMovieId ? bookedSeats[uniqueMovieId] ?? [] : [];

  const numberOfSelectedSeats = seatsForMovie.length;
  const isSeatsNotSelected = numberOfSelectedSeats === 0;
  const selectedSeatIds = getKeysArray(seatsForMovie);

  const clearBookedSeatsForMovie = (): void => {
    if (!uniqueMovieId) return;

    const updatedSeats = { ...bookedSeats };
    delete updatedSeats[uniqueMovieId];
    setBookedSeats(updatedSeats);
  };

  const totalPrice: number = seatsForMovie.reduce((total, seatObj) => {
    const category = Object.values(seatObj)[0];
    const seatPrice = SEAT_CATEGORY_CONFIG[category].price;

    return total + seatPrice;
  }, 0);

  const handlePayment = (): void => {
    const bookingData: BookingData = {
      ...showDetails,
      totalPrice,
      selectedSeatIds,
      numberOfSelectedSeats,
    };
    navigate("/booking-summary", { state: { bookingData } });
  };

  return (
    <>
      <Card className="grow max-sm:hidden">
        <AlertComponent
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onConfirm={clearBookedSeatsForMovie}
        />
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 pt-0">
          {/* Seats row */}
          <div className="grid grid-cols-2 items-center">
            <span className="text-sm md:text-base">Seats:</span>
            <span className="text-right text-sm md:text-base">
              {numberOfSelectedSeats}/{TOTAL_SEATS}
            </span>
          </div>

          {/* IDs row */}
          <div className="grid grid-cols-2 items-start">
            <span className="text-sm md:text-base">IDs:</span>
            <span className="text-right text-sm md:text-base break-words">
              {numberOfSelectedSeats ? selectedSeatIds.join(", ") : "N/A"}
            </span>
          </div>

          <Separator />

          {/* Total row */}
          <div className="grid grid-cols-2 items-center">
            <span className="text-sm md:text-base font-semibold">Total:</span>
            <span className="text-right text-sm md:text-base font-semibold">
              ₹{totalPrice}
            </span>
          </div>
        </CardContent>

        <CardFooter className="flex gap-3 justify-between">
          <Button
            type="button"
            variant="outline"
            className="w-1/2"
            disabled={isSeatsNotSelected}
            onClick={() => setIsOpen(true)}
          >
            Clear Selection
          </Button>

          <Button
            type="button"
            className="w-1/2"
            disabled={isSeatsNotSelected}
            onClick={handlePayment}
          >
            Proceed to payment
          </Button>
        </CardFooter>
      </Card>

      {/* Only for screens less that 640px */}
      {!isSeatsNotSelected && (
        <footer className="fixed bottom-0 bg-white w-full p-4 border-t sm:hidden space-y-1 -ml-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground">Total:</span>
              <span className="font-semibold text-xl">₹{totalPrice}</span>
            </div>

            <Separator orientation="vertical" className="min-h-[3rem]" />

            <div>
              <div>
                <span className="text-sm md:text-base">Seats: </span>
                <span className="text-right text-sm md:text-base">
                  {numberOfSelectedSeats}/{TOTAL_SEATS}
                </span>
              </div>
              <div>
                <span className="text-sm">IDs: </span>
                <span className="text-sm break-words">
                  {numberOfSelectedSeats ? selectedSeatIds.join(", ") : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex gap-2 flex-wrap justify-center">
            <Button disabled={isSeatsNotSelected} variant="secondary">
              Clear Selection
            </Button>
            <Button disabled={isSeatsNotSelected}>Proceed to Checkout</Button>
          </div>
        </footer>
      )}
    </>
  );
}

const AlertComponent = ({
  isOpen,
  setIsOpen,
  onConfirm,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onConfirm?: () => void;
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            Remove all selected seats?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action will remove all selected seats from your booking.{" "}
            <b>This cannot be undone.</b>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onConfirm}>Okay</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

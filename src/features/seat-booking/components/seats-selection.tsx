import useEventAppStore from "@/store";
import type { ShowDetailsCardProps } from "../types";
import {
  createSeats,
  getKeysArray,
  SEAT_CATEGORY_CONFIG,
  TOTAL_SEATS,
} from "../utils";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import type { DialogTypes, SeatType } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getTheatres } from "@/lib/services";
import { useQuery } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/utils";
import LoadingFallback from "@/components/LoadingFallback";

export default function SeatsSelection({
  ...showDetails
}: ShowDetailsCardProps) {
  const {
    data: theatresData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["theatres"],
    queryFn: getTheatres,
  });

  const {
    seats,
    setSeats,
    bookedSeats,
    setBookedSeats,
    uniqueMovieId,
    setUniqueMovieId,
  } = useEventAppStore();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSeatClick = (key: string, type: SeatType): void => {
    if (!uniqueMovieId) return;

    const currentForMovie = bookedSeats[uniqueMovieId] ?? [];

    const hasSeat = currentForMovie.some((seat) =>
      Object.prototype.hasOwnProperty.call(seat, key)
    );

    const nextForMovie = hasSeat
      ? currentForMovie.filter(
          (seat) => !Object.prototype.hasOwnProperty.call(seat, key)
        )
      : [...currentForMovie, { [key]: type }];

    // max warning
    if (!hasSeat && nextForMovie.length > TOTAL_SEATS) {
      setIsOpen(true);
      return;
    }

    const nextBookedSeats = { ...bookedSeats };
    if (nextForMovie.length === 0)
      delete nextBookedSeats[uniqueMovieId]; // clear the movie entry when empty
    else nextBookedSeats[uniqueMovieId] = nextForMovie;

    setBookedSeats(nextBookedSeats);
  };

  useEffect(() => {
    const localSeats = createSeats(
      showDetails,
      theatresData ?? [],
      seats,
      setUniqueMovieId
    );
    setSeats(localSeats);
  }, [theatresData]);

  return (
    <div className="grid grid-cols-10 gap-2 max-w-2xl mx-auto">
      <AlertComponent isOpen={isOpen} setIsOpen={setIsOpen} />

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          <p className="font-semibold">Error loading movies</p>
          <p className="text-sm">{getErrorMessage(error)}</p>
        </div>
      )}

      {isLoading ? (
        <LoadingFallback />
      ) : (
        seats?.[uniqueMovieId || ""]?.map((item) => {
          const key = Object.keys(item)[0];
          const { status, type } = item[key];

          const isAvailable = status === "available";
          const selectedKeys = uniqueMovieId
            ? getKeysArray(bookedSeats[uniqueMovieId] || [])
            : [];
          const isSelected = selectedKeys.includes(key);

          return (
            <button
              key={key}
              onClick={() => handleSeatClick(key, type)}
              disabled={!isAvailable}
              className={`w-8 h-8 flex items-center justify-center rounded-t-sm cursor-pointer ${
                !isAvailable ? "opacity-30 cursor-not-allowed" : ""
              } ${SEAT_CATEGORY_CONFIG?.[type]?.color} ${
                type !== "gold" ? "text-white" : ""
              }`}
            >
              {isSelected ? <Check color="white" size={18} /> : key}
            </button>
          );
        })
      )}
    </div>
  );
}

export const AlertComponent = ({ isOpen, setIsOpen }: DialogTypes) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            Too many tickets selected
          </AlertDialogTitle>
          <AlertDialogDescription>
            You can only select <b>up to 8 tickets</b>. Please adjust your
            selection.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setIsOpen(false)}>
            Okay
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

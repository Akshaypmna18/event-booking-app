import useEventAppStore from "@/store";
import type { ShowDetailsCardProps } from "../types";
import {
  createSeats,
  getKeysArray,
  SEAT_CATEGORY_CONFIG,
  TOTAL_SEATS,
} from "../utils";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Check } from "lucide-react";
import type { SeatObject, SeatType } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type LocalState = { [id: string]: SeatObject[] } | undefined;

export default function SeatsSelection({
  ...showDetails
}: ShowDetailsCardProps) {
  const {
    seats,
    setSeats,
    bookedSeats,
    setBookedSeats,
    uniqueMovieId,
    setUniqueMovieId,
  } = useEventAppStore();

  const [localSeats, setLocalSeats] = useState<LocalState>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSeatClick = (key: string, type: SeatType): void => {
    if (!uniqueMovieId) return;

    const currentForMovie = bookedSeats[uniqueMovieId] ?? [];

    const exists = currentForMovie.some((seat) =>
      Object.prototype.hasOwnProperty.call(seat, key)
    );

    const updatedForMovie = exists
      ? currentForMovie.filter(
          (seat) => !Object.prototype.hasOwnProperty.call(seat, key)
        )
      : [...currentForMovie, { [key]: type }];

    if (updatedForMovie.length > TOTAL_SEATS) {
      setIsOpen(true);
      return;
    }

    const nextBookedSeats = { ...bookedSeats };
    if (updatedForMovie.length)
      nextBookedSeats[uniqueMovieId] = updatedForMovie;

    setBookedSeats(nextBookedSeats);
  };

  useEffect(() => {
    const localSeats = createSeats(showDetails, seats, setUniqueMovieId);
    setSeats(localSeats);
    setLocalSeats(localSeats);
  }, []);

  return (
    <div className="grid grid-cols-10 gap-2 max-w-2xl mx-auto">
      <AlertComponent isOpen={isOpen} setIsOpen={setIsOpen} />

      {localSeats?.[uniqueMovieId || ""]?.map((item, index) => {
        const key = Object.keys(item)[0];
        const { status, type } = item[key];

        const isAvailable = status === "available";
        const selectedKeys = uniqueMovieId
          ? getKeysArray(bookedSeats[uniqueMovieId] || [])
          : [];
        const isSelected = selectedKeys.includes(key);

        return (
          <button
            key={index}
            onClick={() => handleSeatClick(key, type)}
            className={`w-8 h-8 flex items-center justify-center rounded-t-sm cursor-pointer ${
              !isAvailable ? "opacity-30" : ""
            } ${SEAT_CATEGORY_CONFIG?.[type]?.color} ${
              type !== "gold" ? "text-white" : ""
            }`}
          >
            {isSelected ? <Check color="white" size={18} /> : key}
          </button>
        );
      })}
    </div>
  );
}

export const AlertComponent = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
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

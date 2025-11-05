import useEventAppStore from "@/store";
import type { ShowDetailsCardProps } from "./types";
import { createSeats, SEAT_CATEGORY_CONFIG } from "./utils";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import type { SeatObject, SeatType, SeatStatus } from "@/lib/types";

type LocalState = { [id: string]: SeatObject[] } | undefined;
type BookingSeatStatus = SeatStatus | "booked";

export default function SeatsSelection({
  ...showDetails
}: ShowDetailsCardProps) {
  const { seats, setSeats, bookedSeats, setBookedSeats } = useEventAppStore();

  const [id, setId] = useState<string | undefined>();
  const [localSeats, setLocalSeats] = useState<LocalState>();

  // console.log(bookedSeats);

  const handleSeatClick = (
    key: string,
    type: SeatType,
    index: number
  ): void => {
    let newItems;
    const exists = bookedSeats.some((seat) =>
      Object.prototype.hasOwnProperty.call(seat, key)
    );

    if (exists)
      newItems = bookedSeats.filter(
        (seat) => !Object.prototype.hasOwnProperty.call(seat, key)
      );
    else newItems = [...bookedSeats, { [key]: type }];

    const seatStatus: BookingSeatStatus = Object.values(
      localSeats?.[id || ""]?.[index] || {}
    )?.[0]?.status;

    console.log(seatStatus);

    // setLocalSeats(seatStatus);
    setBookedSeats(newItems);
  };

  useEffect(() => {
    const localSeats = createSeats(showDetails, seats, setId);
    setSeats(localSeats);
    setLocalSeats(localSeats);
  }, []);

  return (
    <div className="grid grid-cols-10 gap-2">
      {localSeats?.[id || ""]?.map((item, index) => {
        const key = Object.keys(item)[0];
        const { status, type } = item[key];
        const isAvailable = status === "available";
        if (index < 10) {
          // const key = Object.keys(item)[0];
          // const { status, type } = item[key];
        }
        return (
          <button
            key={index}
            onClick={() => handleSeatClick(key, type, index)}
            className={`w-8 h-8 flex items-center justify-center rounded-t-sm ${
              !isAvailable ? "opacity-30" : ""
            } ${SEAT_CATEGORY_CONFIG?.[type]?.color} ${
              type !== "gold" ? "text-white" : ""
            }`}
          >
            {key}
          </button>
        );
      })}
      <button className="w-5 h-5 flex items-center justify-center rounded-t-sm bg-red-500">
        i
      </button>
      <button className="w-5 h-5 flex items-center justify-center rounded-t-sm bg-red-500">
        <Check color="white" size={14} />
      </button>
      <button
        disabled
        className="w-5 h-5 flex items-center justify-center rounded-t-sm bg-red-500 opacity-30"
      >
        i
      </button>
    </div>
  );
}

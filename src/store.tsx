// store.ts
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { BookedSeat, SeatObject } from "./lib/types";

interface EventAppState {
  seats: {
    [id: string]: SeatObject[];
  };
  setSeats: (seats: { [id: string]: SeatObject[] }) => void;
  bookedSeats: BookedSeat[];
  setBookedSeats: (bookedSeats: BookedSeat[]) => void;
}

const useEventAppStore = create<EventAppState>()(
  devtools(
    persist(
      (set) => ({
        seats: {},
        setSeats: (seats) => set({ seats }),

        bookedSeats: [],
        setBookedSeats: (bookedSeats) => set({ bookedSeats }),
      }),
      {
        name: "event-app-storage",
        partialize: (state) => ({
          seats: state.seats,
        }),
      }
    )
  )
);

export default useEventAppStore;

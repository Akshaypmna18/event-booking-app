import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { BookedSeatsRecord, SeatObject } from "./lib/types";

interface EventAppState {
  seats: Record<string, SeatObject[]>;
  setSeats: (seats: Record<string, SeatObject[]>) => void;

  bookedSeats: BookedSeatsRecord;
  setBookedSeats: (bookedSeats: BookedSeatsRecord) => void;

  uniqueMovieId?: string;
  setUniqueMovieId: (id?: string) => void;
}

const useEventAppStore = create<EventAppState>()(
  devtools(
    persist(
      (set) => ({
        seats: {},
        setSeats: (seats) => set({ seats }),

        bookedSeats: {},
        setBookedSeats: (bookedSeats) => set({ bookedSeats }),

        uniqueMovieId: undefined,
        setUniqueMovieId: (id) => set({ uniqueMovieId: id }),
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

export interface Movie {
  id: string;
  title: string;
  genre: string;
  language: string;
  duration: string;
  rating: number;
  poster: string;
  description: string;
  cast: string[];
  director: string;
  theatres: TheatreMovie[];
}

export interface TheatreMovie {
  name: string;
  shows: Show[];
}

export interface Show {
  screen: string;
  time: string;
}

export interface SeatCategory {
  rows: number;
  price: number;
}

export interface SeatLayout {
  silver: SeatCategory;
  gold: SeatCategory;
  platinum: SeatCategory;
}

export interface Theatre {
  id: string;
  name: string;
  seatLayout: SeatLayout;
}

export type SeatType = "silver" | "gold" | "platinum";

export type SeatStatus = "available" | "unavailable";

export type SeatObject = Record<
  string,
  {
    status: SeatStatus;
    type: SeatType;
  }
>;

export type BookedSeat = Record<string, SeatType>;

export type BookedSeatsRecord = Record<string, BookedSeat[]>;

export interface Booking {
  movieName: string;
  theatreName: string;
  time: string;
  selectedSeats: string[];
  price: number;
}

export interface BookingsResponse {
  key: "bookings";
  bookings: Booking[];
}

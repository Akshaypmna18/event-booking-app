import axios from "axios";
import type { Booking, BookingsResponse, Movie, Theatre } from "./types";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string,
});

export const getMovies = async (): Promise<Movie[]> => {
  const { data } = await api.get<Movie[]>("/movies");
  return data;
};

export const getTheatres = async (): Promise<Theatre[]> => {
  const { data } = await api.get<Theatre[]>("/theatres");
  return data;
};

export const getBookings = async (): Promise<BookingsResponse> => {
  const { data } = await api.get<BookingsResponse>("/bookings");
  return data;
};

export const createBooking = async (
  bookingData: Booking
): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.post<{ success: boolean; message: string }>(
    "/bookings",
    { value: bookingData }
  );
  return data;
};

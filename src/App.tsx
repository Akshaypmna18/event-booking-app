import { Routes, Route } from "react-router";
import { lazy, Suspense } from "react";

// Lazy load pages
const MoviesList = lazy(() => import("@/pages/MoviesList.page"));
const SeatBooking = lazy(() => import("@/pages/SeatBooking.page"));
const TheatreList = lazy(() => import("@/pages/TheatreList.page"));
const BookingSummary = lazy(() => import("@/pages/BookingSummary.page"));

import LoadingFallback from "@/components/LoadingFallback";

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback className="min-h-dvh" />}>
      <div className="bg-[#f6f6f6]">
        <Routes>
          <Route path="/" element={<MoviesList />} />
          <Route path="/theatre-list" element={<TheatreList />} />
          <Route path="/seat-booking" element={<SeatBooking />} />
          <Route path="/booking-summary" element={<BookingSummary />} />
        </Routes>
      </div>
    </Suspense>
  );
}

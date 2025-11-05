import { Routes, Route } from "react-router";
import { lazy, Suspense } from "react";

// Lazy load pages
const MoviesList = lazy(() => import("@/pages/MoviesList"));
const SeatBooking = lazy(() => import("@/pages/SeatBooking"));
const TheatreList = lazy(() => import("@/pages/TheatreList"));
const BookingSummary = lazy(() => import("@/pages/BookingSummary"));

import LoadingFallback from "@/components/LoadingFallback";

export default function App() {
	return (
		<Suspense fallback={<LoadingFallback />}>
			<Routes>
				<Route path="/" element={<MoviesList />} />
				<Route path="/theatre-list" element={<TheatreList />} />
				<Route path="/seat-booking" element={<SeatBooking />} />
				<Route path="/booking-summary" element={<BookingSummary />} />
			</Routes>
		</Suspense>
	);
}

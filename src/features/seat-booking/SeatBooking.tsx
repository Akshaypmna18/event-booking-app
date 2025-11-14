import { useLocation } from "react-router";
import { type ShowDetailsCardProps } from "./types";
import ShowDetailsCard from "./components/show-details-card";
import ScreenIndicator from "./components/screen-indicator";
import SeatsSelection from "./components/seats-selection";
import SeatPricingCard from "./components/seat-pricing-card";
import BookingSummaryCard from "./components/booking-summary-card";
import useEventAppStore from "@/store";

export default function SeatBooking() {
  const location = useLocation();
  const showDetails: ShowDetailsCardProps = location.state?.showDetails;

  const bookedSeats = useEventAppStore((state) => state.bookedSeats);
  const uniqueMovieId = useEventAppStore((state) => state.uniqueMovieId);

  const seatsForMovie = uniqueMovieId ? bookedSeats[uniqueMovieId] ?? [] : [];
  const numberOfSelectedSeats = seatsForMovie.length;
  const isSeatsSelected = numberOfSelectedSeats > 0;

  return (
    <section className="container mx-auto px-4 py-8 space-y-4 relative">
      <div
        className={`space-y-4 max-w-6xl mx-auto ${
          isSeatsSelected ? "max-sm:pb-[6rem]" : ""
        }`}
      >
        <ShowDetailsCard {...showDetails} />

        <div className="grid grid-cols-1 xl:grid-cols-3 max-xl:gap-4">
          <div className="xl:col-span-2">
            <ScreenIndicator />
            <SeatsSelection {...showDetails} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 xl:flex-col">
            <SeatPricingCard />
            <BookingSummaryCard {...showDetails} />
          </div>
        </div>
      </div>
    </section>
  );
}

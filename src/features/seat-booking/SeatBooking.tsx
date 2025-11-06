import { useLocation } from "react-router";
import { type ShowDetailsCardProps } from "./types";
import ShowDetailsCard from "./components/show-details-card";
import ScreenIndicator from "./components/screen-indicator";
import SeatsSelection from "./components/seats-selection";
import SeatPricingCard from "./components/seat-pricing-card";
import BookingSummaryCard from "./components/booking-summary-card";

export default function SeatBooking() {
  const location = useLocation();
  const showDetails: ShowDetailsCardProps = location.state?.showDetails;

  return (
    <section className="container mx-auto px-4 py-8 space-y-4">
      <div className="space-y-4 max-w-5xl mx-auto">
        <ShowDetailsCard {...showDetails} />
        <ScreenIndicator />
        <SeatsSelection {...showDetails} />
        <div className="flex flex-col sm:flex-row gap-4">
          <SeatPricingCard />
          <BookingSummaryCard {...showDetails} />
        </div>
      </div>
    </section>
  );
}

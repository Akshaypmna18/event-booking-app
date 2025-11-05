import { useLocation } from "react-router";
import { type ShowDetailsCardProps } from "./types";
import ShowDetailsCard from "./show-details-card";
import ScreenIndicator from "./screen-indicator";
import SeatsSelection from "./seats-selection";
import SeatPricingCard from "./seat-pricing-card";
// import BookingSummaryCard from "./booking-summary-card";

export default function SeatBooking() {
  const location = useLocation();
  const showDetails: ShowDetailsCardProps = location.state?.showDetails;

  return (
    <section className="container mx-auto px-4 py-8 space-y-4">
      <div className="space-y-4 max-w-5xl mx-auto">
        <ShowDetailsCard {...showDetails} />
        <ScreenIndicator />
        <SeatsSelection {...showDetails} />
        <SeatPricingCard />
        {/* <BookingSummaryCard /> */}
      </div>
    </section>
  );
}

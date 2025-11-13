import MoviesSection from "./movies";
import BookingsSection from "./bookings";

export default function MoviesList() {
  return (
    <section className="container mx-auto px-4 py-8 min-h-dvh">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Movie Booking</h1>
        <p data-testid="page-subtitle" className="text-muted-foreground">
          Book your tickets for the latest movies
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-4">
        <BookingsSection />
        <MoviesSection />
      </div>
    </section>
  );
}

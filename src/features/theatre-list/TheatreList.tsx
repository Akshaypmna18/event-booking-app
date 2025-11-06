import MovieCard from "@/components/movie-card";
import TheatreCard from "./theatre-card";
import { useLocation } from "react-router";
import { type Movie, type TheatreMovie } from "@/lib/types";

export default function TheatreList() {
  const location = useLocation();
  const movie: Movie = location.state?.movie;

  if (!movie) {
    return <section>No movie data available</section>;
  }

  return (
    <section className="container mx-auto px-4 py-8 space-y-4">
      <div className="space-y-4 max-w-5xl mx-auto">
        <MovieCard movie={movie} />
        <h2 className="font-bold text-2xl">Available Theatres</h2>
        {movie?.theatres.map(({ name, shows }: TheatreMovie) => (
          <TheatreCard
            key={name}
            movieName={movie.title}
            name={name}
            shows={shows}
          />
        ))}
      </div>
    </section>
  );
}

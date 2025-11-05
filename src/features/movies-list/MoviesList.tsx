import moviesData from "@/data/movies.json";
import MovieCard from "./movie-card";
import { type Movie } from "@/features/movies-list/types";

export default function MoviesList() {
  const movies = moviesData as Movie[];

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Now Showing</h1>
        <p data-testid="page-subtitle" className="text-muted-foreground">
          Book your tickets for the latest movies
        </p>
      </div>

      <div className="space-y-4 max-w-5xl mx-auto">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

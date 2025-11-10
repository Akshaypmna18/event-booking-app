import moviesData from "@/data/movies.json";
import MovieCard from "@/components/movie-card";
import { type Movie } from "@/lib/types";

export default function MoviesList() {
  const movies = moviesData as Movie[];

  return (
    <section className="container mx-auto px-4 py-8 min-h-dvh">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Now Showing</h1>
        <p data-testid="page-subtitle" className="text-muted-foreground">
          Book your tickets for the latest movies
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid xl:grid-cols-2 xl:gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} isMovieListPage />
        ))}
      </div>
    </section>
  );
}

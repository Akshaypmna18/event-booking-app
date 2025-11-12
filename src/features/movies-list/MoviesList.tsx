import LoadingFallback from "@/components/LoadingFallback";
import MovieCard from "@/components/movie-card";
import { getMovies } from "@/lib/services";
import { useQuery } from "@tanstack/react-query";

export default function MoviesList() {
  const { data: movies, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: getMovies,
  });

  if (isLoading) return <LoadingFallback />;

  return (
    <section className="container mx-auto px-4 py-8 min-h-dvh">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Now Showing</h1>
        <p data-testid="page-subtitle" className="text-muted-foreground">
          Book your tickets for the latest movies
        </p>
      </div>

      <div className="max-xl:space-y-4 max-w-6xl mx-auto grid xl:grid-cols-2 xl:gap-4">
        {movies?.map((movie) => (
          <MovieCard key={movie.id} movie={movie} isMovieListPage />
        ))}
      </div>
    </section>
  );
}

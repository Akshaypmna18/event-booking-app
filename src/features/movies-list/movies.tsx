import MovieCard from "@/components/movie-card";
import { getMovies } from "@/lib/services";
import { useQuery } from "@tanstack/react-query";
import MoviesSkeltonCard from "@/components/movies-card-skelton";
import { getErrorMessage } from "@/lib/utils";

const SKELETON_COUNT = 4;

export default function Movies() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["movies"],
    queryFn: getMovies,
  });

  return (
    <div>
      <h2 className="font-bold text-2xl mb-4">Available Movies</h2>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          <p className="font-semibold">Error loading movies</p>
          <p className="text-sm">{getErrorMessage(error)}</p>
        </div>
      )}

      <div className="max-xl:space-y-4 grid xl:grid-cols-2 xl:gap-4">
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <MoviesSkeltonCard
                key={`movie-card-skelton-${i}`}
                isMovieListPage
              />
            ))
          : data?.map((movie) => (
              <MovieCard key={movie.id} movie={movie} isMovieListPage />
            ))}
      </div>
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Movie } from "@/lib/types";
import { useNavigate } from "react-router";
import { Star } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  isMovieListPage?: boolean;
}

export default function MovieCard({
  movie,
  isMovieListPage = false,
}: MovieCardProps) {
  const navigate = useNavigate();

  const handleBookNow = () => navigate("/theatre-list", { state: { movie } });

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 p-0">
      <div className="flex flex-col sm:flex-row">
        {/* Left: Poster */}
        <div className="relative w-full sm:w-48 h-64 sm:h-auto shrink-0 bg-muted">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover min-[400px]:object-contain sm:object-cover"
          />
        </div>

        {/* Right: Details */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Header Section */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-xl line-clamp-1">{movie.title}</h3>
              <Badge
                data-testid={`rating-${movie.id}`}
                variant="secondary"
                className="shrink-0"
              >
                <Star fill="#eab308" strokeWidth={0} className="!w-4 !h-4" />
                {movie.rating}
              </Badge>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
              {movie.language} | {movie.genre} | Duration: {movie.duration}
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {movie.description}
          </p>

          {/* Cast & Director */}
          <div className="space-y-1 text-sm mb-4">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Cast:</span>{" "}
              {movie.cast.join(", ")}
            </p>
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Director:</span>{" "}
              {movie.director}
            </p>
          </div>

          {isMovieListPage && (
            <div className="mt-auto">
              <Button onClick={handleBookNow} className="w-full sm:w-auto px-8">
                Book
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

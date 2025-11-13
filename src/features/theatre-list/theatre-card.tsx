import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { type TheatreMovie, type Show } from "@/lib/types";
import { useNavigate } from "react-router";

type TheatreName = string;
type TheatreCardProps = TheatreMovie & { movieName: string; poster: string };

export default function TheatreCard({
  name,
  shows,
  movieName,
  poster,
}: TheatreCardProps) {
  const navigate = useNavigate();

  const handleShowBtnClick = (show: Show, name: TheatreName) => {
    const showDetails = { ...show, name, movieName, poster };
    navigate("/seat-booking", { state: { showDetails } });
  };

  return (
    <Card className="p-4 gap-2">
      <h2 className="text-xl">{name}</h2>

      <div className="flex flex-wrap gap-3">
        {shows?.map((show: Show) => (
          <Badge
            key={show?.screen + show?.time}
            className="rounded-sm flex flex-col px-4 py-2 text-base cursor-pointer hover:bg-gray-200"
            variant="outline"
            onClick={() => handleShowBtnClick(show, name)}
          >
            <h4 className="text-base font-semibold">{show?.screen}</h4>
            <p className="text-sm">{show?.time}</p>
          </Badge>
        ))}
      </div>
    </Card>
  );
}

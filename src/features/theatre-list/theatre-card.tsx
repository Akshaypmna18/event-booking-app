import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { type Theatre, type Show } from "@/lib/types";
import { useNavigate } from "react-router";

type TheatreName = string;
type TheatreCardProps = Theatre & { movieName: string };

export default function TheatreCard({
  name,
  shows,
  movieName,
}: TheatreCardProps) {
  const navigate = useNavigate();

  const handleShowBtnClick = (show: Show, name: TheatreName) => {
    const showDetails = { ...show, name, movieName };
    navigate("/seat-booking", { state: { showDetails } });
  };

  return (
    <Card className="p-4 gap-2">
      <h2 className="text-xl">{name}</h2>
      <div className="flex flex-wrap gap-3">
        {shows?.map((show: Show) => (
          <Badge
            key={show?.screen + show?.time}
            className="rounded-sm flex flex-col px-4 py-2 text-base"
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

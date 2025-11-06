import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type ShowDetailsCardProps } from "../types";

export default function ShowDetailsCard({
  screen,
  time,
  name,
  movieName,
}: ShowDetailsCardProps) {
  return (
    <Card className="p-2">
      <CardContent className="p-2 space-y-3">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold">
            {movieName} : {name}
          </h3>

          <Badge variant="secondary" className="rounded-sm text-base px-3 py-1">
            {screen}
          </Badge>
          <Badge variant="default" className="rounded-sm text-base px-3 py-1">
            {time}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

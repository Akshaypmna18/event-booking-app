import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Ticket } from "lucide-react";

type TicketsCardProps = {
  movieName: string;
  name: string;
  selectedSeatIds: string[];
};

export default function TicketsCard({
  movieName,
  name,
  selectedSeatIds,
}: TicketsCardProps) {
  return (
    <Card className="mb-6 -space-y-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Ticket className="w-5 h-5" />
          <CardTitle>Your Tickets</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Movie and Theatre Info */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Movie</p>
            <p className="text-lg font-semibold">{movieName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Theatre</p>
            <p className="text-lg font-semibold">{name}</p>
          </div>
        </div>

        <Separator />

        {/* Selected Seats */}
        <div>
          <p className="text-sm text-muted-foreground mb-3">Selected Seats</p>
          <div className="flex gap-3 flex-wrap">
            {selectedSeatIds.map((seat) => (
              <div
                key={seat}
                className="px-4 py-2 border rounded-lg font-medium"
              >
                {seat}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

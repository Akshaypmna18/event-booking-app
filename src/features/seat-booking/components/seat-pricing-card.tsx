import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SeatType } from "@/lib/types";
import { SEAT_CATEGORY_CONFIG } from "../utils";

const SEAT_CATEGORIES: SeatType[] = ["silver", "gold", "platinum"];

export default function SeatPricingCard() {
  return (
    <Card className="w-full sm:max-w-sm">
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {SEAT_CATEGORIES.map((category) => {
          const config = SEAT_CATEGORY_CONFIG[category];
          return (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded ${config.color}`} />
                <span className="capitalize">{config.label}</span>
              </div>
              <span className="font-semibold">₹{config.price}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

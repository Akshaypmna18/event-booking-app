import { Card, CardContent } from "@/components/ui/card";

export default function PriceBreakdownCard({
  totalPrice,
}: {
  totalPrice: number;
}) {
  return (
    <Card className="mb-6">
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 items-center">
          <span className="font-semibold text-base">Total Price</span>
          <span className="text-right font-bold text-lg ">₹{totalPrice}</span>
        </div>
      </CardContent>
    </Card>
  );
}

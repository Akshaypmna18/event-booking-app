import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Booking, DialogTypes } from "@/lib/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function BookingMovieCard({ movie }: { movie: Booking }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleCardClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <BookingDetailsDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        movie={movie}
      />
      <Card
        className="p-0 rounded-sm max-h-[8rem] hover:scale-[1.02] transition-all duration-300 cursor-pointer select-none"
        onClick={handleCardClick}
      >
        <div className="flex">
          {/* Left: Poster */}
          <img
            src={movie?.image}
            alt={movie?.movieName + movie?.theatreName}
            className="w-[30%] rounded-l-sm max-h-[6.15rem]"
          />

          {/* Right Details */}
          <div className="flex flex-col grow p-2 min-w-0">
            <h3 className="text-lg font-bold truncate">{movie?.movieName}</h3>
            <p className="text-muted-foreground font-semibold truncate">
              {movie?.theatreName}
            </p>
            <div className="flex mt-2 gap-2">
              <Badge className="rounded-sm" variant="secondary">
                {movie?.screen}
              </Badge>
              <Badge className="rounded-sm" variant="secondary">
                {movie?.time}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

type DialogProps = DialogTypes & { movie: Booking };

const BookingDetailsDialog = ({ isOpen, setIsOpen, movie }: DialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-[min(80dvw,35rem)]"
      >
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription className="sr-only">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          {/* Movie and Theatre Info */}
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Movie</p>
              <p className="text-lg font-semibold">{movie?.movieName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Theatre</p>
              <p className="text-lg font-semibold">{movie?.theatreName}</p>
            </div>
          </div>

          <Separator />

          {/* Selected Seats */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">Selected Seats</p>
            <div className="flex gap-3 flex-wrap">
              {movie?.selectedSeats.map((seat) => (
                <div
                  key={seat}
                  className="px-4 py-2 border rounded-lg font-medium"
                >
                  {seat}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Price</p>
              <p className="text-lg font-semibold"> ₹{movie?.price}</p>
            </div>
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <DialogClose asChild className="grow">
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <a
            className="grow"
            href="/qr-code-sample.png"
            download={`${movie?.movieName}-qr-code.png`}
          >
            <Button type="button" className="w-full">
              <Download className="w-4 h-4" /> Download Ticket
            </Button>
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

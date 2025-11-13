import { getBookings } from "@/lib/services";
import { useQuery } from "@tanstack/react-query";
import BookingMovieCard from "./booking-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";

export default function Bookings() {
  const { data, isFetched } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });

  if (!isFetched) return null;

  if (data?.count && data.count === 0) return null;

  return (
    <>
      <div className="">
        <h2 className="font-bold text-2xl mb-4">
          Your bookings ({data?.count})
        </h2>
        <div className="px-8">
          <Carousel>
            <CarouselContent>
              {data?.bookings?.map((movie, index) => (
                <CarouselItem
                  key={`movie-booking-${index}`}
                  className="min-[550px]:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <BookingMovieCard movie={movie} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>

      <Separator />
    </>
  );
}

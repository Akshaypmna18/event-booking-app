import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BookingSuccessAlertProps {
  isOpen: boolean | undefined;
}

export default function BookingSuccessAlert({
  isOpen,
}: BookingSuccessAlertProps) {
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState<number>(5);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  useEffect(() => {
    if (countdown === 0) handleGoHome();
  }, [countdown]);

  if (!isOpen) return null;

  const handleGoHome = (): void => {
    navigate("/");
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogHeader className="sr-only">
        <AlertDialogTitle className="text-red-600">
          Too many tickets selected
        </AlertDialogTitle>
        <AlertDialogDescription>
          You can only select <b>up to 8 tickets</b>. Please adjust your
          selection.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogContent className="p-0" data-testid="alert-content">
        <Card className="text-center -space-y-3" data-testid="card">
          <CheckCircle
            className="w-16 h-16 text-green-400 mx-auto"
            data-testid="check-icon"
          />
          <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
          <p className="text-muted-foreground text-sm">
            Your tickets have been booked successfully.
          </p>
          <p className="text-muted-foreground text-xs" data-testid="countdown">
            Redirecting in...{countdown}s
          </p>
          <Button
            className="w-max block mx-auto"
            onClick={handleGoHome}
            data-testid="button"
          >
            Go to Home
          </Button>
        </Card>
      </AlertDialogContent>
    </AlertDialog>
  );
}

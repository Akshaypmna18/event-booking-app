import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <section className="grid place-items-center min-h-dvh">
      <div className="flex flex-col gap-2 justify-center items-center">
        <h1 className="text-red-500 text-2xl font-bold">
          There is an error. Please Go to Homepage
        </h1>
        <Button className="w-max" onClick={() => navigate("/")}>
          Homepage
        </Button>
      </div>
    </section>
  );
}

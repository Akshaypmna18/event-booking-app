import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function BackNavigate() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="p-2 rounded-md bg-neutral-200 hover:bg-neutral-400 border cursor-pointer transition max-md:hidden"
    >
      <ChevronLeft className="w-6 h-6" />
    </button>
  );
}

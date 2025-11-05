import { Button } from "@/components/ui/button";
import { useStore } from "./store";

export default function App() {
  const btnText = useStore((state) => state.btnText);

  return <Button onClick={() => alert("hi")}>{btnText}</Button>;
}

import type { SeatLayout, SeatObject, SeatType } from "@/lib/types";
import type { ShowDetailsCardProps } from "./types";
import theatresData from "@/data/theatres.json";
import type { Dispatch, SetStateAction } from "react";

const MAX_COLUMNS = 10 as const;

type ExistingVal =
  | string
  | {
      status?: "available" | "unavailable";
      type?: SeatType;
    };

export const SEAT_CATEGORY_CONFIG = {
  silver: { label: "Silver", color: "bg-blue-500", price: 150 },
  gold: { label: "Gold", color: "bg-yellow-500", price: 200 },
  platinum: { label: "Platinum", color: "bg-purple-500", price: 250 },
} as const;

export function createIdForShow(showDetails: ShowDetailsCardProps): string {
  return Object.values(showDetails).join("-");
}

export function getSeatLayout(name: string): SeatLayout | undefined {
  const matchingTheatre = theatresData.find((theat) => theat.name === name);
  return matchingTheatre?.seatLayout;
}

export function getTotalRows(seatLayout: SeatLayout | undefined): number {
  return Object.values(seatLayout || {}).reduce(
    (sum, item) => sum + item.rows,
    0
  );
}

export function rowIndexToLetters(index: number): string {
  let s = "";
  for (index++; index > 0; index = Math.floor((index - 1) / 26)) {
    s = String.fromCharCode(65 + ((index - 1) % 26)) + s;
  }
  return s;
}

export function createSeats(
  showDetails: ShowDetailsCardProps,
  seats: Record<string, SeatObject[]>,
  setId: Dispatch<SetStateAction<string | undefined>>
): Record<string, SeatObject[]> {
  const id = createIdForShow(showDetails);
  setId(id);
  const layout = getSeatLayout(showDetails.name);
  const totalRows = getTotalRows(layout);

  const existingMap = new Map<string, ExistingVal>(
    (seats[id] || []).map((obj) => Object.entries(obj)[0]!)
  );

  const types: SeatType[] = ["silver", "gold", "platinum"];
  const rowToType = (r: number): SeatType => {
    let i = r;
    for (const t of types) {
      const rows = layout?.[t]?.rows ?? 0;
      if (i < rows) return t;
      i -= rows;
    }
    return types[types.length - 1];
  };

  const result: SeatObject[] = [];
  for (let r = 0; r < totalRows; r++) {
    const computedType = rowToType(r);
    const row = rowIndexToLetters(r);

    for (let c = 1; c <= MAX_COLUMNS; c++) {
      const seatId = `${row}${c}`;
      const existing = existingMap.get(seatId);

      const status =
        typeof existing === "string"
          ? (existing as "available" | "unavailable")
          : existing?.status ?? "available";

      result.push({
        [seatId]: { status, type: computedType },
      });
    }
  }

  return { [id]: result };
}

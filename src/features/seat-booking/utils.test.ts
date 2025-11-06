import { describe, it, expect } from "vitest";
import {
  createIdForShow,
  getSeatLayout,
  getTotalRows,
  rowIndexToLetters,
  getKeysArray,
  createSeats,
  convertRowToType,
} from "./utils";
import { type ShowDetailsCardProps } from "./types";
import type { BookedSeat, SeatObject } from "@/lib/types";

describe("Utils Functions", () => {
  describe("createIdForShow", () => {
    it("should create ID from show details", () => {
      const showDetails: ShowDetailsCardProps = {
        screen: "Screen 1",
        time: "10:00 AM",
        name: "ABC-Multiplex",
        movieName: "Dies Irae",
      };

      expect(createIdForShow(showDetails)).toBe(
        "Screen 1-10:00 AM-ABC-Multiplex-Dies Irae"
      );
    });

    it("should create unique IDs for different shows", () => {
      const show1: ShowDetailsCardProps = {
        screen: "Screen 1",
        time: "10:00 AM",
        name: "ABC-Multiplex",
        movieName: "Dies Irae",
      };

      const show2: ShowDetailsCardProps = {
        screen: "Screen 2",
        time: "02:30 PM",
        name: "XYZ-Multiplex",
        movieName: "The Pet Detective",
      };

      expect(createIdForShow(show1)).not.toBe(createIdForShow(show2));
    });
  });

  describe("getSeatLayout", () => {
    it("should return seat layout for matching theatre", () => {
      const result = getSeatLayout("ABC-Multiplex");

      expect(result).toBeDefined();
      expect(result).toHaveProperty("silver");
      expect(result).toHaveProperty("gold");
      expect(result).toHaveProperty("platinum");
    });

    it("should return undefined for non-existent theatre", () => {
      const result = getSeatLayout("Non-Existent Theatre");

      expect(result).toBeUndefined();
    });

    it("should return correct layout structure", () => {
      const result = getSeatLayout("ABC-Multiplex");

      expect(result?.silver).toBeDefined();
      expect(result?.gold).toBeDefined();
      expect(result?.platinum).toBeDefined();
    });
  });

  describe("getTotalRows", () => {
    it("should calculate total rows from seat layout", () => {
      const seatLayout = {
        silver: { rows: 5, price: 150 },
        gold: { rows: 4, price: 200 },
        platinum: { rows: 3, price: 250 },
      };

      expect(getTotalRows(seatLayout)).toBe(12);
    });

    it("should handle undefined seat layout", () => {
      expect(getTotalRows(undefined)).toBe(0);
    });
  });

  describe("rowIndexToLetters", () => {
    it("should convert single digit index to letter", () => {
      expect(rowIndexToLetters(0)).toBe("A");
      expect(rowIndexToLetters(1)).toBe("B");
      expect(rowIndexToLetters(9)).toBe("J");
    });
  });

  describe("getKeysArray", () => {
    it("should extract seat keys from booked seats", () => {
      const bookedSeats: BookedSeat[] = [
        { A1: "silver" },
        { B2: "gold" },
        { C3: "platinum" },
      ];

      expect(getKeysArray(bookedSeats)).toEqual(["A1", "B2", "C3"]);
    });

    it("should handle single booked seat", () => {
      const bookedSeats: BookedSeat[] = [{ A1: "silver" }];

      expect(getKeysArray(bookedSeats)).toEqual(["A1"]);
    });

    it("should handle empty array", () => {
      const bookedSeats: BookedSeat[] = [];

      expect(getKeysArray(bookedSeats)).toEqual([]);
    });

    it("should extract keys regardless of seat type", () => {
      const bookedSeats: BookedSeat[] = [
        { Row1Seat1: "silver" },
        { Row2Seat5: "gold" },
        { Row3Seat10: "platinum" },
      ];

      expect(getKeysArray(bookedSeats)).toEqual([
        "Row1Seat1",
        "Row2Seat5",
        "Row3Seat10",
      ]);
    });
  });

  describe("createSeats", () => {
    const mockSetUniqueMovieId = vi.fn();

    const showDetails: ShowDetailsCardProps = {
      screen: "Screen 1",
      time: "10:00 AM",
      name: "ABC-Multiplex",
      movieName: "Dies Irae",
    };

    it("should create seats with correct structure", () => {
      const seats: Record<string, SeatObject[]> = {};
      const result = createSeats(showDetails, seats, mockSetUniqueMovieId);

      // Should return object with show ID as key
      expect(Object.keys(result).length).toBe(1);

      // Should have seat objects in array
      const [seatArray] = Object.values(result);
      expect(Array.isArray(seatArray)).toBe(true);
      expect(seatArray.length).toBeGreaterThan(0);
    });

    it("should call setUniqueMovieId with show ID", () => {
      const seats: Record<string, SeatObject[]> = {};
      createSeats(showDetails, seats, mockSetUniqueMovieId);

      expect(mockSetUniqueMovieId).toHaveBeenCalled();
      expect(mockSetUniqueMovieId).toHaveBeenCalledWith(
        "Screen 1-10:00 AM-ABC-Multiplex-Dies Irae"
      );
    });

    it("should create seats with available status by default", () => {
      const seats: Record<string, SeatObject[]> = {};
      const result = createSeats(showDetails, seats, mockSetUniqueMovieId);

      const [seatArray] = Object.values(result);

      // Each seat should have status and type
      seatArray.forEach((seatObj) => {
        const [_, seatData] = Object.entries(seatObj)[0];
        expect(seatData.status).toBe("available");
        expect(["silver", "gold", "platinum"]).toContain(seatData.type);
      });
    });

    it("should generate correct seat IDs", () => {
      const seats: Record<string, SeatObject[]> = {};
      const result = createSeats(showDetails, seats, mockSetUniqueMovieId);

      const [seatArray] = Object.values(result);

      // Should have seats like A1, A2, B1, B2, etc.
      const seatIds = seatArray.map((obj) => Object.keys(obj)[0]);
      expect(seatIds).toContain("A1");
      expect(seatIds[0]).toMatch(/^[A-Z]+\d+$/); // Format: Letter(s) + number
    });
  });

  describe("convertRowToType", () => {
    const mockLayout = {
      silver: { rows: 5, price: 100 },
      gold: { rows: 4, price: 150 },
      platinum: { rows: 3, price: 200 },
    };

    it("should return silver for rows 0-4", () => {
      expect(convertRowToType(0, mockLayout)).toBe("silver");
      expect(convertRowToType(2, mockLayout)).toBe("silver");
      expect(convertRowToType(4, mockLayout)).toBe("silver");
    });

    it("should return gold for rows 5-8", () => {
      expect(convertRowToType(5, mockLayout)).toBe("gold");
      expect(convertRowToType(6, mockLayout)).toBe("gold");
      expect(convertRowToType(8, mockLayout)).toBe("gold");
    });

    it("should return platinum for rows 9-11", () => {
      expect(convertRowToType(9, mockLayout)).toBe("platinum");
      expect(convertRowToType(10, mockLayout)).toBe("platinum");
      expect(convertRowToType(11, mockLayout)).toBe("platinum");
    });

    it("should handle undefined layout", () => {
      // With no layout, should return last type (platinum)
      expect(convertRowToType(0, undefined)).toBe("platinum");
      expect(convertRowToType(100, undefined)).toBe("platinum");
    });

    it("should return platinum as fallback for high row numbers", () => {
      expect(convertRowToType(20, mockLayout)).toBe("platinum");
    });
  });
});

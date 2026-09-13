import { describe, expect, it } from "vitest";
import {
  countScheduleOccurrences,
  getIsoWeekday,
} from "../booking-schedule";

describe("getIsoWeekday", () => {
  it("maps Sunday and Monday using ISO numbering", () => {
    expect(getIsoWeekday("2026-09-06")).toBe(7);
    expect(getIsoWeekday("2026-09-07")).toBe(1);
  });
});

describe("countScheduleOccurrences", () => {
  it("counts inclusive recurrence dates", () => {
    expect(countScheduleOccurrences("2026-09-06", "2026-10-06", [{ day: 1 }])).toBe(5);
    expect(
      countScheduleOccurrences("2026-09-06", "2026-10-06", [
        { day: 1 },
        { day: 3 },
      ]),
    ).toBe(9);
  });

  it("returns zero for invalid ranges", () => {
    expect(countScheduleOccurrences("2026-10-06", "2026-09-06", [{ day: 1 }])).toBe(0);
  });
});

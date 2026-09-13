import { describe, expect, test } from "vitest";
import { normalizeAcademicLevel } from "../student-normalizer";

describe("normalizeAcademicLevel", () => {
  test("canonicalizes lowercase persisted values", () => {
    expect(normalizeAcademicLevel("good")).toBe("GOOD");
  });

  test("preserves canonical wire values", () => {
    expect(normalizeAcademicLevel("EXCELLENT")).toBe("EXCELLENT");
  });

  test("defaults null values to average", () => {
    expect(normalizeAcademicLevel(null)).toBe("AVERAGE");
  });

  test("defaults unknown values to average", () => {
    expect(normalizeAcademicLevel("unknown")).toBe("AVERAGE");
  });
});

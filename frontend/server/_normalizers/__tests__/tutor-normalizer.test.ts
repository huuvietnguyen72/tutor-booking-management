import { describe, expect, test } from "vitest";
import { normalizeTutorDetail } from "../tutor-normalizer";

const profile = {
  id: 1,
  userId: 1,
  fullName: "Tutor Test",
  avatarUrl: "https://example.test/avatar.png",
  bio: "Tutor profile",
  educationLevel: "BACHELOR",
  experienceYears: 3,
  experience: "Three years teaching",
  qualifications: "Bachelor degree",
  teachingMode: "ONLINE",
  teachingArea: "",
  approvalStatus: "PENDING",
  rejectionReason: null,
  rating: 5,
  totalReviews: 1,
  isAvailable: true,
  approvedAt: undefined,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("normalizeTutorDetail", () => {
  test("canonicalizes lowercase legacy wire enums", () => {
    expect(
      normalizeTutorDetail({
        ...profile,
        educationLevel: "bachelor",
        teachingMode: "offline",
        approvalStatus: "pending",
      }),
    ).toMatchObject({
      educationLevel: "BACHELOR",
      teachingMode: "OFFLINE",
      approvalStatus: "PENDING",
    });
  });

  test("rejects unknown approval statuses instead of treating them as rejected", () => {
    expect(() =>
      normalizeTutorDetail({ ...profile, approvalStatus: "archived" }),
    ).toThrow("Unknown tutor approval status: archived");
  });
});

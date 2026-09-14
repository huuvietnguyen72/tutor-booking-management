import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Step4Confirmation } from "./step-4-confirmation";

describe("Step4Confirmation", () => {
  it("estimates tuition from every recurring occurrence", () => {
    const props = {
      bookingType: "recurring" as const,
      startDate: "2026-09-06",
      endDate: "2026-10-06",
      selectedSlots: [{ day: 1, startTime: "08:00", endTime: "10:00" }],
      pricePerSession: 200_000,
    };

    render(
      <Step4Confirmation
        {...props}
        child={{
          id: 1,
          parentId: 1,
          fullName: "Student Test",
          grade: 5,
          school: "Test School",
          academicLevel: "GOOD",
        }}
        tutor={{
          id: 2,
          userId: 2,
          fullName: "Tutor Test",
          avatarUrl: "",
          educationLevel: "BACHELOR",
          experienceYears: 1,
          teachingMode: "ONLINE",
          approvalStatus: "APPROVED",
          rejectionReason: null,
          rating: 0,
          totalReviews: 0,
          isAvailable: true,
          createdAt: "2026-09-06",
          updatedAt: "2026-09-06",
        }}
        subject={{
          id: 3,
          subjectId: 3,
          subjectName: "Mathematics",
          gradeLevel: 5,
          pricePerSession: 200_000,
        }}
        learningMode="online"
        onBack={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByText("5 buổi")).toBeInTheDocument();
    expect(screen.getByText("1.000.000đ")).toBeInTheDocument();
    expect(screen.queryByText(/giảm 10%/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/VAT/i)).not.toBeInTheDocument();
    expect(screen.getByText(/ước tính học phí/i)).toBeInTheDocument();
  });
});

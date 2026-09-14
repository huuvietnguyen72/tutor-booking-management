import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ComponentProps } from "react";
import { describe, expect, test, vi } from "vitest";
import type { IBooking } from "@/server/_types/booking-type";
import { CourseList } from "./course-list";

vi.mock("next/image", () => ({
  default: ({ fill: _fill, ...props }: ComponentProps<"img"> & { fill?: boolean }) => (
    <img {...props} />
  ),
}));

const booking: IBooking = {
  id: 41,
  parentId: 1,
  tutorId: 2,
  studentId: 3,
  subjectId: 4,
  gradeLevel: 5,
  pricePerSession: 200_000,
  teachingMode: "ONLINE",
  isRecurring: true,
  schedules: [{ id: 1, dayOfWeek: 1, startTime: "08:00", endTime: "10:00" }],
  recurringStartDate: "2026-09-07",
  recurringEndDate: "2026-10-05",
  status: "COMPLETED",
  subjectName: "Toán",
  studentName: "Minh",
  tutorName: "Cô Lan",
  totalSessions: 5,
  completedSessions: 0,
  isReviewed: true,
};

describe("CourseList", () => {
  test("uses booking summaries for zero progress and hides review for reviewed bookings", () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <CourseList courses={[booking]} isLoading={false} />
      </QueryClientProvider>,
    );

    expect(screen.getByText("0/5 Buổi")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Đánh giá" })).not.toBeInTheDocument();
  });
});

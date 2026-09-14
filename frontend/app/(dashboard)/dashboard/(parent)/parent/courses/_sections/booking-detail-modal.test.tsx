import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ComponentProps } from "react";
import { describe, expect, test, vi } from "vitest";
import type { IBooking } from "@/server/_types/booking-type";
import { BookingDetailModal } from "./booking-detail-modal";

const { getBooking } = vi.hoisted(() => ({ getBooking: vi.fn() }));

vi.mock("@/server/http-client", () => ({
  axiosInstance: {
    get: getBooking,
    put: vi.fn(),
  },
}));

vi.mock("next/image", () => ({
  default: ({ fill: _fill, ...props }: ComponentProps<"img"> & { fill?: boolean }) => (
    <img {...props} />
  ),
}));

const booking: IBooking = {
  id: 42,
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
  status: "ACTIVE",
  subjectName: "Toán",
  studentName: "Minh",
  tutorName: "Cô Lan",
  totalSessions: 5,
  completedSessions: 0,
  isReviewed: false,
};

const detail = {
  ...booking,
  sessions: [
    {
      id: 99,
      bookingId: 42,
      sessionDate: "2026-09-07",
      startTime: "09:15",
      endTime: "10:15",
      status: "PENDING" as const,
    },
  ],
};

describe("BookingDetailModal", () => {
  test("loads detail only after opening and renders ISO weekday labels with detail sessions", async () => {
    getBooking.mockResolvedValue({ data: detail });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const view = render(
      <QueryClientProvider client={queryClient}>
        <BookingDetailModal booking={booking} isOpen={false} onClose={vi.fn()} />
      </QueryClientProvider>,
    );

    expect(getBooking).not.toHaveBeenCalled();

    view.rerender(
      <QueryClientProvider client={queryClient}>
        <BookingDetailModal booking={booking} isOpen onClose={vi.fn()} />
      </QueryClientProvider>,
    );

    expect(screen.getByText("Thứ 2 • 08:00 - 10:00")).toBeInTheDocument();
    await waitFor(() => expect(getBooking).toHaveBeenCalledTimes(1));
    expect(await screen.findByText("09:15 - 10:15")).toBeInTheDocument();
  });
});

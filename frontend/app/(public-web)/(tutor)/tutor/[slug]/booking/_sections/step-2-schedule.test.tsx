import { render, screen, waitFor } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import type { Slot } from "../page";
import { Step2Schedule } from "./step-2-schedule";

const availability = [
  { dayOfWeek: 1, startTime: "08:00:00", endTime: "10:00:00" },
  { dayOfWeek: 7, startTime: "08:00:00", endTime: "10:00:00" },
];

vi.mock("@/server/_actions/tutor-action", () => ({
  useGetTutorAvailability: () => ({ data: availability, isLoading: false }),
}));

vi.mock("@/shared/components/features/availability-grid", () => ({
  AvailabilityGrid: ({ availableSlots }: { availableSlots?: Record<number, string[]> }) => (
    <div>
      {Object.entries(availableSlots ?? {}).flatMap(([day, slots]) =>
        slots.map((slot) => (
          <button key={`${day}-${slot}`} type="button">
            available {day} {slot}
          </button>
        )),
      )}
    </div>
  ),
  DAYS: [
    { value: 1, label: "Thứ 2", short: "T2" },
    { value: 2, label: "Thứ 3", short: "T3" },
    { value: 3, label: "Thứ 4", short: "T4" },
    { value: 4, label: "Thứ 5", short: "T5" },
    { value: 5, label: "Thứ 6", short: "T6" },
    { value: 6, label: "Thứ 7", short: "T7" },
    { value: 7, label: "Chủ Nhật", short: "CN" },
  ],
}));

vi.mock("@/shared/components/ui/calendar", () => ({
  DatePickerInput: () => <div />,
}));

type Step2ScheduleProps = ComponentProps<typeof Step2Schedule> & {
  onSelectedSlotsChange: (slots: Slot[]) => void;
};

const mondaySlot: Slot = {
  day: 1,
  slot: "08:00",
  time: "08:00 - 10:00",
};

const sundaySlot: Slot = {
  day: 7,
  slot: "08:00",
  time: "08:00 - 10:00",
};

function scheduleProps(
  overrides: Partial<Step2ScheduleProps> = {},
): Step2ScheduleProps {
  return {
    tutorId: 1,
    bookingType: "one-time",
    onBookingTypeChange: vi.fn(),
    selectedSlots: [],
    onSelectedSlotsChange: vi.fn(),
    onSlotToggle: vi.fn(),
    startDate: "2026-09-06",
    onStartDateChange: vi.fn(),
    endDate: "2026-10-06",
    onEndDateChange: vi.fn(),
    onBack: vi.fn(),
    onNext: vi.fn(),
    ...overrides,
  };
}

describe("Step2Schedule", () => {
  it("shows only Sunday availability for a Sunday one-time booking", () => {
    render(<Step2Schedule {...scheduleProps()} />);

    expect(screen.getByRole("button", { name: "available 7 08:00" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "available 1 08:00" })).not.toBeInTheDocument();
  });

  it("removes a Monday selection when the one-time date changes to Sunday", async () => {
    const onSelectedSlotsChange = vi.fn();
    const { rerender } = render(
      <Step2Schedule
        {...scheduleProps({
          startDate: "2026-09-07",
          selectedSlots: [mondaySlot],
          onSelectedSlotsChange,
        })}
      />,
    );

    rerender(
      <Step2Schedule
        {...scheduleProps({
          startDate: "2026-09-06",
          selectedSlots: [mondaySlot],
          onSelectedSlotsChange,
        })}
      />,
    );

    await waitFor(() => {
      expect(onSelectedSlotsChange).toHaveBeenCalledWith([]);
    });
  });

  it("disables continue when a one-time selection does not match the date", () => {
    render(
      <Step2Schedule
        {...scheduleProps({ selectedSlots: [mondaySlot] })}
      />,
    );

    expect(screen.getByRole("button", { name: "TIẾP TỤC" })).toBeDisabled();
  });

  it("identifies Sunday in the one-time weekday guidance", () => {
    render(<Step2Schedule {...scheduleProps()} />);

    expect(screen.getByText("Ngày bạn chọn là Chủ Nhật.")).toBeInTheDocument();
  });

  it("removes mismatched slots when changing recurring booking to one-time", async () => {
    const onSelectedSlotsChange = vi.fn();
    const { rerender } = render(
      <Step2Schedule
        {...scheduleProps({
          bookingType: "long-term",
          selectedSlots: [mondaySlot, sundaySlot],
          onSelectedSlotsChange,
        })}
      />,
    );

    rerender(
      <Step2Schedule
        {...scheduleProps({
          bookingType: "one-time",
          selectedSlots: [mondaySlot, sundaySlot],
          onSelectedSlotsChange,
        })}
      />,
    );

    await waitFor(() => {
      expect(onSelectedSlotsChange).toHaveBeenCalledWith([sundaySlot]);
    });
  });
});

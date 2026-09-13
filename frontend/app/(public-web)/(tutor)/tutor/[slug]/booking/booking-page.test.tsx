import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { createBooking } = vi.hoisted(() => ({
  createBooking: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useParams: () => ({ slug: "tutor-2" }),
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
  useSearchParams: () => ({
    get: (key: string) => (key === "startDate" ? "2026-09-06" : null),
  }),
}));

vi.mock("@/server/_actions/auth-action", () => ({
  useGetMe: () => ({ data: {}, isLoading: false }),
}));

vi.mock("@/server/_actions/tutor-action", () => ({
  useGetTutorDetail: () => ({ data: { fullName: "Tutor Test" }, isLoading: false }),
  useGetTutorSubjects: () => ({
    data: [{ id: 3, subjectId: 3, gradeLevel: 5 }],
    isLoading: false,
  }),
}));

vi.mock("@/server/_actions/student-action", () => ({
  useGetMyStudents: () => ({ data: [{ id: 4 }], isLoading: false }),
}));

vi.mock("@/server/_actions/booking-action", () => ({
  useCreateBooking: () => ({ mutateAsync: createBooking }),
}));

vi.mock("./_sections/booking-stepper", () => ({
  BookingStepper: ({ currentStep }: { currentStep: number }) => (
    <p>Current booking step: {currentStep}</p>
  ),
}));

vi.mock("./_sections/step-1-child-subject", () => ({
  Step1ChildSubject: ({
    onChildSelect,
    onSubjectSelect,
    onNext,
  }: {
    onChildSelect: (id: string) => void;
    onSubjectSelect: (id: string) => void;
    onNext: () => void;
  }) => (
    <button
      type="button"
      onClick={() => {
        onChildSelect("4");
        onSubjectSelect("3");
        onNext();
      }}
    >
      Complete learner details
    </button>
  ),
}));

vi.mock("./_sections/step-2-schedule", () => ({
  Step2Schedule: ({
    onSlotToggle,
    onNext,
    scheduleError,
  }: {
    onSlotToggle: (slot: { day: number; slot: string; time: string }) => void;
    onNext: () => void;
    scheduleError?: string;
  }) => (
    <section aria-label="Schedule step">
      {scheduleError && <p role="alert">{scheduleError}</p>}
      <button
        type="button"
        onClick={() => {
          onSlotToggle({
            day: 1,
            slot: "08:00",
            time: "08:00 - 10:00",
          });
          onNext();
        }}
      >
        Choose Monday and continue
      </button>
    </section>
  ),
}));

vi.mock("./_sections/step-3-learning-mode", () => ({
  Step3LearningMode: ({ onNext }: { onNext: () => void }) => (
    <button type="button" onClick={onNext}>
      Continue to confirmation
    </button>
  ),
}));

vi.mock("./_sections/step-4-confirmation", () => ({
  Step4Confirmation: ({ onConfirm }: { onConfirm: () => void }) => (
    <button type="button" onClick={onConfirm}>
      Confirm booking
    </button>
  ),
}));

import BookingPage from "./page";

describe("BookingPage", () => {
  beforeEach(() => {
    createBooking.mockReset();
  });

  it("returns a Sunday booking with a Monday slot to step 2 without creating it", async () => {
    const user = userEvent.setup();
    render(<BookingPage />);

    await user.click(screen.getByRole("button", { name: "Complete learner details" }));
    await user.click(screen.getByRole("button", { name: "Choose Monday and continue" }));
    await user.click(screen.getByRole("button", { name: "Continue to confirmation" }));
    await user.click(screen.getByRole("button", { name: "Confirm booking" }));

    expect(await screen.findByText("Current booking step: 2")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Ngày học không khớp với lịch đã chọn",
    );
    expect(createBooking).not.toHaveBeenCalled();
  });
});

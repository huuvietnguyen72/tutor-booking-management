import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { MyApplications } from "./my-applications";

const state = vi.hoisted(() => ({
  applications: [] as Record<string, unknown>[],
  isWithdrawing: false,
  withdraw: vi.fn(),
}));

vi.mock("@/server/_actions/request-action", () => ({
  useGetMyApplications: () => ({
    data: state.applications,
    isLoading: false,
  }),
  useWithdrawApplication: () => ({
    mutate: state.withdraw,
    isPending: state.isWithdrawing,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    loading: vi.fn(() => "withdraw-toast"),
    success: vi.fn(),
  },
}));

const application = {
  id: 1,
  requestId: 2,
  parentId: 3,
  parentName: "Nguyễn Minh Anh",
  subjectId: 4,
  subjectName: "Toán học",
  gradeLevel: 7,
  tutorId: 5,
  tutorName: "Nguyễn Văn Bình",
  proposedPrice: 250_000,
  coverLetter: "Tôi có kinh nghiệm dạy Toán lớp 7.",
  status: "PENDING",
  respondedAt: null,
  createdAt: "2026-09-14T00:00:00",
};

describe("MyApplications", () => {
  beforeEach(() => {
    state.applications = [application];
    state.isWithdrawing = false;
    state.withdraw.mockReset();
  });

  test("renders the flat application response and withdraws by application ID", async () => {
    const user = userEvent.setup();

    render(<MyApplications />);

    expect(screen.getByRole("heading", { name: "Toán học" })).toBeInTheDocument();
    expect(screen.getByText("Phụ huynh: Nguyễn Minh Anh")).toBeInTheDocument();
    expect(screen.getByText("14/9/2026")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Rút hồ sơ" }));
    await user.click(screen.getByRole("button", { name: "Xác nhận rút" }));

    expect(state.withdraw).toHaveBeenCalledWith(1, expect.any(Object));
  });

  test("disables withdrawal confirmation while the mutation is pending", async () => {
    const user = userEvent.setup();
    state.isWithdrawing = true;

    render(<MyApplications />);

    await user.click(screen.getByRole("button", { name: "Rút hồ sơ" }));

    expect(screen.getByRole("button", { name: "Đang rút..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Quay lại" })).toBeDisabled();
  });
});

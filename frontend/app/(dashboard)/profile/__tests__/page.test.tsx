import { fireEvent, render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes, PropsWithChildren } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  refetchTutorProfile: vi.fn(),
  useGetMe: vi.fn(),
  useGetTutorProfile: vi.fn(),
  useUpdateAvatar: vi.fn(),
  useUpdateProfile: vi.fn(),
}));

vi.mock("@/server/_actions/auth-action", () => ({
  useGetMe: mocks.useGetMe,
  useUpdateAvatar: mocks.useUpdateAvatar,
  useUpdateProfile: mocks.useUpdateProfile,
}));

vi.mock("@/server/_actions/tutor-action", () => ({
  useGetTutorProfile: mocks.useGetTutorProfile,
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

import ProfilePage from "../page";

describe("ProfilePage", () => {
  beforeEach(() => {
    mocks.refetchTutorProfile.mockReset();
    mocks.useGetMe.mockReturnValue({
      data: {
        avatarUrl: "",
        email: "tutor@test.local",
        fullName: "Tutor Test",
        id: 1,
        isActive: true,
        phone: "0123456789",
        role: "TUTOR",
      },
      isLoading: false,
    });
    mocks.useGetTutorProfile.mockReturnValue({
      data: undefined,
      isError: true,
      isLoading: false,
      refetch: mocks.refetchTutorProfile,
    });
    mocks.useUpdateAvatar.mockReturnValue({ isPending: false, mutate: vi.fn() });
    mocks.useUpdateProfile.mockReturnValue({ isPending: false, mutate: vi.fn() });
  });

  test("shows a retryable profile-status error instead of rejected status", () => {
    render(<ProfilePage />);

    expect(screen.getByRole("alert")).toHaveTextContent("Không thể tải trạng thái hồ sơ");
    expect(screen.queryByText("Cần Cập Nhật Hồ Sơ")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Thử lại" }));

    expect(mocks.refetchTutorProfile).toHaveBeenCalledOnce();
  });
});

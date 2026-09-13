import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { ProfileStatus } from "../profile-status";

describe("ProfileStatus", () => {
  test("shows a retryable profile error before unrelated loading", () => {
    const onRetry = vi.fn();

    render(<ProfileStatus isError isLoading onRetry={onRetry} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Không thể tải trạng thái hồ sơ");

    fireEvent.click(screen.getByRole("button", { name: "Thử lại" }));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});

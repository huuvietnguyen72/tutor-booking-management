import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { ConfirmDialog } from "./confirm-dialog";

test("closes immediately after confirmation when pending state is not controlled", async () => {
  const user = userEvent.setup();
  const onConfirm = vi.fn();
  const onClose = vi.fn();

  render(
    <ConfirmDialog
      isOpen
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xóa mục này?"
      description="Không thể hoàn tác."
      confirmText="Xóa"
    />,
  );

  await user.click(screen.getByRole("button", { name: "Xóa" }));

  expect(onConfirm).toHaveBeenCalledTimes(1);
  expect(onClose).toHaveBeenCalledTimes(1);
});

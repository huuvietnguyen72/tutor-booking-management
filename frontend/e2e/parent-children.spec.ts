import { expect, test } from "@playwright/test";
import { login } from "./support/auth";

test("seeded parent can view children with normalized academic levels", async ({ page }) => {
  await login(page, "parent.one@test.local", "Test@123");
  await page.goto("/dashboard/parent/children");

  await expect(page.getByText("Nguyễn Gia Bảo")).toBeVisible();
  await expect(page.getByText("Nguyễn Minh Khang")).toBeVisible();
  await expect(page.getByText("GOOD", { exact: true })).toBeVisible();
});

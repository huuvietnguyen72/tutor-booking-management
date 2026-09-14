import { expect, test } from "@playwright/test";
import { login } from "./support/auth";
import { restoreTestSeed } from "./support/seed";

test.afterAll(async () => {
  await restoreTestSeed();
});

test("tutor withdraws the seeded pending application by its application ID", async ({ page }) => {
  await login(page, "tutor.offline@test.local", "Test@123");
  await page.goto("/dashboard/tutor/marketplace");
  await page.getByRole("tab", { name: "Ứng tuyển của tôi" }).click();

  const pendingApplication = page
    .getByRole("heading", { name: "Tiếng Anh" })
    .locator("xpath=ancestor::div[contains(@class, 'group relative')][1]");
  await expect(pendingApplication.getByText(/Phụ huynh: Nguyễn Minh Anh/)).toBeVisible();
  await expect(pendingApplication.getByText(/\d{1,2}\/\d{1,2}\/\d{4}/)).toBeVisible();

  await pendingApplication.getByRole("button", { name: "Rút hồ sơ" }).click();
  const withdraw = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/tutor-requests/applications/1/withdraw") &&
      response.request().method() === "DELETE",
  );
  await page.getByRole("button", { name: "Xác nhận rút" }).click();
  expect((await withdraw).ok()).toBeTruthy();

  await expect(page.getByRole("button", { name: "Rút hồ sơ" })).toHaveCount(0);
});

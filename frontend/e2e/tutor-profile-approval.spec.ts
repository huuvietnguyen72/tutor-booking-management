import { expect, test } from "@playwright/test";
import { login } from "./support/auth";
import { restoreTestSeed } from "./support/seed";

test.afterAll(async () => {
  await restoreTestSeed();
});

test("rejected tutor updates qualifications once and dashboard becomes pending", async ({ page }) => {
  await login(page, "tutor.rejected@test.local", "Test@123");
  await expect(page).toHaveURL(/dashboard\/tutor\/overview/);
  await expect(page.getByText("Hồ sơ cần được hoàn thiện lại")).toBeVisible();

  await page.goto("/dashboard/tutor/profile");
  await page.getByLabel("Bằng cấp & Chứng chỉ").fill("Chứng chỉ đã bổ sung rõ ràng");
  const update = page.waitForResponse((response) =>
    response.url().endsWith("/api/tutors/my-profile") && response.request().method() === "PUT",
  );
  await page.getByRole("button", { name: "Cập nhật hồ sơ chuyên môn" }).click();
  expect((await update).status()).toBe(200);

  await page.goto("/dashboard/tutor/overview");
  await expect(page.getByText("Hồ sơ đang xét duyệt")).toBeVisible();
  await expect(page.getByText("Cần cập nhật hồ sơ")).not.toBeVisible();
});

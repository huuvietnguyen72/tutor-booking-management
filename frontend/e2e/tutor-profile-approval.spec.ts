import { expect, test } from "@playwright/test";

test("rejected tutor updates qualifications once and dashboard becomes pending", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("username@email.com").fill("tutor.rejected@test.local");
  await page.getByPlaceholder("********").fill("Test@123");
  await page.getByRole("button", { name: "Đăng nhập" }).click();
  await expect(page).toHaveURL(/dashboard\/tutor\/overview/);
  await expect(page.getByText("Cần bổ sung bản scan bằng cấp rõ ràng.")).toBeVisible();

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

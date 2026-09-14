import { expect, test, type Page } from "@playwright/test";
import { login } from "./support/auth";
import { restoreTestSeed } from "./support/seed";

const bookingUrl = "/tutor/tutor-1/booking?subjectId=1&startDate=2026-09-06";

async function startSeededBooking(page: Page): Promise<void> {
  await page.goto(bookingUrl);
  await page.getByRole("button", { name: /Nguyễn Gia Bảo/ }).click();
  await page.getByRole("button", { name: "TIẾP TỤC" }).click();
}

test.afterAll(async () => {
  await restoreTestSeed();
});

test("Sunday one-time booking cannot retain a Monday slot or post a booking", async ({ page }) => {
  let bookingPosts = 0;
  page.on("request", (request) => {
    if (request.url().endsWith("/api/bookings") && request.method() === "POST") {
      bookingPosts += 1;
    }
  });

  await login(page, "parent.one@test.local", "Test@123");
  await startSeededBooking(page);

  await expect(page.getByText("Ngày bạn chọn là Chủ Nhật.")).toBeVisible();
  await expect(page.getByText("CÓ SẴN", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "TIẾP TỤC" })).toBeDisabled();
  expect(bookingPosts).toBe(0);
});

test("recurring Monday booking creates five sessions and displays course progress", async ({ page }) => {
  await login(page, "parent.one@test.local", "Test@123");
  await startSeededBooking(page);

  await page.getByRole("tab", { name: "Học lâu dài" }).click();
  await page.getByRole("button", { name: /\/10\/2026$/ }).click();
  await page.getByRole("button", { name: "6", exact: true }).click();
  await expect(page.getByRole("button", { name: "06/10/2026" })).toBeVisible();

  await page.getByText("CÓ SẴN", { exact: true }).click();
  await page.getByRole("button", { name: "TIẾP TỤC" }).click();
  await page.getByRole("button", { name: "TIẾP TỤC" }).click();

  await expect(page.getByText("Thứ 2", { exact: true })).toBeVisible();
  await expect(page.getByText("5 buổi", { exact: true })).toBeVisible();
  await expect(page.getByText("1.000.000đ", { exact: true })).toBeVisible();

  const createdBooking = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/bookings") && response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "XÁC NHẬN ĐẶT LỊCH" }).click();
  const createdBookingResponse = await createdBooking;
  expect(createdBookingResponse.ok()).toBeTruthy();
  const createdBookingBody = (await createdBookingResponse.json()) as { data: { id: number } };

  await expect(page.getByRole("heading", { name: "Đặt lịch thành công!" })).toBeVisible();

  await login(page, "tutor.online@test.local", "Test@123");
  await page.goto("/dashboard/tutor/marketplace");
  const invitation = page
    .locator("[class*='group relative overflow-hidden']")
    .filter({ hasText: "Thứ 2: 08:00-10:00" });
  const acceptBooking = page.waitForResponse(
    (response) =>
      response.url().endsWith(`/api/bookings/${createdBookingBody.data.id}/accept`) &&
      response.request().method() === "PUT",
  );
  await invitation.getByRole("button", { name: "Chấp nhận" }).click();
  expect((await acceptBooking).ok()).toBeTruthy();

  await login(page, "parent.one@test.local", "Test@123");
  await page.goto("/dashboard/parent/courses");
  const progress = page.getByText("0/5 Buổi", { exact: true });
  await expect(progress).toBeVisible();
  await progress.click();
  await expect(page.getByText("Thứ 2 • 08:00 - 10:00", { exact: true })).toBeVisible();
  await expect(page.getByText("Chi tiết 5 buổi học")).toBeVisible();
});

test("completed booking accepts one review and removes the review CTA", async ({ page }) => {
  let reviewPosts = 0;
  page.on("request", (request) => {
    if (request.url().endsWith("/api/reviews") && request.method() === "POST") {
      reviewPosts += 1;
    }
  });

  await login(page, "parent.one@test.local", "Test@123");
  await page.goto("/dashboard/parent/courses");
  await page.getByRole("button", { name: "Đánh giá" }).click();

  const reviewDialog = page.getByRole("dialog");
  await reviewDialog.locator("button").nth(4).click();
  const submitReview = page.waitForResponse(
    (response) => response.url().endsWith("/api/reviews") && response.request().method() === "POST",
  );
  await reviewDialog.getByRole("button", { name: "Gửi đánh giá" }).click();
  expect((await submitReview).ok()).toBeTruthy();

  await expect(page.getByRole("button", { name: "Đánh giá" })).toHaveCount(0);
  expect(reviewPosts).toBe(1);
});

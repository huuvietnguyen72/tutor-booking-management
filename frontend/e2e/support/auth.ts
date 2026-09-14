import { expect, type Page } from "@playwright/test";

export async function login(page: Page, email: string, password: string): Promise<void> {
  await page.context().clearCookies();
  await page.goto("/login");
  await page.getByPlaceholder("username@email.com").fill(email);
  await page.getByPlaceholder("********").fill(password);
  const loginResponse = page.waitForResponse(
    (response) => response.url().endsWith("/api/auth/login") && response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Đăng nhập" }).click();
  expect((await loginResponse).status()).toBe(200);
  await page.waitForURL(/\/dashboard\//);
}

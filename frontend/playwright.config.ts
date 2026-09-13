import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { outputFolder: "../artifacts/playwright-report" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: [
    {
      command: "npm run dev:backend",
      cwd: "..",
      url: "http://localhost:8080/swagger-ui/index.html",
      env: { ...process.env, SPRING_PROFILES_ACTIVE: "local" },
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "npm run dev:frontend",
      cwd: "..",
      url: "http://localhost:3000/login",
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});

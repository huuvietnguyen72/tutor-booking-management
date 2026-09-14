import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { outputFolder: "../artifacts/playwright-report" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"],
    channel: "chrome",
  },
  webServer: [
    {
      command: "npm run dev:backend",
      cwd: "..",
      url: "http://localhost:8080/swagger-ui/index.html",
      // The local E2E paths do not invoke chat, but Spring requires a non-empty key to construct its chat client.
      env: {
        ...process.env,
        SPRING_PROFILES_ACTIVE: "local",
        SPRING_AI_OPENAI_API_KEY: "test-placeholder",
      },
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "npm run dev:frontend",
      cwd: "..",
      url: "http://localhost:3000/login",
      env: { ...process.env, NEXT_PUBLIC_API_URL: "http://localhost:8080/api" },
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});

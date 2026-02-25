import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:9000",
    trace: "on-first-retry",
    headless: !!process.env.CI
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command:
      "pnpm run build && pnpm exec vite --config e2e/app/vite.config.ts --port 9000 --mode e2e",
    url: "http://localhost:9000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      VITE_NAVER_MAP_CLIENT_ID: env?.VITE_NAVER_MAP_CLIENT_ID || ""
    }
  }
});

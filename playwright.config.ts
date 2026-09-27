import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 180_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  outputDir: process.env.E2E_OUTPUT_DIR || "/tmp/present-e2e-results",
  reporter: [["list"]],
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3001",
    browserName: "chromium",
    viewport: { width: 1440, height: 900 },
    actionTimeout: 20_000,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    launchOptions: {
      executablePath: process.env.E2E_CHROMIUM_PATH,
      args: ["--enable-unsafe-swiftshader"],
    },
  },
});

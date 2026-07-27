import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  fullyParallel: false,
  retries: 0,
  reporter: 'list',

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05,
    },
  },

  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
  },

  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'chromium-mobile',
      use: {
        ...devices['iPhone 15'],
        viewport: { width: 390, height: 844 },
      },
    },
  ],
});

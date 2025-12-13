import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'tests/reports/playwright-report' }],
    ['json', { outputFile: 'tests/reports/playwright-results.json' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.CI
      ? 'http://localhost:4173/learn_comptia_network_plus'
      : 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro'] },
    },
  ],
  webServer: {
    command: process.env.CI ? 'npm run preview -- --port 4173' : 'npm run dev',
    url: process.env.CI
      ? 'http://localhost:4173/learn_comptia_network_plus/'
      : 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
});

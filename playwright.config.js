// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Ensure BASE_URL is defined
if (!process.env.BASE_URL) {
  throw new Error('BASE_URL is not defined in .env');
}

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],

  

  use: {
   
    baseURL: process.env.BASE_URL,   // Base URL from .env
    headless: true,                  // Set true for CI
    actionTimeout: 15000,             // default action timeout
    navigationTimeout: 30000,         // max page.goto timeout
    trace: 'on-first-retry',          // trace for debugging failures
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    // video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});

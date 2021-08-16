import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
  timeout: 60000,
  globalTimeout: 600000,
  use: {
    headless: false,
    ignoreHTTPSErrors: true,
    browserName: 'chromium',
  },
};
export default config;
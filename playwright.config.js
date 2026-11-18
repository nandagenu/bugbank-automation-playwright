// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Configuração central do projeto.
 * - "trace", "screenshot" e "video" ficam em "retain-on-failure": isso é o que,
 *   na prática, gera as EVIDÊNCIAS automáticas de um teste que falhou
 *   (prints, vídeo da execução e trace navegável passo a passo),
 *   que depois podem ser anexadas a um bug no Jira/Xray.
 */
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
    ['junit', { outputFile: 'results/junit.xml' }],
  ],
  use: {
    // Site sob teste. Pode ser trocado sem mexer no código: BASE_URL=http://localhost:3000 npm test
    baseURL: process.env.BASE_URL || 'https://bugbank.netlify.app',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'web-chromium',
      testMatch: /web\/.*\.spec\.js/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-web',
      testMatch: /mobile\/.*\.spec\.js/,
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'api',
      testMatch: /api\/.*\.spec\.js/,
    },
  ],
});

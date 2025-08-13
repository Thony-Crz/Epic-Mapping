import { defineConfig } from '@playwright/test';

/**
 * Configuration spécifique pour les tests d'accessibilité
 * Respecte les standards WCAG 2.1 AA
 */
export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		timeout: 120 * 1000,
		reuseExistingServer: !process.env.CI
	},
	testDir: '../accessibility',
	timeout: 60 * 1000,
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [
		['html', { outputFolder: 'accessibility-report' }],
		['json', { outputFile: 'accessibility-results.json' }],
		['list']
	],
	use: {
		baseURL: 'http://localhost:4173',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure'
	},
	projects: [
		{
			name: 'accessibility-chromium',
			use: { browserName: 'chromium' }
		},
		{
			name: 'accessibility-firefox',
			use: { browserName: 'firefox' }
		},
		{
			name: 'accessibility-webkit',
			use: { browserName: 'webkit' }
		}
	]
});

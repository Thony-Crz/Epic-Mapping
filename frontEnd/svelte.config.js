import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

const isDev = process.argv.includes('dev');
// Nom du repo pour Pages de type "Project": https://USERNAME.github.io/REPO
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Configuration SPA pour GitHub Pages
		adapter: adapter({
			fallback: 'index.html' // SPA fallback
		}),
		// IMPORTANT: base vide pour site user/org, sinon "/REPO" pour project pages
		paths: {
			base: isDev ? '' : repo ? `/${repo}` : ''
			// si ton site est https://USERNAME.github.io/REPO => base = "/REPO"
			// si ton site est https://USERNAME.github.io        => base = ""
		},
		// Tout est statique (SPA mode - pas de prerender avec fallback)
		// prerender: { entries: ['*'] },
		alias: {
			$ui: path.resolve('./src/ui')
		}
	}
};

export default config;

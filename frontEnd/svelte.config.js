import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

// Détection de l'environnement
const isDev = process.argv.includes('dev') || process.argv.includes('preview');
const isGitHubActions = !!process.env.GITHUB_REPOSITORY;

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
		// IMPORTANT: base vide pour dev/preview local, sinon "/REPO" pour GitHub Pages
		paths: {
			base: isDev ? '' : (isGitHubActions && repo) ? `/${repo}` : ''
			// si ton site est https://USERNAME.github.io/REPO => base = "/REPO"
			// si ton site est https://USERNAME.github.io        => base = ""
			// en local (dev/preview) => base = ""
		},
		// Tout est statique (SPA mode - pas de prerender avec fallback)
		// prerender: { entries: ['*'] },
		alias: {
			$ui: path.resolve('./src/ui')
		}
	}
};

export default config;

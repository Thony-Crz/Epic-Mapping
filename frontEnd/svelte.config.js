import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

const dev = process.argv.includes('dev');
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-static pour GitHub Pages
		adapter: adapter({
			fallback: 'index.html' // Mode SPA pour GitHub Pages
		}),
		paths: {
			base: dev || !repoName ? '' : `/${repoName}`
		},
		alias: {
			$ui: path.resolve('./src/ui')
		}
	}
};

export default config;

import adapterStatic from '@sveltejs/adapter-static';
import adapterVercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

// Détection de l'environnement
const isDev = process.argv.includes('dev') || process.argv.includes('preview');
const isGitHubActions = !!process.env.GITHUB_REPOSITORY;
const isVercel = !!process.env.VERCEL;

// Nom du repo pour Pages de type "Project": https://USERNAME.github.io/REPO
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';

// Sélection de l'adapter selon l'environnement
// - Vercel: utilise adapter-vercel pour SSR/Edge functions
// - GitHub Pages: utilise adapter-static pour SPA
const adapter = isVercel
	? adapterVercel({
			runtime: 'nodejs22.x'
		})
	: adapterStatic({
			fallback: 'index.html' // SPA fallback pour GitHub Pages
		});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter,
		// IMPORTANT: base vide pour dev/preview local et Vercel, sinon "/REPO" pour GitHub Pages
		paths: {
			base: isDev || isVercel ? '' : (isGitHubActions && repo) ? `/${repo}` : ''
			// si ton site est https://USERNAME.github.io/REPO => base = "/REPO"
			// si ton site est https://USERNAME.github.io        => base = ""
			// en local (dev/preview) ou Vercel => base = ""
		},
		// Tout est statique (SPA mode - pas de prerender avec fallback)
		// prerender: { entries: ['*'] },
		alias: {
			$ui: path.resolve('./src/ui')
		}
	}
};

export default config;

import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('should render h1', async () => {
		render(Page);

		const heading = page.getByRole('heading', { level: 1 });
		await expect.element(heading).toBeInTheDocument();
	});

	it('should hide export button when epic-export feature flag is disabled by default', async () => {
		render(Page);

		// Le bouton d'export ne devrait pas être visible quand le feature flag est désactivé par défaut
		const exportButton = page.getByRole('button', { name: /exporter épics ready/i });
		await expect.element(exportButton).not.toBeInTheDocument();
	});

	it('should respect feature flag configuration from JSON file', async () => {
		render(Page);

		// Puisque le feature flag est désactivé par défaut dans feature-flags.json,
		// le bouton d'export ne devrait pas être présent même s'il y a des épics ready
		const exportButton = page.getByRole('button', { name: /exporter épics ready/i });
		await expect.element(exportButton).not.toBeInTheDocument();
	});

	it('should have proper project initialization with test data', async () => {
		render(Page);

		// Vérifier que l'application se charge correctement avec des projets de test
		const projectSelects = page.getByRole('combobox');
		await expect.element(projectSelects.first()).toBeInTheDocument();

		// Vérifier que des projets par défaut sont créés
		const projectOptions = page.getByRole('option');
		await expect.element(projectOptions.first()).toBeInTheDocument();
	});
});

import { page } from '@vitest/browser/context';
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import FeatureFlagsManager from './FeatureFlagsManager.svelte';

describe('FeatureFlagsManager', () => {
	it('should render the feature flags manager title', async () => {
		render(FeatureFlagsManager);
		const heading = page.getByText('Gestion des fonctionnalités');
		await expect.element(heading).toBeInTheDocument();
	});

	it('should show feature flags when loaded from configuration', async () => {
		render(FeatureFlagsManager);
		
		// Le composant devrait charger automatiquement les feature flags depuis la configuration
		const epicExportFlag = page.getByText('epic-export');
		await expect.element(epicExportFlag).toBeInTheDocument();
	});

	it('should display feature flags when they exist', async () => {
		const initialFlags = [
			{
				name: 'test-feature',
				description: 'Feature de test',
				enabled: true
			},
			{
				name: 'beta-feature',
				description: 'Feature en beta',
				enabled: false
			}
		];
		
		render(FeatureFlagsManager, { initialFlags });
		
		const testFeature = page.getByText('test-feature');
		const betaFeature = page.getByText('beta-feature');
		
		await expect.element(testFeature).toBeInTheDocument();
		await expect.element(betaFeature).toBeInTheDocument();
	});

	it('should show correct status for feature flags', async () => {
		const initialFlags = [
			{
				name: 'enabled-feature',
				description: 'Feature activée',
				enabled: true
			},
			{
				name: 'disabled-feature',
				description: 'Feature désactivée',
				enabled: false
			}
		];
		
		render(FeatureFlagsManager, { initialFlags });
		
		// Vérifier les statuts affichés
		const enabledStatus = page.getByText('✅ Activé');
		const disabledStatus = page.getByText('❌ Désactivé');
		
		await expect.element(enabledStatus).toBeInTheDocument();
		await expect.element(disabledStatus).toBeInTheDocument();
	});
});

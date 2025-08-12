import { writable } from 'svelte/store';
import type { FeatureFlag } from './FeatureFlag';
import { FeatureFlagService } from './FeatureFlagService';

// Instance globale du service
const featureFlagService = new FeatureFlagService();

// Store réactif pour les feature flags
export const featureFlagsStore = writable<FeatureFlag[]>([]);

// Fonction d'initialisation
export function initializeFeatureFlags() {
	featureFlagService.loadFromConfig();
	featureFlagsStore.set(featureFlagService.getAllFlags());
	return featureFlagService;
}

// Fonctions utilitaires pour interagir avec les feature flags
export function toggleFeatureFlag(flagName: string) {
	const flags = featureFlagService.getAllFlags();
	const flag = flags.find(f => f.name === flagName);
	
	if (flag) {
		if (flag.enabled) {
			featureFlagService.disable(flagName);
		} else {
			featureFlagService.enable(flagName);
		}
		// Mettre à jour le store
		featureFlagsStore.set(featureFlagService.getAllFlags());
	}
}

export function isFeatureEnabled(flagName: string): boolean {
	return featureFlagService.isEnabled(flagName);
}

export function resetFeatureFlagsToDefaults() {
	featureFlagService.resetToDefaults();
	featureFlagsStore.set(featureFlagService.getAllFlags());
}

export { featureFlagService };

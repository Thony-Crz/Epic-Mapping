import type { FeatureFlag } from './FeatureFlag';
import featureFlagsConfig from './feature-flags.json';

export class FeatureFlagService {
	private flags: Map<string, FeatureFlag> = new Map();
	private readonly STORAGE_KEY = 'feature-flags-overrides';

	constructor() {
		// Implementation minimale pour faire passer le test
	}

	isEnabled(flagName: string): boolean {
		const flag = this.flags.get(flagName);
		return flag ? flag.enabled : false;
	}

	enable(flagName: string): void {
		const flag = this.flags.get(flagName);
		if (flag) {
			flag.enabled = true;
			this.persistFlags();
		}
	}

	disable(flagName: string): void {
		const flag = this.flags.get(flagName);
		if (flag) {
			flag.enabled = false;
			this.persistFlags();
		}
	}

	getAllFlags(): FeatureFlag[] {
		return Array.from(this.flags.values());
	}

	registerFlag(flag: FeatureFlag): void {
		this.flags.set(flag.name, { ...flag });
	}

	loadFromConfig(): void {
		// Charger les flags depuis le fichier JSON par défaut
		const features = featureFlagsConfig.features;
		Object.values(features).forEach((feature) => {
			this.registerFlag(feature as FeatureFlag);
		});

		// Appliquer les overrides depuis le localStorage s'ils existent
		this.loadPersistedOverrides();
	}

	private loadPersistedOverrides(): void {
		if (typeof window === 'undefined') return; // Skip en SSR
		
		try {
			const stored = localStorage.getItem(this.STORAGE_KEY);
			if (stored) {
				const overrides = JSON.parse(stored);
				Object.entries(overrides).forEach(([flagName, enabled]) => {
					const flag = this.flags.get(flagName);
					if (flag) {
						flag.enabled = enabled as boolean;
					}
				});
			}
		} catch (error) {
			console.warn('Erreur lors du chargement des feature flags depuis localStorage:', error);
		}
	}

	private persistFlags(): void {
		if (typeof window === 'undefined') return; // Skip en SSR
		
		try {
			const overrides: Record<string, boolean> = {};
			this.flags.forEach((flag, name) => {
				// Ne persister que si différent de la valeur par défaut du JSON
				const defaultFlag = featureFlagsConfig.features[name as keyof typeof featureFlagsConfig.features];
				if (defaultFlag && flag.enabled !== defaultFlag.enabled) {
					overrides[name] = flag.enabled;
				}
			});

			if (Object.keys(overrides).length > 0) {
				localStorage.setItem(this.STORAGE_KEY, JSON.stringify(overrides));
			} else {
				localStorage.removeItem(this.STORAGE_KEY);
			}
		} catch (error) {
			console.warn('Erreur lors de la sauvegarde des feature flags:', error);
		}
	}

	// Méthode pour réinitialiser tous les flags aux valeurs par défaut
	resetToDefaults(): void {
		if (typeof window !== 'undefined') {
			localStorage.removeItem(this.STORAGE_KEY);
		}
		this.loadFromConfig();
	}
}

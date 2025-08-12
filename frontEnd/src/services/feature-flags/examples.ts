/**
 * 📚 Exemples d'utilisation des Feature Flags
 * 
 * Ce fichier présente différentes façons d'utiliser le système de feature flags
 * dans l'application Epic Mapping.
 */

import { isFeatureEnabled, featureFlagsStore, toggleFeatureFlag } from './featureFlagsStore.js';
import { FeatureFlagService } from './FeatureFlagService.js';

// ==========================================
// 🎯 EXEMPLE 1: Utilisation basique dans un composant
// ==========================================

/*
<script lang="ts">
  import { isFeatureEnabled } from '../services/feature-flags/featureFlagsStore.js';
  
  // Vérification réactive simple
  $: exportEnabled = isFeatureEnabled('epic-export');
  
  function handleExport() {
    if (!exportEnabled) {
      alert('Fonctionnalité désactivée');
      return;
    }
    // Logique d'export...
  }
</script>

{#if $exportEnabled}
  <button on:click={handleExport} class="export-btn">
    Exporter l'Epic
  </button>
{:else}
  <p class="text-gray-500">Export désactivé</p>
{/if}
*/

// ==========================================
// 🎯 EXEMPLE 2: Utilisation avec le store complet
// ==========================================

/*
<script lang="ts">
  import { featureFlagsStore } from '../services/feature-flags/featureFlagsStore.js';
  
  // Accès à tous les flags
  $: flags = $featureFlagsStore;
  $: exportFlag = flags.find(f => f.name === 'epic-export');
  
  // Logique conditionnelle avancée
  $: canExportPDF = exportFlag?.enabled && exportFlag?.metadata?.formats?.includes('pdf');
</script>

<div class="feature-status">
  {#each $flags as flag}
    <div class="flag-item">
      <span class:enabled={flag.enabled}>{flag.name}</span>
      <span class="status">{flag.enabled ? '✅' : '❌'}</span>
    </div>
  {/each}
</div>
*/

// ==========================================
// 🎯 EXEMPLE 3: Gestion programmatique
// ==========================================

export class FeatureFlagExample {
  private featureFlagService: FeatureFlagService;

  constructor() {
    this.featureFlagService = new FeatureFlagService();
    this.featureFlagService.loadFromConfig();
  }

  /**
   * Exemple : Activer une fonctionnalité pour des tests
   */
  async enableFeatureForTesting(featureName: string): Promise<void> {
    try {
      await toggleFeatureFlag(featureName);
      console.log(`✅ Feature '${featureName}' activée pour les tests`);
    } catch (error) {
      console.error(`❌ Erreur lors de l'activation de '${featureName}':`, error);
    }
  }

  /**
   * Exemple : Vérifier plusieurs flags pour une fonctionnalité complexe
   */
  canAccessAdvancedExport(): boolean {
    const hasExportAccess = this.featureFlagService.isEnabled('epic-export');
    const hasAdvancedFeatures = this.featureFlagService.isEnabled('advanced-features');
    
    return hasExportAccess && hasAdvancedFeatures;
  }

  /**
   * Exemple : Migration progressive d'une fonctionnalité
   */
  getExportComponent(): string {
    if (this.featureFlagService.isEnabled('export-v2')) {
      return 'NewExportComponent';
    }
    return 'LegacyExportComponent';
  }
}

// ==========================================
// 🎯 EXEMPLE 4: Hook personnalisé (pattern avancé)
// ==========================================

/**
 * Hook personnalisé pour gérer un groupe de feature flags
 */
export function createFeatureFlagHook(flagNames: string[]) {
  const flags: Record<string, boolean> = {};
  
  // Initialiser les flags
  flagNames.forEach(name => {
    flags[name] = isFeatureEnabled(name);
  });

  return {
    flags,
    isAllEnabled: () => Object.values(flags).every(Boolean),
    isAnyEnabled: () => Object.values(flags).some(Boolean),
    enabledCount: () => Object.values(flags).filter(Boolean).length
  };
}

// Utilisation du hook
/*
<script lang="ts">
  import { createFeatureFlagHook } from '../utils/featureFlags.js';
  
  const exportFeatures = createFeatureFlagHook(['epic-export', 'bulk-export', 'advanced-export']);
  
  $: canShowExportMenu = exportFeatures.isAnyEnabled();
  $: allExportFeaturesReady = exportFeatures.isAllEnabled();
</script>
*/

// ==========================================
// 🎯 EXEMPLE 5: Conditions complexes avec feature flags
// ==========================================

/*
<script lang="ts">
  import { featureFlagsStore } from '../services/feature-flags/featureFlagsStore.js';
  
  // Logique business complexe basée sur les feature flags
  $: {
    const flags = $featureFlagsStore;
    const exportEnabled = flags.find(f => f.name === 'epic-export')?.enabled;
    const betaFeatures = flags.find(f => f.name === 'beta-features')?.enabled;
    
    // Différents niveaux d'accès
    if (exportEnabled && betaFeatures) {
      showAdvancedExportOptions = true;
      showBasicExportOptions = true;
    } else if (exportEnabled) {
      showAdvancedExportOptions = false;
      showBasicExportOptions = true;
    } else {
      showAdvancedExportOptions = false;
      showBasicExportOptions = false;
    }
  }
</script>

<div class="export-section">
  {#if showBasicExportOptions}
    <BasicExportComponent />
  {/if}
  
  {#if showAdvancedExportOptions}
    <AdvancedExportComponent />
  {/if}
  
  {#if !showBasicExportOptions}
    <div class="feature-disabled">
      <p>La fonctionnalité d'export est actuellement désactivée.</p>
      <a href="/feature-flags">Gérer les feature flags</a>
    </div>
  {/if}
</div>
*/

// ==========================================
// 🎯 EXEMPLE 6: Tests avec feature flags
// ==========================================

/*
// Dans un fichier de test (.test.ts)
import { describe, it, expect, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { FeatureFlagService } from '../FeatureFlagService.js';

describe('Component with Feature Flags', () => {
  let featureFlagService: FeatureFlagService;

  beforeEach(() => {
    featureFlagService = new FeatureFlagService();
    featureFlagService.loadFromConfig();
  });

  it('should show export button when feature is enabled', async () => {
    // Activer le feature flag pour le test
    featureFlagService.setFlag('epic-export', true);
    
    const { component } = render(MyComponent, {
      props: { featureFlagService }
    });

    const exportButton = page.getByRole('button', { name: /export/i });
    await expect.element(exportButton).toBeInTheDocument();
  });

  it('should hide export button when feature is disabled', async () => {
    // Désactiver le feature flag pour le test
    featureFlagService.setFlag('epic-export', false);
    
    const { component } = render(MyComponent, {
      props: { featureFlagService }
    });

    const exportButton = page.queryByRole('button', { name: /export/i });
    expect(exportButton).not.toBeInTheDocument();
  });
});
*/

// ==========================================
// 🎯 EXEMPLE 7: Monitoring et analytics
// ==========================================

export class FeatureFlagAnalytics {
  private usage: Map<string, number> = new Map();

  /**
   * Tracker l'utilisation d'une fonctionnalité
   */
  trackFeatureUsage(featureName: string): void {
    const currentCount = this.usage.get(featureName) || 0;
    this.usage.set(featureName, currentCount + 1);
    
    // Envoyer à un service d'analytics (exemple)
    console.log(`📊 Feature '${featureName}' utilisée ${currentCount + 1} fois`);
  }

  /**
   * Obtenir les statistiques d'utilisation
   */
  getUsageStats(): Record<string, number> {
    return Object.fromEntries(this.usage);
  }

  /**
   * Réinitialiser les statistiques
   */
  resetStats(): void {
    this.usage.clear();
  }
}

// ==========================================
// 🚀 CONSEILS DE BONNES PRATIQUES
// ==========================================

/*
1. 🏷️ NOMMAGE COHÉRENT
   - Utilisez des noms descriptifs : 'epic-export', 'user-dashboard-v2'
   - Évitez les noms génériques : 'feature1', 'temp'

2. 🔒 SÉCURITÉ
   - Ne jamais exposer de feature flags sensibles côté client
   - Utilisez le backend pour les features critiques

3. 🧪 TESTS
   - Testez toujours les deux états (activé/désactivé)
   - Utilisez des mocks pour isoler les tests

4. 🧹 NETTOYAGE
   - Supprimez les flags obsolètes régulièrement
   - Documentez la durée de vie prévue des flags

5. 📊 MONITORING
   - Surveillez l'utilisation des features
   - Mesurez l'impact des changements

6. 🎨 UX
   - Fournissez un feedback clair quand une feature est désactivée
   - Considérez des états intermédiaires (loading, partial)
*/

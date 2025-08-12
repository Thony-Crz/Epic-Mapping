# 📚 API Reference - Feature Flags

Documentation complète de l'API du système de feature flags.

## 🔧 FeatureFlagService

### Constructeur

```typescript
const service = new FeatureFlagService();
```

### Méthodes principales

#### `loadFromConfig(): void`
Charge la configuration depuis `feature-flags.json`.

```typescript
service.loadFromConfig();
```

#### `isEnabled(flagName: string): boolean`
Vérifie si un feature flag est activé.

```typescript
const isActive = service.isEnabled('epic-export');
// Retourne: true | false
```

#### `getAllFlags(): FeatureFlag[]`
Retourne tous les feature flags disponibles.

```typescript
const flags = service.getAllFlags();
// Retourne: FeatureFlag[]
```

#### `setFlag(name: string, enabled: boolean): void`
Définit l'état d'un feature flag.

```typescript
service.setFlag('epic-export', true);
```

#### `persistFlags(): void`
Sauvegarde les overrides dans localStorage.

```typescript
service.persistFlags();
```

#### `loadPersistedOverrides(): Record<string, boolean>`
Charge les overrides depuis localStorage.

```typescript
const overrides = service.loadPersistedOverrides();
// Retourne: { 'epic-export': true, ... }
```

#### `resetToDefaults(): void`
Remet tous les flags à leur valeur par défaut.

```typescript
service.resetToDefaults();
```

---

## 🏪 featureFlagsStore

### Store principal

```typescript
import { featureFlagsStore } from './featureFlagsStore.js';

// Accès réactif
$: flags = $featureFlagsStore;
```

### Fonctions utilitaires

#### `initializeFeatureFlags(): Promise<void>`
Initialise les feature flags depuis la configuration.

```typescript
await initializeFeatureFlags();
```

#### `isFeatureEnabled(flagName: string): boolean`
Fonction helper pour vérifier un flag spécifique.

```typescript
$: exportEnabled = isFeatureEnabled('epic-export');
```

#### `toggleFeatureFlag(flagName: string): Promise<void>`
Bascule l'état d'un feature flag.

```typescript
await toggleFeatureFlag('epic-export');
```

#### `resetFeatureFlagsToDefaults(): Promise<void>`
Remet tous les flags aux valeurs par défaut.

```typescript
await resetFeatureFlagsToDefaults();
```

---

## 📝 Interface FeatureFlag

```typescript
interface FeatureFlag {
  name: string;           // Identifiant unique
  description: string;    // Description human-readable
  enabled: boolean;       // État actuel (défaut + override)
  defaultEnabled: boolean; // Valeur par défaut
}
```

### Exemple d'objet FeatureFlag

```typescript
{
  name: "epic-export",
  description: "Fonctionnalité d'export des epics en PDF/Excel et d'export en Backlog Azure",
  enabled: true,
  defaultEnabled: false
}
```

---

## 🎯 Utilisation dans les composants

### Pattern réactif simple

```svelte
<script lang="ts">
  import { isFeatureEnabled } from '../services/feature-flags/featureFlagsStore.js';
  
  $: showFeature = isFeatureEnabled('feature-name');
</script>

{#if $showFeature}
  <FeatureComponent />
{/if}
```

### Pattern avec store complet

```svelte
<script lang="ts">
  import { featureFlagsStore } from '../services/feature-flags/featureFlagsStore.js';
  
  $: flags = $featureFlagsStore;
  $: targetFlag = flags.find(f => f.name === 'feature-name');
</script>

{#if targetFlag?.enabled}
  <FeatureComponent />
{/if}
```

### Pattern avec gestion d'erreur

```svelte
<script lang="ts">
  import { featureFlagsStore, isFeatureEnabled } from '../services/feature-flags/featureFlagsStore.js';
  
  let featureError = false;
  
  $: {
    try {
      showFeature = isFeatureEnabled('feature-name');
      featureError = false;
    } catch (error) {
      console.warn('Erreur feature flag:', error);
      featureError = true;
      showFeature = false; // Fallback sûr
    }
  }
</script>

{#if featureError}
  <div class="error">Erreur de configuration des fonctionnalités</div>
{:else if showFeature}
  <FeatureComponent />
{/if}
```

---

## 🧪 Utilisation dans les tests

### Test basique

```typescript
import { describe, it, expect } from 'vitest';
import { FeatureFlagService } from './FeatureFlagService.js';

describe('FeatureFlagService', () => {
  it('should return correct flag state', () => {
    const service = new FeatureFlagService();
    service.setFlag('test-flag', true);
    
    expect(service.isEnabled('test-flag')).toBe(true);
  });
});
```

### Test avec localStorage mock

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { FeatureFlagService } from './FeatureFlagService.js';

describe('FeatureFlagService with localStorage', () => {
  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  it('should persist flag changes', () => {
    const service = new FeatureFlagService();
    service.setFlag('test-flag', true);
    service.persistFlags();
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'feature-flags-overrides',
      expect.stringContaining('test-flag')
    );
  });
});
```

---

## ⚠️ Gestion d'erreurs

### Erreurs communes et solutions

#### localStorage non disponible
```typescript
// Le service gère automatiquement ce cas
try {
  service.persistFlags();
} catch (error) {
  console.warn('localStorage non disponible:', error);
  // Continue sans persistence
}
```

#### Configuration JSON malformée
```typescript
// Fallback automatique vers configuration vide
const flags = service.getAllFlags();
// Retourne toujours un tableau, même si la config est corrompue
```

#### Flag inexistant
```typescript
const isEnabled = service.isEnabled('flag-inexistant');
// Retourne: false (sûr par défaut)
```

---

## 🚀 Patterns avancés

### Composition de flags

```typescript
function useComplexFeature() {
  const hasBaseFeature = isFeatureEnabled('base-feature');
  const hasAdvancedFeature = isFeatureEnabled('advanced-feature');
  const hasBetaAccess = isFeatureEnabled('beta-access');
  
  return {
    canUseBasic: hasBaseFeature,
    canUseAdvanced: hasBaseFeature && hasAdvancedFeature,
    canUseBeta: hasBaseFeature && hasAdvancedFeature && hasBetaAccess
  };
}
```

### Migration progressive

```typescript
function getComponentVersion() {
  if (isFeatureEnabled('component-v3')) return 'v3';
  if (isFeatureEnabled('component-v2')) return 'v2';
  return 'v1'; // Fallback
}
```

### Feature flag avec timeout

```typescript
class TimedFeatureFlag {
  constructor(private flagName: string, private timeoutMs: number) {}
  
  async isEnabledWithTimeout(): Promise<boolean> {
    return new Promise((resolve) => {
      const enabled = isFeatureEnabled(this.flagName);
      
      if (enabled) {
        setTimeout(() => resolve(false), this.timeoutMs);
      }
      
      resolve(enabled);
    });
  }
}
```

---

## 📊 Performance

### Optimisations

- **Cache interne** : Les flags sont mis en cache après le premier chargement
- **Lazy loading** : La configuration n'est chargée qu'à la première utilisation
- **Debouncing** : Les écritures localStorage sont automatiquement optimisées

### Monitoring des performances

```typescript
// Mesurer le temps de chargement
console.time('feature-flags-init');
await initializeFeatureFlags();
console.timeEnd('feature-flags-init');

// Compter les accès aux flags
let flagAccessCount = 0;
const originalIsEnabled = service.isEnabled;
service.isEnabled = function(flagName: string) {
  flagAccessCount++;
  return originalIsEnabled.call(this, flagName);
};
```

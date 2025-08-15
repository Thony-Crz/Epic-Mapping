# Feature Flags Service

Ce dossier contient l'implémentation complète du système de feature flags pour Epic Mapping.

## 📁 Structure

```
feature-flags/
├── FeatureFlag.ts           # Interface TypeScript pour les feature flags
├── FeatureFlagService.ts    # Service principal de gestion des flags
├── featureFlagsStore.ts     # Store réactif Svelte
└── feature-flags.json      # Configuration par défaut
```

## 🚀 Usage rapide

```typescript
import { isFeatureEnabled } from './featureFlagsStore.js';

// Dans un composant Svelte
$: showExport = isFeatureEnabled('epic-export');

{#if $showExport}
  <ExportButton />
{/if}
```

## 🔧 API principale

### FeatureFlagService

```typescript
const service = new FeatureFlagService();

// Vérifier un flag
service.isEnabled('epic-export')

// Obtenir tous les flags
service.getAllFlags()

// Définir un flag
service.setFlag('epic-export', true)

// Persister les changements
service.persistFlags()
```

### Store réactif

```typescript
import { featureFlagsStore, toggleFeatureFlag, resetFeatureFlagsToDefaults } from './featureFlagsStore.js';

// Observer les changements
$featureFlagsStore

// Basculer un flag
await toggleFeatureFlag('epic-export')

// Réinitialiser
await resetFeatureFlagsToDefaults()
```

## 💾 Persistence

- **Configuration par défaut** : `feature-flags.json`
- **Overrides utilisateur** : `localStorage['feature-flags-overrides']`
- **Priorité** : localStorage > configuration JSON

## 🧪 Tests

Les tests sont situés dans `FeatureFlagService.test.ts` et couvrent :
- Chargement de la configuration
- Persistence dans localStorage  
- Gestion des erreurs
- API du service

## 📖 Documentation complète

Voir [FEATURE-FLAGS-README.md](../FEATURE-FLAGS-README.md) pour la documentation détaillée.

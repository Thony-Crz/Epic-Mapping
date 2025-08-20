# 🚩 Système de Feature Flags - Frontend

Ce document explique le fonctionnement du système de feature flags implémenté dans l'application Epic Mapping.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Interface utilisateur](#interface-utilisateur)
- [Persistence](#persistence)
- [Tests](#tests)
- [Développement](#développement)

## 🎯 Vue d'ensemble

Le système de feature flags permet d'activer ou de désactiver des fonctionnalités de l'application de manière dynamique, sans redéploiement. Les modifications sont persistées localement dans le navigateur.

### Avantages

- ✅ **Développement incrémental** : Activer progressivement les nouvelles fonctionnalités
- ✅ **Tests A/B** : Tester différentes versions de fonctionnalités
- ✅ **Rollback rapide** : Désactiver instantanément une fonctionnalité problématique
- ✅ **Persistence locale** : Les préférences utilisateur sont sauvegardées
- ✅ **Interface intuitive** : Gestion via une interface web dédiée

## 🏗️ Architecture

### Structure des fichiers

```
src/
├── services/feature-flags/
│   ├── FeatureFlag.ts              # Interface TypeScript
│   ├── FeatureFlagService.ts       # Service principal
│   ├── featureFlagsStore.ts        # Store réactif Svelte
│   └── feature-flags.json          # Configuration par défaut
├── routes/feature-flags/
│   ├── +page.svelte                # Page de gestion
│   └── FeatureFlagsManager.svelte  # Composant d'interface
└── ui/components/
    └── Breadcrumb.svelte           # Navigation (inclut feature-flags)
```

### Composants principaux

1. **FeatureFlagService** : Gestion des flags et persistence
2. **featureFlagsStore** : Store réactif pour l'UI
3. **FeatureFlagsManager** : Interface de gestion
4. **feature-flags.json** : Configuration centralisée

## ⚙️ Configuration

### Fichier de configuration

Le fichier `src/services/feature-flags/feature-flags.json` contient la configuration par défaut :

```json
{
  "features": {
    "epic-export": {
      "name": "epic-export",
      "description": "Fonctionnalité d'export des epics en PDF/Excel et d'export en Backlog Azure",
      "enabled": false
    }
  }
}
```

### Ajouter un nouveau feature flag

1. **Ajouter dans la configuration** :
```json
{
  "features": {
    "nouvelle-fonctionnalite": {
      "name": "nouvelle-fonctionnalite",
      "description": "Description de la nouvelle fonctionnalité",
      "enabled": false
    }
  }
}
```

2. **Utiliser dans le code** :
```typescript
import { isFeatureEnabled } from '../services/feature-flags/featureFlagsStore.js';

// Vérification réactive
$: showNewFeature = isFeatureEnabled('nouvelle-fonctionnalite');

// Dans le template
{#if $showNewFeature}
  <NouvelleFeature />
{/if}
```

## 🎮 Utilisation

### Dans les composants Svelte

```typescript
import { featureFlagsStore, isFeatureEnabled } from '../services/feature-flags/featureFlagsStore.js';

// Méthode 1 : Vérification réactive simple
$: exportEnabled = isFeatureEnabled('epic-export');

{#if $exportEnabled}
  <button>Exporter l'Epic</button>
{/if}

// Méthode 2 : Accès direct au store
$: flags = $featureFlagsStore;
$: exportFlag = flags.find(f => f.name === 'epic-export');

{#if exportFlag?.enabled}
  <ExportComponent />
{/if}
```

### Gestion programmatique

```typescript
import { FeatureFlagService } from '../services/feature-flags/FeatureFlagService.js';
import { toggleFeatureFlag, resetFeatureFlagsToDefaults } from '../services/feature-flags/featureFlagsStore.js';

// Créer une instance du service
const featureFlagService = new FeatureFlagService();

// Vérifier un flag
const isEnabled = featureFlagService.isEnabled('epic-export');

// Activer/désactiver un flag
await toggleFeatureFlag('epic-export');

// Réinitialiser tous les flags
await resetFeatureFlagsToDefaults();
```

## 🖥️ Interface utilisateur

### Accès à l'interface

L'interface de gestion est accessible via :
- URL directe : `/feature-flags`
- Menu principal : "Feature Flags"
- Breadcrumb de navigation

### Fonctionnalités de l'interface

1. **Visualisation des flags** :
   - Nom et description
   - Statut (Activé/Désactivé)
   - Impact sur l'application

2. **Actions disponibles** :
   - Basculer l'état d'un flag
   - Réinitialiser aux valeurs par défaut
   - Navigation rapide vers l'accueil

3. **Feedback visuel** :
   - Badges de statut colorés
   - Animations de transition
   - Messages d'information

### Exemple d'utilisation

```svelte
<script>
  import { featureFlagsStore, toggleFeatureFlag } from '../services/feature-flags/featureFlagsStore.js';
  
  async function handleToggle(flagName) {
    await toggleFeatureFlag(flagName);
  }
</script>

{#each $featureFlagsStore as flag}
  <div class="flag-card">
    <h3>{flag.name}</h3>
    <p>{flag.description}</p>
    <button on:click={() => handleToggle(flag.name)}>
      {flag.enabled ? 'Désactiver' : 'Activer'}
    </button>
  </div>
{/each}
```

## 💾 Persistence

### Stockage local

Les overrides utilisateur sont stockés dans `localStorage` sous la clé `feature-flags-overrides` :

```json
{
  "epic-export": true,
  "autre-feature": false
}
```

### Priorité des valeurs

1. **localStorage** (overrides utilisateur) - Priorité haute
2. **feature-flags.json** (configuration par défaut) - Priorité basse

### Gestion des erreurs

```typescript
// Le service gère automatiquement les erreurs de localStorage
try {
  const flags = featureFlagService.getAllFlags();
} catch (error) {
  console.warn('Erreur lors du chargement des feature flags:', error);
  // Fallback vers la configuration par défaut
}
```

## 🧪 Tests

### Tests unitaires

```typescript
// Exemple de test d'un feature flag
import { describe, it, expect } from 'vitest';
import { FeatureFlagService } from '../FeatureFlagService.js';

describe('FeatureFlagService', () => {
  it('should enable a feature flag', () => {
    const service = new FeatureFlagService();
    service.setFlag('test-feature', true);
    
    expect(service.isEnabled('test-feature')).toBe(true);
  });
});
```

### Tests d'intégration

```typescript
// Test avec composant Svelte
import { render } from 'vitest-browser-svelte';
import FeatureFlagsManager from './FeatureFlagsManager.svelte';

it('should toggle feature flag', async () => {
  render(FeatureFlagsManager);
  
  const toggleButton = page.getByRole('button', { name: /activer/i });
  await toggleButton.click();
  
  expect(page.getByText('Activé')).toBeInTheDocument();
});
```

### Commandes de test

```bash
# Tests unitaires
npm run test:unit

# Tests spécifiques aux feature flags
npm run test:unit -- --grep "feature.*flag"

# Tests en mode watch
npm run test:unit -- --watch
```

## 🔧 Développement

### Développement local

1. **Installer les dépendances** :
```bash
cd frontEnd
npm install
```

2. **Lancer le serveur de développement** :
```bash
npm run dev
```

3. **Accéder à l'interface** :
   - Application : http://localhost:5173/
   - Feature Flags : http://localhost:5173/feature-flags

### Hot Reload

Les modifications des feature flags sont immédiatement visibles grâce au système réactif de Svelte :

```typescript
// Les changements dans le store se propagent automatiquement
$: isExportEnabled = $featureFlagsStore.find(flag => flag.name === 'epic-export')?.enabled || false;
```

### Debugging

```typescript
// Activer les logs de debug (en développement)
import { featureFlagsStore } from '../services/feature-flags/featureFlagsStore.js';

// Observer les changements
featureFlagsStore.subscribe(flags => {
  console.log('Feature flags updated:', flags);
});
```

## 🔍 Bonnes pratiques

### Nommage des flags

```typescript
// ✅ Bon
'epic-export'
'user-dashboard-v2'
'payment-flow-new'

// ❌ Éviter
'feature1'
'temp_flag'
'NEW_FEATURE'
```

### Nettoyage des flags

```typescript
// Supprimer les flags obsolètes
// 1. Retirer du code
// 2. Supprimer de feature-flags.json
// 3. Nettoyer les tests associés
```

### Sécurité

```typescript
// ⚠️ Ne jamais exposer de flags sensibles côté client
// Utiliser le backend pour les features critiques de sécurité
```

## 📚 Ressources

- [Documentation Svelte Stores](https://svelte.dev/docs#run-time-svelte-store)
- [Tests Vitest](https://vitest.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contribution

1. Fork le repository
2. Créer une branche feature : `git checkout -b feature/nouveau-flag`
3. Commit les changements : `git commit -m 'Add nouveau-flag'`
4. Push la branche : `git push origin feature/nouveau-flag`
5. Créer une Pull Request

---

**Dernière mise à jour** : 12 août 2025  
**Version** : 1.0.0  
**Auteur** : Epic Mapping Team

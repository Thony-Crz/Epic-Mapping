# Architecture DDD - Epic Management

Cette refactorisation suit les principes du Domain-Driven Design (DDD) et du craft.

## Structure de l'architecture

### 📁 `src/domain/` - Couche Domain (Métier)

**Entités** (`entities/`)
- `Epic.ts` - Entité principale représentant une epic
- `Feature.ts` - Entité représentant une feature dans une epic
- `Scenario.ts` - Value Object représentant un scénario

**Repositories** (`repositories/`)
- `EpicRepository.ts` - Interface définissant le contrat pour la persistance des epics

### 📁 `src/features/` - Use Cases organisés par domaine fonctionnel

**Epic Management** (`epic-management/use-cases/`)
- `CreateEpic.ts` - Créer une nouvelle epic
- `UpdateEpic.ts` - Mettre à jour une epic existante
- `DeleteEpic.ts` - Supprimer une epic

**Feature Management** (`feature-management/use-cases/`)
- `AddFeatureToEpic.ts` - Ajouter une feature à une epic
- `UpdateFeature.ts` - Mettre à jour une feature
- `DeleteFeature.ts` - Supprimer une feature

**Scenario Management** (`scenario-management/use-cases/`)
- `AddScenarioToFeature.ts` - Ajouter un scénario à une feature
- `UpdateScenario.ts` - Mettre à jour un scénario
- `DeleteScenario.ts` - Supprimer un scénario

### 📁 `src/infrastructure/` - Couche Infrastructure

**Repositories** (`repositories/`)
- `SvelteEpicRepository.ts` - Implémentation du repository utilisant les stores Svelte

### 📁 `src/services/` - Couche Application

- `EpicService.ts` - Service applicatif orchestrant les use cases
- `ServiceContainer.ts` - Container d'injection de dépendances

### 📁 `src/lib/stores/` - Interface avec l'UI

- `epicsStore.new.ts` - Store Svelte utilisant la nouvelle architecture (remplace l'ancien)

## Principes appliqués

### 🎯 **Domain-Driven Design**
- Les entités métier contiennent la logique métier et les invariants
- Séparation claire entre domain, application et infrastructure
- Les repositories définissent des contrats, pas des implémentations

### 🛠️ **Craft & Clean Architecture**
- Chaque use case a une responsabilité unique
- Injection de dépendances via le ServiceContainer
- Séparation des préoccupations : UI, logique métier, persistance

### 🔄 **CQRS pattern (léger)**
- Séparation entre les opérations de command (write) et query (read)
- Les use cases gèrent les commands, les queries passent directement par le repository

## Règles métier implémentées

### Dans `Feature.ts`
```typescript
// Règle : Si on ajoute un scénario vert à une feature "todo", elle passe en "in-progress"
if (this.props.status === 'todo' && scenario.type === 'green') {
  newStatus = 'in-progress';
}
```

### Validation dans les entités
- Validation des titres (longueur, vide)
- Validation des types de scénarios
- Invariants métier dans les constructeurs

## Migration

### Avant (ancien `epicsStore.ts`)
```typescript
// Store monolithique avec toute la logique
export function addScenarioToFeature(epicId, featureIndex, ...) {
  epicsStore.update(epics => {
    // 50 lignes de logique de mutation...
  });
}
```

### Après (nouvelle architecture)
```typescript
// Use case avec responsabilité unique
export class AddScenarioToFeature {
  async execute(input) {
    const epic = await this.epicRepository.findById(input.epicId);
    const scenario = Scenario.create({ title: input.title, type: input.type });
    const updatedFeature = feature.addScenario(scenario); // Logique métier dans l'entité
    await this.epicRepository.save(updatedEpic);
  }
}
```

## Usage dans les composants Svelte

```typescript
import { epicsStore, addNewEpic, addFeatureToEpic } from '$lib/stores/epicsStore.new';

// Toujours réactif avec Svelte
$: epics = $epicsStore;

// Utilisation des functions async
async function handleAddEpic() {
  try {
    await addNewEpic('Nouvelle Epic');
  } catch (error) {
    // Gestion d'erreur...
  }
}
```

## Avantages de cette architecture

✅ **Testabilité** - Chaque use case peut être testé unitairement  
✅ **Maintenabilité** - Responsabilités claires et séparées  
✅ **Évolutivité** - Facile d'ajouter de nouveaux use cases  
✅ **Réutilisabilité** - Les use cases peuvent être réutilisés  
✅ **Lisibilité** - Code plus expressif et métier-oriented  

## Étapes suivantes

1. Remplacer progressivement l'utilisation de l'ancien store
2. Ajouter des tests unitaires pour les entités et use cases
3. Implémenter la persistance (localStorage, API, etc.)
4. Ajouter de nouveaux use cases selon les besoins métier

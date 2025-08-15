# Storybook - Epic Mapping Components

Ce projet utilise Storybook pour développer et documenter les composants UI de manière isolée.

## 🚀 Démarrage rapide

### Lancer Storybook
```bash
npm run storybook
```

Storybook sera accessible sur http://localhost:6006

### Build pour production
```bash
npm run build-storybook
```

## 📁 Structure des Stories

```
src/stories/
├── components/           # Stories des composants UI
│   ├── cards/           # Cartes (BlueCard, YellowCard, etc.)
│   ├── common/          # Composants communs (EditableText, etc.)
│   ├── Logo.stories.svelte
│   └── Breadcrumb.stories.svelte
├── examples/            # Démonstrations complètes
│   └── EpicMappingWorkflow.stories.svelte
└── ...                 # Stories générées par défaut
```

## 🎨 Composants disponibles

### 🏷️ Logo
- **Chemin**: `Components/Logo`
- **Description**: Logo d'Epic Mapping avec 3 tailles (sm, md, lg)
- **Props**: `size: 'sm' | 'md' | 'lg'`

### 🧭 Breadcrumb
- **Chemin**: `Components/Breadcrumb`
- **Description**: Fil d'Ariane pour la navigation
- **Props**: `customBreadcrumbs?: Array<{label: string, href: string}>`

### 📝 EditableText
- **Chemin**: `Components/Common/EditableText`
- **Description**: Texte éditable avec gestion clavier
- **Props**: `text: string`, `isEditing?: boolean`, `placeholder?: string`
- **Events**: `edit`, `save`, `cancel`

### 🃏 Cartes

#### EditableCard (Base)
- **Chemin**: `Components/Cards/EditableCard`
- **Description**: Carte éditable générique
- **Props**: `title`, `editable`, `cardClass`, `titleClass`, `showDeleteButton`

#### BlueCard (Epic)
- **Chemin**: `Components/Cards/BlueCard`
- **Description**: Carte bleue pour les Epics
- **Usage**: Représente les objectifs principaux

#### YellowCard (Fonctionnalité)
- **Chemin**: `Components/Cards/YellowCard`
- **Description**: Carte jaune pour les fonctionnalités
- **Props**: `status: 'todo' | 'in-progress' | 'ready' | 'blocked'`
- **Features**: Gestion des statuts, validation des scénarios

#### GreenCard (Scénario validé)
- **Chemin**: `Components/Cards/GreenCard`
- **Description**: Carte verte pour les scénarios validés
- **Usage**: Cas d'usage confirmés et testés

#### GreyCard (Question/Clarification)
- **Chemin**: `Components/Cards/GreyCard`
- **Description**: Carte grise pour les questions en attente
- **Usage**: Points nécessitant clarification

## 🌟 Fonctionnalités Storybook

### ♿ Tests d'accessibilité
- **Addon**: `@storybook/addon-a11y`
- **Usage**: Tests automatiques d'accessibilité sur tous les composants
- **Rapports**: Violations WCAG visibles dans l'onglet "Accessibility"

### 🧪 Tests avec Vitest
- **Addon**: `@storybook/addon-vitest`
- **Usage**: Tests unitaires intégrés dans Storybook
- **Commande**: `npx vitest --project=storybook`

### 📖 Documentation automatique
- **Addon**: `@storybook/addon-docs`
- **Usage**: Documentation générée automatiquement à partir des PropTypes et commentaires
- **Format**: Pages MDX pour documentation avancée

## 🎯 Exemples d'utilisation

### Workflow complet
- **Story**: `Examples/Epic Mapping Workflow/Complete Workflow`
- **Description**: Démonstration complète avec Epic, fonctionnalités, et scénarios
- **Usage**: Exemple de flux utilisateur complet

### Vue simple
- **Story**: `Examples/Epic Mapping Workflow/Simple Epic View`
- **Description**: Vue simplifiée d'un Epic avec quelques fonctionnalités

## 🛠️ Développement

### Ajouter un nouveau composant

1. Créer le composant dans `src/ui/components/`
2. Créer la story dans `src/stories/components/`
3. Utiliser le template suivant :

```svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MonComposant from '../../../ui/components/MonComposant.svelte';

  const { Story } = defineMeta({
    title: 'Components/MonComposant',
    component: MonComposant,
    tags: ['autodocs'],
    argTypes: {
      // Définir les props contrôlables
    }
  });
</script>

<Story name="Default" args={{ /* props par défaut */ }} />
```

### Bonnes pratiques

1. **Nommage** : Utiliser des noms descriptifs pour les stories
2. **Documentation** : Ajouter des descriptions dans `argTypes`
3. **Accessibilité** : Vérifier les tests a11y dans l'onglet Accessibility
4. **Interactivité** : Utiliser `fn()` pour les event handlers
5. **Exemples** : Créer des stories variées (états, tailles, contenus)

## 🎨 Styles

Les styles Tailwind CSS sont automatiquement chargés dans Storybook via l'import de `../src/app.css` dans `.storybook/preview.ts`.

## 🔧 Configuration

### Addons installés
- `@storybook/addon-svelte-csf` : Support des stories en format Svelte
- `@storybook/addon-docs` : Documentation automatique
- `@storybook/addon-a11y` : Tests d'accessibilité
- `@storybook/addon-vitest` : Intégration des tests

### Configuration personnalisée
- **Main**: `.storybook/main.ts`
- **Preview**: `.storybook/preview.ts`
- **Vitest**: `.storybook/vitest.setup.ts`

## 📚 Ressources

- [Documentation Storybook](https://storybook.js.org/docs)
- [Storybook pour Svelte](https://storybook.js.org/docs/svelte/get-started/introduction)
- [Tests d'accessibilité](https://storybook.js.org/docs/writing-tests/accessibility-testing)
- [Addon Vitest](https://storybook.js.org/docs/writing-tests/vitest-plugin)

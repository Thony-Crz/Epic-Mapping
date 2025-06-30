# Epic Mapping Frontend

Une application SvelteKit pour la gestion et la visualisation d'épiques, de fonctionnalités et de scénarios dans le cadre de projets agiles.

## Fonctionnalités

- 🎯 **Gestion d'Épiques** : Créer, modifier et supprimer des épiques
- 🚀 **Gestion de Fonctionnalités** : Ajouter des fonctionnalités aux épiques
- 📝 **Gestion de Scénarios** : Créer des scénarios pour les fonctionnalités
- 📊 **Gestion de Projets** : Organiser le travail par projets
- 💾 **Export/Import** : Sauvegarder et charger vos mappings
- 🎨 **Interface moderne** : Interface utilisateur avec Tailwind CSS

## Architecture

Le projet suit une architecture hexagonale avec :
- **Entités** : Epic, Feature, Scenario, Project
- **Use Cases** : Logique métier pour chaque fonctionnalité
- **Repositories** : Accès aux données
- **Services** : Orchestration des use cases
- **UI Components** : Composants Svelte réutilisables

## Technologies

- **SvelteKit** - Framework frontend
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles utilitaires
- **Vite** - Build tool et serveur de développement
- **Vitest** - Tests unitaires
- **Playwright** - Tests end-to-end

## Installation et Développement

### Prérequis
- Node.js (version 18 ou supérieure)
- npm, pnpm ou yarn

### Installation

```bash
# Cloner le projet
git clone <url-du-repo>
cd frontEnd

# Installer les dépendances
npm install
```

### Démarrage du serveur de développement

```bash
# Démarrer le serveur de développement
npm run dev

# Ou démarrer et ouvrir automatiquement dans le navigateur
npm run dev -- --open
```

L'application sera disponible sur `http://localhost:5173/`

## Scripts disponibles

```bash
# Développement
npm run dev              # Serveur de développement
npm run build            # Build de production
npm run preview          # Prévisualiser le build

# Qualité de code
npm run check            # Vérification TypeScript
npm run lint             # Linting ESLint
npm run format           # Formatage Prettier

# Tests
npm run test             # Tous les tests
npm run test:unit        # Tests unitaires avec Vitest
npm run test:e2e         # Tests end-to-end avec Playwright
```

## Structure du Projet

```
src/
├── routes/                 # Pages SvelteKit
├── domain/                 # Logique métier
│   ├── entities/          # Entités du domaine
│   └── repositories/      # Interfaces des repositories
├── features/              # Use cases par domaine
├── infrastructure/        # Implémentations des repositories
├── services/             # Services d'orchestration
├── ui/                   # Composants UI
│   ├── components/       # Composants réutilisables
│   └── forms/           # Formulaires
└── lib/                  # Utilitaires et stores
```

## Utilisation

1. **Créer un projet** : Commencez par créer un nouveau projet
2. **Ajouter des épiques** : Définissez vos épiques principales
3. **Ajouter des fonctionnalités** : Décomposez vos épiques en fonctionnalités
4. **Créer des scénarios** : Détaillez vos fonctionnalités avec des scénarios
5. **Exporter** : Sauvegardez votre mapping pour le partager

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`)
3. Commit vos changements (`git commit -am 'Ajout de ma fonctionnalité'`)
4. Push vers la branche (`git push origin feature/ma-fonctionnalite`)
5. Créer une Pull Request

## Déploiement

```bash
# Build de production
npm run build
```

> Pour déployer votre application, vous devrez peut-être installer un [adaptateur](https://svelte.dev/docs/kit/adapters) pour votre environnement cible.

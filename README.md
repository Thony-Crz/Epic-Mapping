[![CI/CD Pipeline](https://github.com/Thony-Crz/Epic-Mapping/actions/workflows/ci.yml/badge.svg)](https://github.com/Thony-Crz/Epic-Mapping/actions/workflows/ci.yml)

[Recette-Front](https://thony-crz.github.io/Epic-Mapping/)

<div align="center">
  <img src="logo-with-text.svg" alt="Epic Mapping Logo"/>
  <h1>🧭 Epic Mapping - Example Mapping + Intégration Azure DevOps</h1>
</div>

## 🚀 Démarrage Rapide

```bash
# Démarrer l'environnement de développement complet
./scripts/start-dev.sh

# Vérifier l'état des services
./scripts/check-dev.sh

# Arrêter l'environnement
./scripts/stop-dev.sh
```

**URLs disponibles :**
- 🎨 **Frontend**: http://localhost:5173
- 🔧 **API**: http://localhost:8080
- 🏥 **Health Check**: http://localhost:8080/api/Database/health

## 📚 Documentation

👀 **[Consultez la documentation complète dans /Docs/](./Docs/README.md)**

| Guide | Description |
|-------|-------------|
| [**Guide de développement**](./Docs/DEVELOPMENT-ENVIRONMENT.md) | 🌟 Démarrage environnement complet |
| [**Guide Docker**](./Docs/README-DOCKER.md) | 🐳 Configuration Docker avancée |
| [**Architecture**](./Docs/ARCHITECTURE.md) | 🏗️ Structure DDD du code |
| [**Sécurité**](./Docs/SECURITY.md) | 🔒 Bonnes pratiques sécurité |

## 🎯 Objectif

Cette application web permet de **modéliser des User Story Maps à l'aide de l'Example Mapping**, et de **générer automatiquement l'arborescence correspondante (Epic, Features, Scenarios) dans un backlog Azure DevOps** une fois le travail d'analyse complété.

Elle est **autonome**, ne nécessite pas d'installation dans Azure DevOps, et fonctionne via les **API REST**.

## 📊 État du Projet

**🏗️ En cours de développement** - Architecture fondamentale en place

### ✅ Réalisé (Frontend)
- ✅ Architecture DDD/Clean Architecture complète
- ✅ Entités métier (Epic, Feature, Scenario, Project)
- ✅ Use Cases organisés par domaine fonctionnel
- ✅ Interface utilisateur fonctionnelle avec SvelteKit
- ✅ Système de drag & drop pour les cartes
- ✅ Validation métier dans les entités
- ✅ Tests unitaires des entités (Vitest)
- ✅ Tests E2E avec Playwright

### 🚧 En cours (Backend)
- 🚧 Structure Clean Architecture créée (.NET 9.0)
- 🚧 Projets Domain/Application/Infrastructure initialisés
- 🚧 Configuration Docker prête
- ⏳ Implémentation des entités métier à venir
- ⏳ Use Cases et repositories à implémenter
- ⏳ API REST endpoints à développer
- ⏳ Tests TDD à mettre en place

### 📋 À faire
- ⏳ Intégration Azure DevOps API
- ⏳ Authentification et autorisation
- ⏳ Persistance base de données
- ⏳ Tests d'intégration backend/frontend
- ajouter une fonctionnalité qui permet de faire des sessions d'exemple mapping times

## 🗺️ Règles de correspondance

| Carte | Couleur | Correspondance Azure DevOps |
|-------|---------|------------------------------|
| 🟦 Bleue | Épopée | Epique (Epic) |
| 🟨 Jaune | Règle métier | Fonctionnalité (Feature ou User Story) |
| 🟩 Verte | Exemple | Scénario / Tâche associée |
| ⬜ Grise | Question | Blocage (empêche la création tant que non résolue) |

## 💡 Fonctionnalités prévues

### 1. 🏠 Page d'accueil

- Liste des **User Story Maps (Epics)** créées
- Barre de **recherche** pour filtrer les epics existantes
- Bouton pour **créer une nouvelle story map**

### 2. 🔍 Consultation d'une User Story Map

- Affichage de :
  - 🟪 **Epic** (nom de la story map)
  - 🟦 **Règles métier** (Features)
  - 🟩 **Scénarios** (Use cases)
  - ❓ **Questions ouvertes** (modifiables, sous forme de post-its)

- Interface 100% **visuelle**, type post-it pour :
  - Glisser-déposer
  - Modifier, ajouter ou supprimer
  - Organiser l'arborescence logicielle

### 3. 🔁 Génération vers Azure DevOps

- Lorsqu'un epic est **complètement défini** (c'est-à-dire **sans question en attente**), un **bouton apparaît** :
  
  `Ajouter au backlog Azure`

- Cela déclenche :
  - La création d'un **Epic Azure DevOps**
  - La génération automatique des **Features** et **Scenarios**
  - L'association des liens hiérarchiques
  - L'utilisation de l'API REST Azure DevOps via un PAT ou OAuth

## 📁 Exemple de flux

1. Tu crées une nouvelle user story map : **"Inscription utilisateur"**
2. Tu ajoutes :
   - Règles métier : "Mot de passe sécurisé", "Validation e-mail"
   - Scénarios : "Utilisateur saisit un mot de passe invalide", etc.
   - Questions : "Quels types d'e-mail sont valides ?", etc.
3. Tu termines l'analyse (plus de question ouverte)
4. Tu cliques sur **"Ajouter au backlog Azure"**
5. L'application crée :
   - Un **Epic** "Inscription utilisateur"
     - Des **Features** "Mot de passe sécurisé", etc.
       - Des **Scenarios** comme tâches ou PBIs

## Maquette

![image](https://github.com/user-attachments/assets/7ca75f25-cde6-4177-a05d-1dd8c67b0c1f)

## Ecrans

### Accueil

![image](https://github.com/user-attachments/assets/d8701d53-46ff-43e3-adf5-388654796cab)

### Epic

![image](https://github.com/user-attachments/assets/f1d6aed0-2d51-47ce-9325-9b070578fcfa)

## ⚙️ Architecture Technique

### 🧠 Philosophie

Ce projet s'inscrit dans une démarche **Software Craftsmanship**, avec un fort accent sur la **clarté du code**, le **Test-Driven Development (TDD)**, et l'architecture **Domain-Driven Design (DDD)**. L'objectif est de proposer une solution testable, maintenable et qualitative, orientée modélisation métier et automatisation de backlog.

**Approche adoptée :**
- 🎯 **DDD** : Séparation claire Domain/Application/Infrastructure
- 🧪 **TDD** : Tests first, couverture élevée, cycles Red-Green-Refactor
- 🏗️ **Clean Architecture** : Dépendances orientées vers le domaine
- ⚡ **Craft** : Code expressif, SOLID principles, refactoring continu

### 🏗️ Stack Technique

| Couche | Technologie | Version | Justification |
|--------|-------------|---------|------------------|
| **Frontend** | [SvelteKit](https://kit.svelte.dev/) | 2.16.0 | Réactif, syntaxe propre, excellent DX |
| **Backend** | ASP.NET Core WebAPI | .NET 9.0 | Robuste, typé, écosystème riche |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 4.1.11 | Design system, composabilité |
| **Testing** | Vitest + Playwright + NUnit | Latest | Coverage complète (unit/integration/e2e) |
| **API externe** | Azure DevOps REST API | v7.1 | Intégration native Azure |

### 📂 Architecture Projet

```
Epic-Mapping/
├── 🎨 frontEnd/                    # SvelteKit Application
│   ├── src/
│   │   ├── domain/                 # 🎯 Couche Domain (DDD)
│   │   │   ├── entities/           # Epic, Feature, Scenario, Project
│   │   │   └── repositories/       # Contrats de persistance
│   │   ├── features/               # 🚀 Use Cases par domaine
│   │   │   ├── epic-management/
│   │   │   ├── feature-management/
│   │   │   ├── project-management/
│   │   │   └── scenario-management/
│   │   ├── infrastructure/         # 🔧 Implémentations concrètes
│   │   │   └── repositories/       # SvelteEpicRepository
│   │   ├── services/               # 🎼 Orchestration applicative
│   │   │   ├── EpicService.ts
│   │   │   └── ServiceContainer.ts # DI Container
│   │   ├── ui/components/          # 🎨 Composants UI
│   │   └── routes/                 # 🛣️ Pages SvelteKit
│   ├── e2e/                        # 🧪 Tests E2E (Playwright)
│   └── package.json                # Dependencies & scripts
│
├── 🔧 backEnd/                     # .NET 9.0 Clean Architecture
│   ├── EpicMapping.WebApi/         # 🌐 API REST Layer
│   │   ├── Controllers/            # REST endpoints
│   │   ├── Program.cs              # DI + Pipeline config
│   │   └── *.csproj                # Project dependencies
│   ├── src/
│   │   ├── Domain/                 # 🎯 Entités & règles métier
│   │   ├── Application/            # 🚀 Use Cases & DTOs
│   │   └── Infrastructure/         # 🔧 DB, Azure DevOps, etc.
│   └── Tests/                      # 🧪 Test Projects
│       ├── Application.UnitTests/
│       ├── Application.IntegrationTests/
│       └── Infrastructure.IntegrationTests/
│      
└── README.md                       # 📖 Documentation principale
```

### 🧪 Tests & Qualité - Approche TDD/Craft

Le projet adopte une approche **Test-Driven Development (TDD)** rigoureuse avec une architecture **Clean** favorisant la testabilité à tous les niveaux.

#### 🎯 Frontend - Architecture DDD Implémentée

**✅ Entités métier avec règles business**
```typescript
// Example: Feature.ts - Logique métier dans l'entité
if (this.props.status === 'todo' && scenario.type === 'green') {
  newStatus = 'in-progress'; // Règle: scenario vert active la feature
}
```

**✅ Use Cases par domaine**
- `epic-management/` : CreateEpic, UpdateEpic, DeleteEpic
- `feature-management/` : AddFeatureToEpic, UpdateFeature, DeleteFeature  
- `scenario-management/` : AddScenarioToFeature, UpdateScenario, DeleteScenario

**✅ Tests en place**
- **Framework** : [Vitest](https://vitest.dev/) pour les tests unitaires
- **E2E** : [Playwright](https://playwright.dev/) pour les parcours utilisateur
- **Coverage** : Tests des entités, use cases, et composants UI

#### 🔧 Backend - Structure TDD Ready (.NET 9.0)

**🚧 En cours d'implémentation**
- **Framework** : [NUnit](https://nunit.org/) + [FluentAssertions](https://fluentassertions.com/)
- **Mocking** : [Moq](https://github.com/moq/moq4) pour les dépendances
- **Style** : Red-Green-Refactor, tests unitaires et d'intégration

#### 📊 Stratégie de Tests

| Type de test | Cible | Outils | Status |
|--------------|-------|--------|--------|
| ✅ **Unit Tests** | Entités, Use Cases, Rules | Vitest, NUnit | Frontend ✅ / Backend 🚧 |
| ✅ **Integration Tests** | Repositories, Services | NUnit + TestServer | Frontend ✅ / Backend 🚧 |
| ✅ **E2E Tests** | Parcours utilisateur | Playwright | Frontend ✅ |
| ⏳ **API Tests** | Azure DevOps integration | NUnit + HttpClient | À venir |

#### 🏗️ Patterns Craft Appliqués

- **🎯 Single Responsibility** : Un use case = une responsabilité
- **🔄 Dependency Inversion** : Repositories définis par des interfaces
- **📦 Injection de Dépendances** : ServiceContainer centralisé
- **🧩 CQRS** : Séparation Commands/Queries
- **🛡️ Fail Fast** : Validation dans les constructeurs d'entités

### 🔐 Authentification

⏳ À implémenter : Azure AD / OAuth pour l'intégration Azure DevOps

### 📦 Stockage

**Phase 1 (Actuelle)**
- InMemory avec stores Svelte
- Sauvegarde locale JSON
- Import/export de story maps (JSON)

**Phase 2 (Prévue)**
- Base de données SQLite/PostgreSQL
- Synchronisation cloud optionnelle
- Export vers formats externes (CSV, Excel)

## 🚀 Démarrage Rapide

### Frontend
```bash
cd frontEnd
npm install
npm run dev
```

### Backend (quand implémenté)
```bash
cd backEnd/EpicMapping.WebApi
dotnet restore
dotnet run
```

### Tests
```bash
# Frontend
cd frontEnd
npm run test:unit
npm run test:e2e

# Backend (quand implémenté)
cd backEnd
dotnet test
```

## 🔁 Évolutions futures

- 🎯 Génération automatique de fichiers Gherkin depuis les scénarios
- 👥 Interface collaborative multi-utilisateurs en temps réel
- 🔗 Intégration avec d'autres outils (Jira, Miro, Figma)
- 📊 Analytics et métriques sur les story maps
- 🤖 Suggestions IA pour l'Example Mapping

## 📋 Roadmap

### Phase 1 - MVP ✅ (En cours)
- [x] Frontend DDD architecture
- [x] Interface de création/édition d'epics
- [x] Drag & drop des cartes
- [x] Tests frontend
- [ ] Backend Clean Architecture
- [ ] API REST basique
- [ ] Tests backend

### Phase 2 - Intégration Azure
- [ ] Azure DevOps API integration
- [ ] Authentification OAuth
- [ ] Génération d'épics/features/scenarios
- [ ] Tests d'intégration

### Phase 3 - Production
- [ ] Déploiement cloud
- [ ] Monitoring & logs
- [ ] Documentation utilisateur
- [ ] Performance optimisation

## 🛠️ Commandes Utiles

```bash
# Frontend - Tests watch mode
npm run test:unit -- --watch

# Frontend - Build pour production
npm run build

# Backend - Watch mode avec hot reload
dotnet watch run

# Backend - Tests avec coverage
dotnet test --collect:"XPlat Code Coverage"
```

## 📚 Inspirations & Références

- [SpecSync for Azure DevOps](https://specsolutions.eu/specsync/)
- [Azure DevOps REST API](https://learn.microsoft.com/en-us/rest/api/azure/devops/?view=azure-devops-rest-7.1)
- [Example Mapping](https://cucumber.io/blog/bdd/example-mapping-introduction/) - BDD technique
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - Robert C. Martin

---

**Développement** : Architecture craft en cours, TDD appliqué au maximum, refactoring continu pour la qualité du code.

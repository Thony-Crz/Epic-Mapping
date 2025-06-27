# 🧭 Application Web – Example Mapping + Intégration Azure DevOps

## 🎯 Objectif

Cette application web permet de **modéliser des User Story Maps à l’aide de l’Example Mapping**, et de **générer automatiquement l’arborescence correspondante (Epic, Features, Scenarios) dans un backlog Azure DevOps** une fois le travail d’analyse complété.

Elle est **autonome**, ne nécessite pas d’installation dans Azure DevOps, et fonctionne via les **API REST**.

## 🗺️ Règles de correspondance

| Carte | Couleur | Correspondance Azure DevOps |
|-------|---------|------------------------------|
| 🟦 Bleue | Épopée | Epique (Epic) |
| 🟨 Jaune | Règle métier | Fonctionnalité (Feature ou User Story) |
| 🟩 Verte | Exemple | Scénario / Tâche associée |
| ⬜ Grise | Question | Blocage (empêche la création tant que non résolue) |

## 💡 Fonctionnalités prévues

### 1. 🏠 Page d’accueil

- Liste des **User Story Maps (Epics)** créées
- Barre de **recherche** pour filtrer les epics existantes
- Bouton pour **créer une nouvelle story map**

### 2. 🔍 Consultation d’une User Story Map

- Affichage de :
  - 🟪 **Epic** (nom de la story map)
  - 🟦 **Règles métier** (Features)
  - 🟩 **Scénarios** (Use cases)
  - ❓ **Questions ouvertes** (modifiables, sous forme de post-its)

- Interface 100% **visuelle**, type post-it pour :
  - Glisser-déposer
  - Modifier, ajouter ou supprimer
  - Organiser l’arborescence logicielle

---

### 3. 🔁 Génération vers Azure DevOps

- Lorsqu’un epic est **complètement défini** (c’est-à-dire **sans question en attente**), un **bouton apparaît** :
  
  `Ajouter au backlog Azure`

- Cela déclenche :
  - La création d’un **Epic Azure DevOps**
  - La génération automatique des **Features** et **Scenarios**
  - L'association des liens hiérarchiques
  - L’utilisation de l’API REST Azure DevOps via un PAT ou OAuth

---

## 📁 Exemple de flux

1. Tu crées une nouvelle user story map : **"Inscription utilisateur"**
2. Tu ajoutes :
   - Règles métier : "Mot de passe sécurisé", "Validation e-mail"
   - Scénarios : "Utilisateur saisit un mot de passe invalide", etc.
   - Questions : "Quels types d’e-mail sont valides ?", etc.
3. Tu termines l’analyse (plus de question ouverte)
4. Tu cliques sur **"Ajouter au backlog Azure"**
5. L'application crée :
   - Un **Epic** "Inscription utilisateur"
     - Des **Features** "Mot de passe sécurisé", etc.
       - Des **Scenarios** comme tâches ou PBIs

---

## Maquette

![image](https://github.com/user-attachments/assets/7ca75f25-cde6-4177-a05d-1dd8c67b0c1f)


## ⚙️ Architecture Technique

### 🧠 Philosophie

Ce projet s’inscrit dans une démarche **Software Craftsmanship**, avec un fort accent sur la **clarté du code**, la **séparation des responsabilités**, et l’**expérience utilisateur fluide**. L’objectif est de proposer une solution simple, testable et qualitative, orientée modélisation métier et automatisation de backlog.

---

### 🏗️ Stack retenue

| Couche | Technologie | Justification |
|--------|-------------|------------------|
| **Frontend** | [SvelteKit](https://kit.svelte.dev/) | Léger, réactif, syntaxe propre, excellent pour craft |
| **Backend** | ASP.NET Core WebAPI (C#) | Robuste, typé, parfaite intégration avec Azure |
| **API externe** | Azure DevOps REST API | Pour créer dynamiquement des Epics, Features, Scenarios |
| **UI / CSS** | [Tailwind CSS](https://tailwindcss.com/) | Design clair et composable (ex : post-its, drag & drop) |

---

#### 📂 Organisation du projet

```
/src/
├── Core/
│   ├── Domain/               # Entités métier, value objects
│   └── Application/          # Use cases, ports, DTOs
├── Infrastructure/           # Implémentations concrètes (ex : Azure DevOps)
├── WebApi/                   # Endpoints REST, injection de dépendances
├── WebApp/                   # Application SvelteKit (frontend)
├── Tests/
│   ├── Application.UnitTests/
│   ├── Application.IntegrationTests/
│   ├── Infrastructure.IntegrationTests/
│   └── E2e.Tests/
```

---
### 🔐 Authentification
---
### 📦 Stockage (temporaire)

- InMemory
- Sauvegarde locale JSON
- Import/export de story maps (JSON, CSV)
- Option future : synchronisation avec Miro ou backend persistant
- SqlLite

---

### 🧪 Tests & Qualité

Le projet adopte une approche **Test-Driven Development (TDD)** structurée autour d’une architecture **Clean**, avec séparation claire des responsabilités et des couches testables indépendamment.

#### 🔍 Backend – C# (ASP.NET Core)

- **Framework de test** : [NUnit](https://nunit.org/)
- **Style** : TDD, tests unitaires et d’intégration
- **Moq** : pour les dépendances et comportements simulés

> 📌 Possibilité d’introduire du **BDD** avec [SpecFlow](https://specflow.org/) si besoin (scénarios lisibles métier, Gherkin + NUnit)

#### 🔍 Frontend

- Tests de composants via `vitest`
- Tests E2E via `Playwright` ou `Cypress` (dans `E2e.Tests`)
- Contrôle visuel du bouton Azure selon la présence de questions

#### 🧪 Types de tests

| Type de test              | Cible                                      | Outils |
|---------------------------|--------------------------------------------|--------|
| ✅ Tests unitaires         | Règles métier (`Application`)              | NUnit, Moq, FluentAssertions |
| 🔗 Tests d’intégration     | Appels inter-couches, connecteurs externes | NUnit + TestServer |
| 🔐 Tests Azure DevOps      | Appels réels ou simulés vers l’API         | NUnit + HttpClient |
| 🧪 Tests E2E / BDD         | Parcours utilisateur complet               | SpecFlow (optionnel), Playwright/Cypress (via WebApp) |

## 🔁 Évolutions futures (non incluses)

- Génération automatique de fichiers Gherkin
- Interface collaborative multi-utilisateurs

## 📋 Étapes projet

- [ ] Maquettage interface mapping (cartes colorées)
- [ ] Détection automatique des post-its gris restants
- [ ] Désactivation du bouton "Créer épopée" tant que des questions subsistent
- [ ] Création automatisée des WI avec hiérarchie correcte
- [ ] Tests d’intégration avec Azure DevOps
- [ ] Publication de l’extension en interne ou sur marketplace

## 📚 Inspirations & outils connexes

- [SpecSync for Azure DevOps](https://specsolutions.eu/specsync/)
- [Azure DevOps REST API](https://learn.microsoft.com/en-us/rest/api/azure/devops/?view=azure-devops-rest-7.1)
- [Action Button Extension](https://marketplace.visualstudio.com/items?itemName=AviHadad.Action-Button)

---

**Auteur** : à compléter  

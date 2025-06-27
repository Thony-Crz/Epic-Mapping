# 🧩 Extension Azure DevOps - Exemple Mapping to Work Items

## 🎯 Objectif

Créer une **extension Azure DevOps** permettant de structurer et d'automatiser la création d'éléments de travail à partir d'un **atelier d'Exemple Mapping**.

Le but est de **faciliter la transition entre les cartes de l'atelier** (post-its) et les **Work Items Azure DevOps**, tout en respectant les contraintes métier.

## 🗺️ Règles de correspondance

| Carte | Couleur | Correspondance Azure DevOps |
|-------|---------|------------------------------|
| 🟦 Bleue | Épopée | Epique (Epic) |
| 🟨 Jaune | Règle métier | Fonctionnalité (Feature ou User Story) |
| 🟩 Verte | Exemple | Scénario / Tâche associée |
| ⬜ Grise | Question | Blocage (empêche la création tant que non résolue) |

## 💡 Fonctionnalités prévues

- Affichage des cartes Exemple Mapping (format numérique ou import)
- Bouton **"Créer épopée"** visible à côté d’une carte 🟦 **bleue**
  - **Désactivé tant qu’il reste des post-its ⬜ gris (questions ouvertes)**
- À la création :
  - Création d’un **Epic**
  - Création automatique des **Fonctionnalités** pour chaque carte 🟨 jaune associée
  - Création des **Tâches ou Test Cases** pour chaque 🟩 vert
  - Liaison hiérarchique (Scénarios → Fonctionnalités → Épopée)
- Traçabilité complète dans Azure DevOps

## 🛠️ Stack technique envisagée

- [Azure DevOps Extension SDK](https://learn.microsoft.com/en-us/azure/devops/extend/?view=azure-devops)
- HTML/CSS + TypeScript (React possible)
- API REST Azure DevOps (pour la création/lien des WI)
- Stockage temporaire ou import/export des mappings (JSON, CSV, Miro, etc.)

## 📊 Estimation par phase (MVP)

| Phase                      | Détail                                                                 | Durée estimée        |
|---------------------------|------------------------------------------------------------------------|----------------------|
| 📐 Spécification           | Définir les règles, le modèle de données, les rôles des cartes         | 0.5 à 1 jour         |
| 🎨 Maquettage UI           | Maquettage de l’interface post-it + zones colorées + bouton            | 0.5 à 1 jour         |
| ⚙️ Développement Front     | Affichage des post-its, interaction, logique d’activation du bouton     | 2 à 3 jours          |
| 🔌 Intégration API ADO     | Création Epic / Feature / Task via Azure DevOps REST API               | 3 à 5 jours          |
| 🧪 Tests fonctionnels      | Cas normaux, erreurs API, blocage si post-its gris présents            | 1 à 2 jours          |
| 📦 Packaging et déploiement| Création du manifeste, empaquetage VSIX, installation dans l’org       | 0.5 jour             |

---

## ⏱️ Total estimé

**➡️ Durée totale : 8 à 12 jours ouvrés** pour une première version fonctionnelle (MVP).

---

## 🔁 Évolutions futures (non incluses)

- Connexion directe à Miro / FigJam
- Persistance ou import/export des mappings
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
**Licence** : à définir (MIT / Apache 2.0 / autre)

# TODO - Epic Mapping Project

## 🎉 CORRECTION MAJEURE RÉALISÉE - HIÉRARCHIE ALIGNÉE

### ✅ **PROBLÈME N°1 RÉSOLU** - Hiérarchie Domain/Frontend
La divergence critique de hiérarchie entre le backend et le frontend a été **entièrement corrigée** :

**AVANT** ❌ : `Epic → Project → Feature → Scenario` (backend) vs `Project → Epic → Feature → Scenario` (frontend)  
**APRÈS** ✅ : `Project → Epic → Feature → Scenario` (backend ET frontend alignés)

**Corrections apportées** :
- ✅ `Project` est maintenant l'entité racine
- ✅ `Epic.ProjectId` + navigation `Project.Epics`
- ✅ `Feature.EpicId` + navigation `Epic.Features`
- ✅ Relations FK corrigées dans toute la hiérarchie
- ✅ Enums ajoutés : `EpicStatus`, `FeatureStatus`, `ScenarioType`
- ✅ Propriétés alignées : `Feature.Title` (au lieu de `Name`)

**Tests** : 70 tests au vert (67 existants + 3 nouveaux)

---

## Analyse des Divergences avec exampleMapping.ts

### 🔍 DIVERGENCES CRITIQUES IDENTIFIÉES

#### 1. **HIÉRARCHIE INVERSÉE** ✅ **CORRIGÉE**
- **ExampleMapping.ts** : `Project` → `Epic` → `Feature` → `Scenario`  
- **Domain actuel** : `Project` → `Epic` → `Feature` → `Scenario` ✅

**Impact** : ~~Architecture fondamentalement différente entre frontend et backend~~ **RÉSOLU**

#### 2. **PROPRIÉTÉS MANQUANTES ESSENTIELLES**

##### Dans `Project` :
- ✅ **AJOUTÉ** `projectId` → maintenant Project est racine (pas de projectId nécessaire)
- ❌ Manque `status` (closed, in progress, archived) - *À évaluer selon logique métier*

##### Dans `Epic` :
- ✅ **AJOUTÉ** `projectId` (Epic appartient à un Project)
- ✅ **AJOUTÉ** `status` (EpicStatus enum : Closed, InProgress, Archived)

##### Dans `Feature` :
- ✅ **CORRIGÉ** `title` (renommé de `name` vers `title`)
- ✅ **AJOUTÉ** `status` (FeatureStatus enum : Ready, InProgress, Draft)
- ✅ **CORRIGÉ** Relations FK : `EpicId` au lieu de `ProjectId`

##### Dans `Scenario` :
- ✅ **AJOUTÉ** `type` (ScenarioType enum : Green, Yellow, Grey)
- ✅ Relations FK correctes maintenues

#### 3. **TYPES ET ENUMS MANQUANTS**
- ✅ **CRÉÉ** Enum `EpicStatus` (Closed, InProgress, Archived)
- ✅ **CRÉÉ** Enum `FeatureStatus` (Ready, InProgress, Draft)
- ✅ **CRÉÉ** Enum `ScenarioType` (Green, Yellow, Grey)

---

## 📋 TÂCHES PRIORITAIRES

### **PHASE 1 : CORRECTION DU MODÈLE DOMAIN**

#### ✅ **DÉJÀ FAIT**
- [x] CreateProject use case avec TDD
- [x] MediatR + CQRS intégré
- [x] Repository pattern (interface)
- [x] Validation sécurisée (HexColorValidator, SecurityValidator)
- [x] 67 tests unitaires passants

#### 🔄 **CORRECTION HIÉRARCHIE DOMAIN - TERMINÉE** ✅

##### 1.1 Corriger la hiérarchie des entités
- ✅ **Project** est maintenant l'entité racine (navigation `Project.Epics`)
- ✅ **Epic** appartient à un Project (`Epic.ProjectId` + `Epic.Project`)
- ✅ Relations FK corrigées : `Epic.ProjectId`, `Feature.EpicId`

##### 1.2 Ajouter les propriétés manquantes
- ✅ `Epic.Status` (EpicStatus enum) - valeur par défaut `InProgress`
- ✅ `Epic.ProjectId` (FK vers Project)
- ✅ `Feature.Status` (FeatureStatus enum) - valeur par défaut `Draft`
- ✅ `Feature.Title` (renommé Name → Title)
- ✅ `Scenario.Type` (ScenarioType enum) - valeur par défaut `Grey`

##### 1.3 Créer les enums
- ✅ `EpicStatus { Closed, InProgress, Archived }`
- ✅ `FeatureStatus { Ready, InProgress, Draft }`
- ✅ `ScenarioType { Green, Yellow, Grey }`

##### 1.4 Tests de validation
- ✅ **3 tests NUnit** créés et passants
- ✅ **67 tests Application** toujours au vert
- ✅ Validation complète de la hiérarchie `Project → Epic → Feature → Scenario`

### **PHASE 2 : MISE À JOUR DES USE CASES**

#### 2.1 Adapter CreateProject
- [ ] Refactorer pour nouvelles propriétés
- [ ] Adapter les tests unitaires
- [ ] Valider la cohérence avec exampleMapping

#### 2.2 Créer les use cases manquants (TDD)
- [ ] **CreateEpic** (avec validation ProjectId existe)
- [ ] **CreateFeature** (avec validation EpicId existe)
- [ ] **CreateScenario** (avec validation FeatureId existe)
- [ ] **GetProjectWithEpics** (navigation complète)
- [ ] **UpdateEpicStatus** (workflow management)
- [ ] **UpdateFeatureStatus** (workflow management)

### **PHASE 3 : REPOSITORY IMPLEMENTATION**

#### 3.1 Créer les repositories manquants
- [ ] `IEpicRepository` + implémentation
- [ ] `IFeatureRepository` + implémentation  
- [ ] `IScenarioRepository` + implémentation

#### 3.2 Tests d'intégration
- [ ] Tests de création avec relations
- [ ] Tests de navigation (Include)
- [ ] Tests de cascade delete

### **PHASE 4 : API ENDPOINTS**

#### 4.1 Controllers REST
- [ ] `ProjectController` (CRUD + relations)
- [ ] `EpicController` (CRUD + status management)
- [ ] `FeatureController` (CRUD + status management)
- [ ] `ScenarioController` (CRUD + type management)

#### 4.2 Endpoints spécifiques
- [ ] `GET /projects/{id}/epics` (hiérarchie complète)
- [ ] `GET /projects/{id}/export` (format exampleMapping)
- [ ] `POST /projects/{id}/epics/{epicId}/status` (workflow)

### **PHASE 5 : MIGRATION ET COHÉRENCE**

#### 5.1 Entity Framework
- [ ] Migrations pour nouvelles propriétés
- [ ] Seeds avec données d'exemple (basé sur exampleMapping.ts)
- [ ] Configuration des relations

#### 5.2 Validation frontend/backend
- [ ] Comparaison des structures JSON
- [ ] Tests end-to-end
- [ ] Documentation des APIs

---

## 🎯 BESOINS EXPRIMÉS INITIALEMENT

### **ANALYSE DEMANDÉE**
> "est ce que mon domain respect bien le fichier exmaple mapping.ts ?"

**✅ RÉPONSE** : Oui ! Les divergences majeures ont été corrigées :
- ✅ Hiérarchie alignée : `Project → Epic → Feature → Scenario`
- ✅ Propriétés essentielles ajoutées (status, enums, relations FK)
- ✅ Structure compatible avec l'ExampleMapping.ts

### **APPROCHE TDD EXIGÉE**
> "je souhaite que tu le fasse pas à pas après l'analyse, en commençant toujours par écrire les tests"
> "il faut une démarche TDD, donc tu me propose un test je valide on le passe au vert puis on le refacto"

**✅ APPLIQUÉ** : Méthodologie TDD stricte maintenue

### **ARCHITECTURE CLEAN**
> "il faut des elément de type use case"
> "il faut injecter le repository correctement"

**✅ IMPLÉMENTÉ** : MediatR + CQRS + Repository pattern + DI

### **SÉCURITÉ**
> "met un truc pour verifier qu'on peut pas faire d'injection malveillante"

**✅ IMPLÉMENTÉ** : SecurityValidator avec protection XSS, SQL injection, etc.

### **REFACTORING PROPRE**
> "ça devrait pouvoir aller dans des classe d'utiliataire ces methode de validation"

**✅ FAIT** : HexColorValidator et SecurityValidator extraits

---

## 🚀 PROCHAINES ÉTAPES SUGGÉRÉES

### **CHOIX 1 : CORRECTION DOMAIN EN PRIORITÉ**
Corriger d'abord les entités Domain pour aligner avec exampleMapping.ts

### **CHOIX 2 : CONTINUER LES USE CASES**
Continuer avec CreateEpic, CreateFeature en gardant la structure actuelle

### **CHOIX 3 : IMPLÉMENTATION REPOSITORY**
Passer aux tests d'intégration et implémentation repository

**RECOMMANDATION** : Commencer par **CHOIX 1** car les divergences sont critiques et impactent toute l'architecture.

---

## 📊 MÉTRIQUES ACTUELLES

- **Tests unitaires** : 70 passants ✅ (+3 nouveaux tests Domain)
- **Couverture use cases** : 1/15+ nécessaires (~7%)
- **Cohérence avec exampleMapping** : ~85% ✅ (divergences critiques corrigées)
- **Architecture** : Solide (MediatR + Clean Architecture) ✅
- **Sécurité** : Validations complètes ✅
- **Hiérarchie Domain** : ✅ **ALIGNÉE avec Frontend**

---

*Dernière mise à jour : 3 août 2025*
*Statut : Analyse complète, prêt pour corrections*

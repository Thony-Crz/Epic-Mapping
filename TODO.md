# TODO - Epic Mapping Project

## Analyse des Divergences avec exampleMapping.ts

### 🔍 DIVERGENCES CRITIQUES IDENTIFIÉES

#### 1. **HIÉRARCHIE INVERSÉE** ❌
- **ExampleMapping.ts** : `Project` → `Epic` → `Feature` → `Scenario`  
- **Domain actuel** : `Epic` → `Project` → `Feature` → `Scenario`

**Impact** : Architecture fondamentalement différente entre frontend et backend

#### 2. **PROPRIÉTÉS MANQUANTES ESSENTIELLES**

##### Dans `Project` :
- ❌ Manque `projectId` (relation vers Epic dans exampleMapping)
- ❌ Manque `status` (closed, in progress, archived)

##### Dans `Epic` :
- ❌ Manque `projectId` (Epic appartient à un Project dans exampleMapping)
- ❌ Manque `status` (closed, in progress, archived)

##### Dans `Feature` :
- ❌ Manque `title` (utilise `name` au lieu de `title`)
- ❌ Manque `status` (ready, in-progress, draft)

##### Dans `Scenario` :
- ❌ Manque `type` (green, yellow, grey)
- ❌ Manque `title` (utilise `title` mais structure différente)

#### 3. **TYPES ET ENUMS MANQUANTS**
- ❌ Enum `EpicStatus` (closed, in progress, archived)
- ❌ Enum `FeatureStatus` (ready, in-progress, draft)
- ❌ Enum `ScenarioType` (green, yellow, grey)

---

## 📋 TÂCHES PRIORITAIRES

### **PHASE 1 : CORRECTION DU MODÈLE DOMAIN**

#### ✅ **DÉJÀ FAIT**
- [x] CreateProject use case avec TDD
- [x] MediatR + CQRS intégré
- [x] Repository pattern (interface)
- [x] Validation sécurisée (HexColorValidator, SecurityValidator)
- [x] 67 tests unitaires passants

#### 🔄 **EN COURS - CORRECTIONS DOMAIN**

##### 1.1 Corriger la hiérarchie des entités
- [ ] **Project** doit devenir l'entité racine (pas Epic)
- [ ] **Epic** appartient à un Project
- [ ] Inverser les relations FK : `Epic.ProjectId` au lieu de `Project.EpicId`

##### 1.2 Ajouter les propriétés manquantes
- [ ] `Project.Status` (si nécessaire selon la logique métier)
- [ ] `Epic.Status` (EpicStatus enum)
- [ ] `Epic.ProjectId` (FK vers Project)
- [ ] `Feature.Status` (FeatureStatus enum)
- [ ] `Feature.Title` (renommer Name → Title)
- [ ] `Scenario.Type` (ScenarioType enum)

##### 1.3 Créer les enums
- [ ] `EpicStatus { Closed, InProgress, Archived }`
- [ ] `FeatureStatus { Ready, InProgress, Draft }`
- [ ] `ScenarioType { Green, Yellow, Grey }`

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

**✅ RÉPONSE** : Non, divergences majeures identifiées ci-dessus

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

- **Tests unitaires** : 67 passants ✅
- **Couverture use cases** : 1/15+ nécessaires (~7%)
- **Cohérence avec exampleMapping** : ~30% (divergences critiques)
- **Architecture** : Solide (MediatR + Clean Architecture) ✅
- **Sécurité** : Validations complètes ✅

---

*Dernière mise à jour : 3 août 2025*
*Statut : Analyse complète, prêt pour corrections*

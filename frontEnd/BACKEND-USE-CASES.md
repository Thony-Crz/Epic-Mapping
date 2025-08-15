# Backend Use Cases - Epic Mapping

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture recommandée](#architecture-recommandée)
3. [Entités principales](#entités-principales)
4. [Use Cases par domaine](#use-cases-par-domaine)
5. [API REST endpoints](#api-rest-endpoints)
6. [Authentification et autorisation](#authentification-et-autorisation)
7. [Gestion des sessions](#gestion-des-sessions)
8. [Stockage et persistance](#stockage-et-persistance)
9. [Règles métier](#règles-métier)
10. [Validation et contraintes](#validation-et-contraintes)

---

## 🎯 Vue d'ensemble

Basé sur l'analyse du frontend SvelteKit, le backend doit supporter un système de gestion d'épiques avec une architecture hexagonale, incluant la gestion des projets, épiques, fonctionnalités, scénarios, utilisateurs et sessions de travail.

### Domaines métier identifiés

- **Project Management** : Gestion des projets
- **Epic Management** : Gestion des épiques
- **Feature Management** : Gestion des fonctionnalités
- **Scenario Management** : Gestion des scénarios
- **Session Management** : Gestion des sessions de travail
- **User Management** : Gestion des utilisateurs et authentification

---

## 🏗️ Architecture recommandée

```
backend/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── value-objects/
│   ├── application/
│   │   ├── use-cases/
│   │   ├── services/
│   │   └── dto/
│   ├── infrastructure/
│   │   ├── repositories/
│   │   ├── database/
│   │   ├── auth/
│   │   └── external-services/
│   └── presentation/
│       ├── controllers/
│       ├── middleware/
│       └── routes/
```

---

## 📊 Entités principales

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  provider: 'local' | 'github' | 'azure' | 'gitlab';
  createdAt: Date;
  updatedAt: Date;
}
```

### Project
```typescript
interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  ownerId: string;
  collaborators: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Epic
```typescript
interface Epic {
  id: string;
  title: string;
  status: 'open' | 'in progress' | 'closed' | 'archived';
  projectId: string;
  features: Feature[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Feature
```typescript
interface Feature {
  id: string;
  title: string;
  status: 'ready' | 'in-progress' | 'todo';
  epicId: string;
  scenarios: Scenario[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Scenario
```typescript
interface Scenario {
  id: string;
  title: string;
  type: 'green' | 'grey' | 'yellow';
  featureId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Session
```typescript
interface Session {
  id: string;
  userId: string;
  startTime: Date;
  durationInMinutes: number;
  isActive: boolean;
  epicId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🎮 Use Cases par domaine

### 👤 User Management

#### Authentication Use Cases
- **RegisterUser**
  - Input: `{ email, password, name }`
  - Output: `{ user, token }`
  - Description: Créer un nouveau compte utilisateur local

- **LoginUser**
  - Input: `{ email, password }`
  - Output: `{ user, token }`
  - Description: Connexion avec email/mot de passe

- **LoginWithProvider**
  - Input: `{ provider, authCode }`
  - Output: `{ user, token }`
  - Description: Connexion OAuth (GitHub, Azure, GitLab)

- **RefreshToken**
  - Input: `{ refreshToken }`
  - Output: `{ accessToken, refreshToken }`
  - Description: Renouveler le token d'accès

- **LogoutUser**
  - Input: `{ userId, token }`
  - Output: `{ success }`
  - Description: Déconnexion et invalidation du token

#### Profile Use Cases
- **GetUserProfile**
  - Input: `{ userId }`
  - Output: `{ user }`
  - Description: Récupérer le profil utilisateur

- **UpdateUserProfile**
  - Input: `{ userId, name?, email? }`
  - Output: `{ user }`
  - Description: Mettre à jour le profil

- **DeleteUserAccount**
  - Input: `{ userId }`
  - Output: `{ success }`
  - Description: Supprimer le compte utilisateur

### 📁 Project Management

#### CRUD Use Cases
- **CreateProject**
  - Input: `{ name, description?, color?, ownerId }`
  - Output: `{ project }`
  - Description: Créer un nouveau projet

- **GetAllUserProjects**
  - Input: `{ userId }`
  - Output: `{ projects }`
  - Description: Récupérer tous les projets d'un utilisateur

- **GetProjectById**
  - Input: `{ projectId, userId }`
  - Output: `{ project }`
  - Description: Récupérer un projet par ID

- **UpdateProject**
  - Input: `{ projectId, userId, name?, description?, color? }`
  - Output: `{ project }`
  - Description: Mettre à jour un projet

- **DeleteProject**
  - Input: `{ projectId, userId }`
  - Output: `{ success }`
  - Description: Supprimer un projet

#### Collaboration Use Cases
- **AddCollaborator**
  - Input: `{ projectId, ownerId, collaboratorEmail }`
  - Output: `{ project }`
  - Description: Ajouter un collaborateur

- **RemoveCollaborator**
  - Input: `{ projectId, ownerId, collaboratorId }`
  - Output: `{ project }`
  - Description: Retirer un collaborateur

- **GetProjectCollaborators**
  - Input: `{ projectId, userId }`
  - Output: `{ collaborators }`
  - Description: Lister les collaborateurs

### 🎯 Epic Management

#### CRUD Use Cases
- **CreateEpic**
  - Input: `{ title, projectId, userId, status? }`
  - Output: `{ epic }`
  - Description: Créer une nouvelle épique

- **GetEpicsByProject**
  - Input: `{ projectId, userId }`
  - Output: `{ epics }`
  - Description: Récupérer les épiques d'un projet

- **GetEpicById**
  - Input: `{ epicId, userId }`
  - Output: `{ epic }`
  - Description: Récupérer une épique par ID

- **UpdateEpic**
  - Input: `{ epicId, userId, title?, status? }`
  - Output: `{ epic }`
  - Description: Mettre à jour une épique

- **DeleteEpic**
  - Input: `{ epicId, userId }`
  - Output: `{ success }`
  - Description: Supprimer une épique

#### Status Management Use Cases
- **ArchiveEpic**
  - Input: `{ epicId, userId }`
  - Output: `{ epic }`
  - Description: Archiver une épique

- **ReactivateEpic**
  - Input: `{ epicId, userId }`
  - Output: `{ epic }`
  - Description: Réactiver une épique archivée

### 🚀 Feature Management

#### CRUD Use Cases
- **CreateFeature**
  - Input: `{ title, epicId, userId, status? }`
  - Output: `{ feature }`
  - Description: Créer une nouvelle fonctionnalité

- **GetFeaturesByEpic**
  - Input: `{ epicId, userId }`
  - Output: `{ features }`
  - Description: Récupérer les fonctionnalités d'une épique

- **GetFeatureById**
  - Input: `{ featureId, userId }`
  - Output: `{ feature }`
  - Description: Récupérer une fonctionnalité par ID

- **UpdateFeature**
  - Input: `{ featureId, userId, title?, status? }`
  - Output: `{ feature }`
  - Description: Mettre à jour une fonctionnalité

- **DeleteFeature**
  - Input: `{ featureId, userId }`
  - Output: `{ success }`
  - Description: Supprimer une fonctionnalité

#### Ordering Use Cases
- **ReorderFeatures**
  - Input: `{ epicId, userId, featureIds }`
  - Output: `{ features }`
  - Description: Réorganiser l'ordre des fonctionnalités

- **MoveFeatureToEpic**
  - Input: `{ featureId, sourceEpicId, targetEpicId, userId }`
  - Output: `{ feature }`
  - Description: Déplacer une fonctionnalité vers une autre épique

### 📝 Scenario Management

#### CRUD Use Cases
- **CreateScenario**
  - Input: `{ title, type, featureId, userId }`
  - Output: `{ scenario }`
  - Description: Créer un nouveau scénario

- **GetScenariosByFeature**
  - Input: `{ featureId, userId }`
  - Output: `{ scenarios }`
  - Description: Récupérer les scénarios d'une fonctionnalité

- **GetScenarioById**
  - Input: `{ scenarioId, userId }`
  - Output: `{ scenario }`
  - Description: Récupérer un scénario par ID

- **UpdateScenario**
  - Input: `{ scenarioId, userId, title?, type? }`
  - Output: `{ scenario }`
  - Description: Mettre à jour un scénario

- **DeleteScenario**
  - Input: `{ scenarioId, userId }`
  - Output: `{ success }`
  - Description: Supprimer un scénario

#### Ordering Use Cases
- **ReorderScenarios**
  - Input: `{ featureId, userId, scenarioIds }`
  - Output: `{ scenarios }`
  - Description: Réorganiser l'ordre des scénarios

- **MoveScenarioToFeature**
  - Input: `{ scenarioId, sourceFeatureId, targetFeatureId, userId }`
  - Output: `{ scenario }`
  - Description: Déplacer un scénario vers une autre fonctionnalité

### ⏱️ Session Management

#### Session Lifecycle Use Cases
- **StartSession**
  - Input: `{ userId, durationInMinutes?, epicId? }`
  - Output: `{ session }`
  - Description: Démarrer une nouvelle session de travail

- **GetActiveSession**
  - Input: `{ userId }`
  - Output: `{ session? }`
  - Description: Récupérer la session active d'un utilisateur

- **UpdateSession**
  - Input: `{ sessionId, userId, epicId? }`
  - Output: `{ session }`
  - Description: Mettre à jour une session (associer à une épique)

- **TerminateSession**
  - Input: `{ sessionId, userId }`
  - Output: `{ session }`
  - Description: Terminer une session manuellement

- **ExtendSession**
  - Input: `{ sessionId, userId, additionalMinutes }`
  - Output: `{ session }`
  - Description: Prolonger une session active

#### Session History Use Cases
- **GetUserSessionHistory**
  - Input: `{ userId, from?, to?, limit?, offset? }`
  - Output: `{ sessions, total }`
  - Description: Historique des sessions d'un utilisateur

- **GetSessionStats**
  - Input: `{ userId, period? }`
  - Output: `{ totalSessions, totalDuration, averageDuration }`
  - Description: Statistiques des sessions

### 📤 Export/Import Use Cases

#### Export Use Cases
- **ExportProject**
  - Input: `{ projectId, userId, format }`
  - Output: `{ exportData, fileName }`
  - Description: Exporter un projet (JSON, XML, etc.)

- **ExportEpic**
  - Input: `{ epicId, userId, format }`
  - Output: `{ exportData, fileName }`
  - Description: Exporter une épique

#### Import Use Cases
- **ImportProject**
  - Input: `{ userId, fileData, format }`
  - Output: `{ project }`
  - Description: Importer un projet

- **ImportEpic**
  - Input: `{ projectId, userId, fileData, format }`
  - Output: `{ epic }`
  - Description: Importer une épique dans un projet

---

## 🌐 API REST Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/login/github
POST   /api/auth/login/azure
POST   /api/auth/login/gitlab
POST   /api/auth/refresh
POST   /api/auth/logout
```

### Users
```
GET    /api/users/profile
PUT    /api/users/profile
DELETE /api/users/account
```

### Projects
```
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
POST   /api/projects/:id/collaborators
DELETE /api/projects/:id/collaborators/:userId
GET    /api/projects/:id/collaborators
```

### Epics
```
GET    /api/projects/:projectId/epics
POST   /api/projects/:projectId/epics
GET    /api/epics/:id
PUT    /api/epics/:id
DELETE /api/epics/:id
POST   /api/epics/:id/archive
POST   /api/epics/:id/reactivate
```

### Features
```
GET    /api/epics/:epicId/features
POST   /api/epics/:epicId/features
GET    /api/features/:id
PUT    /api/features/:id
DELETE /api/features/:id
PUT    /api/epics/:epicId/features/reorder
POST   /api/features/:id/move
```

### Scenarios
```
GET    /api/features/:featureId/scenarios
POST   /api/features/:featureId/scenarios
GET    /api/scenarios/:id
PUT    /api/scenarios/:id
DELETE /api/scenarios/:id
PUT    /api/features/:featureId/scenarios/reorder
POST   /api/scenarios/:id/move
```

### Sessions
```
POST   /api/sessions/start
GET    /api/sessions/active
PUT    /api/sessions/:id
POST   /api/sessions/:id/terminate
POST   /api/sessions/:id/extend
GET    /api/sessions/history
GET    /api/sessions/stats
```

### Export/Import
```
GET    /api/projects/:id/export
POST   /api/projects/import
GET    /api/epics/:id/export
POST   /api/projects/:projectId/epics/import
```

---

## 🔐 Authentification et autorisation

### Stratégies d'authentification
1. **Local** : Email/mot de passe avec hachage bcrypt
2. **OAuth GitHub** : Utilisation de l'API GitHub OAuth
3. **OAuth Azure** : Intégration Azure AD
4. **OAuth GitLab** : Utilisation de l'API GitLab OAuth

### JWT Tokens
- **Access Token** : Durée courte (15 minutes)
- **Refresh Token** : Durée longue (7 jours)
- **Claims** : userId, email, provider, iat, exp

### Autorisations
- **Propriétaire** : Accès total au projet
- **Collaborateur** : Accès lecture/écriture au projet
- **Utilisateur** : Accès uniquement à ses propres données

---

## ⏱️ Gestion des sessions

### Logique métier des sessions
- Une seule session active par utilisateur
- Durée par défaut : 30 minutes
- Durées prédéfinies : 15, 30, 45, 60 minutes
- Durée personnalisée : 1-480 minutes
- Auto-expiration basée sur la durée
- Possibilité de terminer manuellement
- Possibilité d'étendre une session active

### Règles de validation
- Session active = `isActive: true` ET `now < startTime + duration`
- Une session peut être associée à une épique pour le contexte
- Historique conservé pour les statistiques

---

## 💾 Stockage et persistance

### Base de données recommandée
**PostgreSQL** avec les tables suivantes :

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255), -- null for OAuth users
  provider VARCHAR(50) DEFAULT 'local',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7), -- hex color
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Project collaborators (many-to-many)
CREATE TABLE project_collaborators (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);

-- Epics table
CREATE TABLE epics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'open',
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Features table
CREATE TABLE features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'todo',
  epic_id UUID REFERENCES epics(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Scenarios table
CREATE TABLE scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  type VARCHAR(50) NOT NULL,
  feature_id UUID REFERENCES features(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  duration_minutes INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  epic_id UUID REFERENCES epics(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Refresh tokens table
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes pour les performances
```sql
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_epics_project_id ON epics(project_id);
CREATE INDEX idx_features_epic_id ON features(epic_id);
CREATE INDEX idx_scenarios_feature_id ON scenarios(feature_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_active ON sessions(user_id, is_active);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
```

---

## 📋 Règles métier

### Epic Status Transitions
```
open → in progress → closed
   ↓       ↓          ↓
archived ← archived ← archived
```

### Feature Status Logic
- **todo** : État initial
- **in-progress** : Automatique si ajout d'un scénario vert
- **ready** : Marque manuelle

### Scenario Types
- **Green** (🟢) : Scénario nominal/heureux
- **Grey** (⚫) : Scénario alternatif
- **Yellow** (🟡) : Scénario d'erreur/exception

### Session Business Rules
- Un utilisateur ne peut avoir qu'une session active
- Une session expire automatiquement après sa durée
- Une session peut être associée à une épique pour le contexte
- Terminer une session la rend inactive immédiatement

### Authorization Rules
- Seul le propriétaire peut supprimer un projet
- Les collaborateurs peuvent créer/modifier épiques, fonctionnalités, scénarios
- Les utilisateurs ne voient que leurs projets ou ceux où ils sont collaborateurs
- Les sessions sont privées à chaque utilisateur

---

## ✅ Validation et contraintes

### Project Validation
- `name` : Obligatoire, 1-255 caractères
- `description` : Optionnel, max 1000 caractères
- `color` : Optionnel, format hex (#RRGGBB)

### Epic Validation
- `title` : Obligatoire, 1-100 caractères
- `status` : Doit être dans la liste autorisée

### Feature Validation
- `title` : Obligatoire, 1-200 caractères
- `status` : Doit être dans la liste autorisée

### Scenario Validation
- `title` : Obligatoire, 1-500 caractères
- `type` : Doit être 'green', 'grey', ou 'yellow'

### Session Validation
- `durationInMinutes` : Entre 1 et 480 minutes
- Un seul session active par utilisateur
- Session doit appartenir à l'utilisateur authentifié

### User Validation
- `email` : Format email valide, unique
- `name` : Obligatoire, 1-255 caractères
- `password` : Min 8 caractères (pour comptes locaux)

---

## 🚀 Prochaines étapes

1. **Setup Backend** : Choisir la stack technique (Node.js/Express, NestJS, .NET, etc.)
2. **Database Setup** : Configurer PostgreSQL et exécuter les migrations
3. **Authentication** : Implémenter JWT + OAuth providers
4. **Core Use Cases** : Commencer par User Management et Project Management
5. **API Routes** : Implémenter les endpoints REST
6. **Testing** : Tests unitaires et d'intégration
7. **Documentation** : Swagger/OpenAPI documentation
8. **Deployment** : Configuration Docker et CI/CD

Ce document constitue la base pour développer un backend robuste qui supportera parfaitement votre frontend SvelteKit existant.

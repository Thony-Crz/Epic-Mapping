[![CI/CD Pipeline](https://github.com/Thony-Crz/Epic-Mapping/actions/workflows/ci.yml/badge.svg)](https://github.com/Thony-Crz/Epic-Mapping/actions/workflows/ci.yml)

[Demo-Frontend](https://thony-crz.github.io/Epic-Mapping/)

<!-- Language Selection -->
<div align="center">
  🌍 <strong>Language / Langue:</strong> 
  <a href="README.md">🇫🇷 Français</a> | 
  <a href="README.en.md">🇺🇸 English</a>
</div>

---

<div align="center">
  <img src="logo-with-text.svg" alt="Epic Mapping Logo"/>
  <h1>🧭 Epic Mapping - Example Mapping + Azure DevOps Integration</h1>
</div>

## 🚀 Quick Start

```bash
# Start the complete development environment
./scripts/start-dev.sh

# Check services status
./scripts/check-dev.sh

# Stop the environment
./scripts/stop-dev.sh
```

**Available URLs:**
- 🎨 **Frontend**: http://localhost:5173
- 🔧 **API**: http://localhost:8080
- 🏥 **Health Check**: http://localhost:8080/api/Database/health

## 📚 Documentation

👀 **[Check the complete documentation in /Docs/](./Docs/README.md)**

| Guide | Description |
|-------|-------------|
| [**Development Guide**](./Docs/DEVELOPMENT-ENVIRONMENT.md) | 🌟 Complete environment setup |
| [**Docker Guide**](./Docs/README-DOCKER.md) | 🐳 Advanced Docker configuration |
| [**Architecture**](./Docs/ARCHITECTURE.md) | 🏗️ DDD code structure |
| [**Security**](./Docs/SECURITY.md) | 🔒 Security best practices |

## 🎯 Objective

This web application allows you to **model User Story Maps using Example Mapping**, and **automatically generate the corresponding tree structure (Epic, Features, Scenarios) in an Azure DevOps backlog** once the analysis work is completed.

It is **standalone**, does not require installation in Azure DevOps, and works via **REST APIs**.

## 📊 Project Status

**🏗️ Under development** - Foundation architecture in place

### ✅ Completed (Frontend)
- ✅ Complete DDD/Clean Architecture
- ✅ Business entities (Epic, Feature, Scenario, Project)
- ✅ Use Cases organized by functional domain
- ✅ Functional user interface with SvelteKit
- ✅ Drag & drop system for cards
- ✅ Business validation in entities
- ✅ Unit tests for entities (Vitest)
- ✅ E2E tests with Playwright

### 🚧 In Progress (Backend)
- 🚧 Clean Architecture structure created (.NET 9.0)
- 🚧 Domain/Application/Infrastructure projects initialized
- 🚧 Docker configuration ready
- ⏳ Business entities implementation to come
- ⏳ Use Cases and repositories to implement
- ⏳ REST API endpoints to develop
- ⏳ TDD tests to set up

### 📋 To Do
- ⏳ Azure DevOps API integration
- ⏳ Authentication and authorization
- ⏳ Database persistence
- ⏳ Backend/frontend integration tests
- Add a feature for timed example mapping sessions

## 🗺️ Mapping Rules

| Card | Color | Azure DevOps Correspondence |
|-------|---------|------------------------------|
| 🟦 Blue | Epic | Epic |
| 🟨 Yellow | Business Rule | Feature or User Story |
| 🟩 Green | Example | Scenario / Associated Task |
| ⬜ Gray | Question | Blocker (prevents creation until resolved) |

## 💡 Planned Features

### 1. 🏠 Home Page

- List of created **User Story Maps (Epics)**
- **Search bar** to filter existing epics
- Button to **create a new story map**

### 2. 🔍 User Story Map Consultation

- Display of:
  - 🟪 **Epic** (story map name)
  - 🟦 **Business Rules** (Features)
  - 🟩 **Scenarios** (Use cases)
  - ❓ **Open Questions** (editable, post-it style)

- 100% **visual** interface, post-it style for:
  - Drag and drop
  - Edit, add or delete
  - Organize software tree structure

### 3. 🔁 Azure DevOps Generation

- When an epic is **completely defined** (i.e., **no pending questions**), a **button appears**:
  
  `Add to Azure backlog`

- This triggers:
  - Creation of an **Azure DevOps Epic**
  - Automatic generation of **Features** and **Scenarios**
  - Association of hierarchical links
  - Use of Azure DevOps REST API via PAT or OAuth

## 📁 Example Flow

1. You create a new user story map: **"User Registration"**
2. You add:
   - Business rules: "Secure password", "Email validation"
   - Scenarios: "User enters invalid password", etc.
   - Questions: "What types of email are valid?", etc.
3. You finish the analysis (no more open questions)
4. You click **"Add to Azure backlog"**
5. The application creates:
   - An **Epic** "User Registration"
     - **Features** "Secure password", etc.
       - **Scenarios** as tasks or PBIs

## Mockup

![image](https://github.com/user-attachments/assets/7ca75f25-cde6-4177-a05d-1dd8c67b0c1f)

## Screenshots

### Home

![image](https://github.com/user-attachments/assets/d8701d53-46ff-43e3-adf5-388654796cab)

### Epic

![image](https://github.com/user-attachments/assets/f1d6aed0-2d51-47ce-9325-9b070578fcfa)

## ⚙️ Technical Architecture

### 🧠 Philosophy

This project follows a **Software Craftsmanship** approach, with a strong emphasis on **code clarity**, **Test-Driven Development (TDD)**, and **Domain-Driven Design (DDD)** architecture. The goal is to provide a testable, maintainable, and high-quality solution, focused on business modeling and backlog automation.

**Adopted approach:**
- 🎯 **DDD**: Clear Domain/Application/Infrastructure separation
- 🧪 **TDD**: Tests first, high coverage, Red-Green-Refactor cycles
- 🏗️ **Clean Architecture**: Dependencies oriented towards the domain
- ⚡ **Craft**: Expressive code, SOLID principles, continuous refactoring

### 🏗️ Tech Stack

| Layer | Technology | Version | Justification |
|--------|-------------|---------|------------------|
| **Frontend** | [SvelteKit](https://kit.svelte.dev/) | 2.16.0 | Reactive, clean syntax, excellent DX |
| **Backend** | ASP.NET Core WebAPI | .NET 9.0 | Robust, typed, rich ecosystem |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 4.1.11 | Design system, composability |
| **Testing** | Vitest + Playwright + NUnit | Latest | Complete coverage (unit/integration/e2e) |
| **External API** | Azure DevOps REST API | v7.1 | Native Azure integration |

### 📂 Project Architecture

```
Epic-Mapping/
├── 🎨 frontEnd/                    # SvelteKit Application
│   ├── src/
│   │   ├── domain/                 # 🎯 Domain Layer (DDD)
│   │   │   ├── entities/           # Epic, Feature, Scenario, Project
│   │   │   └── repositories/       # Persistence contracts
│   │   ├── features/               # 🚀 Use Cases by domain
│   │   │   ├── epic-management/
│   │   │   ├── feature-management/
│   │   │   ├── project-management/
│   │   │   └── scenario-management/
│   │   ├── infrastructure/         # 🔧 Concrete implementations
│   │   │   └── repositories/       # SvelteEpicRepository
│   │   ├── services/               # 🎼 Application orchestration
│   │   │   ├── EpicService.ts
│   │   │   └── ServiceContainer.ts # DI Container
│   │   ├── ui/components/          # 🎨 UI Components
│   │   └── routes/                 # 🛣️ SvelteKit Pages
│   ├── e2e/                        # 🧪 E2E Tests (Playwright)
│   └── package.json                # Dependencies & scripts
│
├── 🔧 backEnd/                     # .NET 9.0 Clean Architecture
│   ├── EpicMapping.WebApi/         # 🌐 REST API Layer
│   │   ├── Controllers/            # REST endpoints
│   │   ├── Program.cs              # DI + Pipeline config
│   │   └── *.csproj                # Project dependencies
│   ├── src/
│   │   ├── Domain/                 # 🎯 Entities & business rules
│   │   ├── Application/            # 🚀 Use Cases & DTOs
│   │   └── Infrastructure/         # 🔧 DB, Azure DevOps, etc.
│   └── Tests/                      # 🧪 Test Projects
│       ├── Application.UnitTests/
│       ├── Application.IntegrationTests/
│       └── Infrastructure.IntegrationTests/
│      
└── README.md                       # 📖 Main documentation
```

### 🧪 Tests & Quality - TDD/Craft Approach

The project adopts a rigorous **Test-Driven Development (TDD)** approach with a **Clean** architecture promoting testability at all levels.

#### 🎯 Frontend - Implemented DDD Architecture

**✅ Business entities with business rules**
```typescript
// Example: Feature.ts - Business logic in entity
if (this.props.status === 'todo' && scenario.type === 'green') {
  newStatus = 'in-progress'; // Rule: green scenario activates feature
}
```

**✅ Use Cases by domain**
- `epic-management/` : CreateEpic, UpdateEpic, DeleteEpic
- `feature-management/` : AddFeatureToEpic, UpdateFeature, DeleteFeature  
- `scenario-management/` : AddScenarioToFeature, UpdateScenario, DeleteScenario

**✅ Tests in place**
- **Framework** : [Vitest](https://vitest.dev/) for unit tests
- **E2E** : [Playwright](https://playwright.dev/) for user journeys
- **Coverage** : Tests for entities, use cases, and UI components

#### 🔧 Backend - TDD Ready Structure (.NET 9.0)

**🚧 Under implementation**
- **Framework** : [NUnit](https://nunit.org/) + [FluentAssertions](https://fluentassertions.com/)
- **Mocking** : [Moq](https://github.com/moq/moq4) for dependencies
- **Style** : Red-Green-Refactor, unit and integration tests

#### 📊 Testing Strategy

| Test Type | Target | Tools | Status |
|--------------|-------|--------|--------|
| ✅ **Unit Tests** | Entities, Use Cases, Rules | Vitest, NUnit | Frontend ✅ / Backend 🚧 |
| ✅ **Integration Tests** | Repositories, Services | NUnit + TestServer | Frontend ✅ / Backend 🚧 |
| ✅ **E2E Tests** | User journeys | Playwright | Frontend ✅ |
| ⏳ **API Tests** | Azure DevOps integration | NUnit + HttpClient | Coming |

#### 🏗️ Applied Craft Patterns

- **🎯 Single Responsibility** : One use case = one responsibility
- **🔄 Dependency Inversion** : Repositories defined by interfaces
- **📦 Dependency Injection** : Centralized ServiceContainer
- **🧩 CQRS** : Commands/Queries separation
- **🛡️ Fail Fast** : Validation in entity constructors

### 🔐 Authentication

⏳ To implement: Azure AD / OAuth for Azure DevOps integration

### 📦 Storage

**Phase 1 (Current)**
- InMemory with Svelte stores
- Local JSON save
- Story maps import/export (JSON)

**Phase 2 (Planned)**
- SQLite/PostgreSQL database
- Optional cloud sync
- Export to external formats (CSV, Excel)

## 🚀 Quick Start

### Frontend
```bash
cd frontEnd
npm install
npm run dev
```

### Backend (when implemented)
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

# Backend (when implemented)
cd backEnd
dotnet test
```

## 🔁 Future Evolutions

- 🎯 Automatic Gherkin file generation from scenarios
- 👥 Real-time multi-user collaborative interface
- 🔗 Integration with other tools (Jira, Miro, Figma)
- 📊 Analytics and metrics on story maps
- 🤖 AI suggestions for Example Mapping

## 📋 Roadmap

### Phase 1 - MVP ✅ (In progress)
- [x] Frontend DDD architecture
- [x] Epic creation/editing interface
- [x] Card drag & drop
- [x] Frontend tests
- [ ] Backend Clean Architecture
- [ ] Basic REST API
- [ ] Backend tests

### Phase 2 - Azure Integration
- [ ] Azure DevOps API integration
- [ ] OAuth authentication
- [ ] Epic/feature/scenario generation
- [ ] Integration tests

### Phase 3 - Production
- [ ] Cloud deployment
- [ ] Monitoring & logs
- [ ] User documentation
- [ ] Performance optimization

## 🛠️ Useful Commands

```bash
# Frontend - Tests watch mode
npm run test:unit -- --watch

# Frontend - Production build
npm run build

# Backend - Watch mode with hot reload
dotnet watch run

# Backend - Tests with coverage
dotnet test --collect:"XPlat Code Coverage"
```

## 📚 Inspirations & References

- [SpecSync for Azure DevOps](https://specsolutions.eu/specsync/)
- [Azure DevOps REST API](https://learn.microsoft.com/en-us/rest/api/azure/devops/?view=azure-devops-rest-7.1)
- [Example Mapping](https://cucumber.io/blog/bdd/example-mapping-introduction/) - BDD technique
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - Robert C. Martin

---

**Development**: Craft architecture in progress, TDD applied to the maximum, continuous refactoring for code quality.

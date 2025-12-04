# 📚 Documentation Epic Mapping

Ce dossier contient toute la documentation du projet Epic Mapping.

## 🚀 Guides de démarrage

| Guide | Description | Usage |
|-------|-------------|-------|
| [**DEVELOPMENT-ENVIRONMENT.md**](./DEVELOPMENT-ENVIRONMENT.md) | 🌟 **Guide principal** pour démarrer l'environnement complet | **Commencer ici** |
| [**README-DOCKER.md**](./README-DOCKER.md) | Guide spécialisé Docker avec détails techniques | Configuration avancée |

## 🏗️ Architecture et développement

| Document | Description |
|----------|-------------|
| [**ARCHITECTURE.md**](./ARCHITECTURE.md) | Architecture DDD et structure du code |
| [**SECURITY.md**](./SECURITY.md) | Guide de sécurité et bonnes pratiques |
| [**DEV-TOKEN-README.md**](./DEV-TOKEN-README.md) | Tokens de développement pour l'API |

## ☁️ Déploiement

| Document | Description |
|----------|-------------|
| [**RAILWAY-DEPLOYMENT.md**](./RAILWAY-DEPLOYMENT.md) | 🚀 Guide complet de déploiement sur Railway |

## 🤖 Flux Specify obligatoire

1. **Constitution** : lire et respecter `.specify/memory/constitution.md` (Clean Architecture, specs techniques, TDD Red-Green-Refactor, validation par step).
2. **Spec** : créer le spec avec `.specify/templates/spec-template.md` → remplir les sections *Clean Architecture Alignment*, *Technical Specification Details* et *TDD Strategy & Step Sizing*.
3. **Plan** : utiliser `.specify/templates/plan-template.md` pour capturer les engagements par couche et le tableau des steps (`step_size` tiny/small/medium/large).
4. **Tasks** : détailler l'exécution via `.specify/templates/tasks-template.md`, chaque tâche = « step » avec evidence Red/Green/Refactor.
5. **Validation** : l'IA doit proposer le prochain step (description + tests) et attendre ton feu vert avant toute implémentation.

## 🚀 Démarrage rapide

```bash
# Depuis la racine du projet
./scripts/start-dev.sh
```

## 📋 Check-list pour nouveaux développeurs

1. ✅ Lire [DEVELOPMENT-ENVIRONMENT.md](./DEVELOPMENT-ENVIRONMENT.md)
2. ✅ Exécuter `./scripts/start-dev.sh`
3. ✅ Vérifier que les services sont accessibles :
   - Frontend: http://localhost:5173
   - API: http://localhost:8080
   - PgAdmin: http://localhost:8082
4. ✅ Consulter [ARCHITECTURE.md](./ARCHITECTURE.md) pour comprendre le code
5. ✅ Lire [SECURITY.md](./SECURITY.md) pour les bonnes pratiques

## 🛟 Support

- **Problème de démarrage** → [DEVELOPMENT-ENVIRONMENT.md](./DEVELOPMENT-ENVIRONMENT.md#-résolution-de-problèmes)
- **Problème Docker** → [README-DOCKER.md](./README-DOCKER.md#-dépannage)
- **Questions d'architecture** → [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Sécurité** → [SECURITY.md](./SECURITY.md)

---

💡 **Astuce** : Utilisez toujours les scripts dans `/scripts/` pour éviter les problèmes de configuration !

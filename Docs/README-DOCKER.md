# Epic Mapping - Guide Docker

## 🎉 Résumé de la réparation

L'environnement Docker a été complètement réparé et optimisé. Tous les problèmes de connectivité PostgreSQL ont été résolus.

## 🐳 Services Docker

L'application dispose maintenant d'un environnement Docker complet avec :

- **PostgreSQL 16** : Base de données principale
- **API .NET 9.0** : Backend avec health checks
- **PgAdmin 4** : Interface d'administration de base de données
- **Health Checks** : Surveillance automatique des services

## 🚀 Démarrage rapide

### Scripts automatisés (Recommandé)

```bash
# Démarrage complet de l'environnement de développement
../scripts/start-dev.sh

# Ou démarrage uniquement Docker
../scripts/start-docker.sh

# Arrêt de l'environnement
../scripts/stop-dev.sh
```

### Démarrage manuel

```bash
cd ../backEnd/
DOCKER_BUILDKIT=0 docker-compose build
docker-compose up -d
```

### Développement local (mode hybride)

Pour le développement, vous pouvez choisir de lancer seulement PostgreSQL avec Docker et l'API en mode développement :

```bash
# 1. Démarrer seulement PostgreSQL
cd ../backEnd/
docker-compose up postgres -d

# 2. Lancer l'API en mode développement depuis VS Code ou avec :
dotnet run --project EpicMapping.WebApi
```

Cette approche permet un debugging plus facile de l'API tout en gardant PostgreSQL dans Docker.

## 🔍 Vérification de l'état

### URLs des services

- **API** : http://localhost:8080
- **API Health Check** : http://localhost:8080/api/Database/health
- **PgAdmin** : http://localhost:8082
- **PostgreSQL** : localhost:5432

### Commandes utiles

```bash
# État des conteneurs
docker-compose ps

# Logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs web-api

# Test de connectivité PostgreSQL
docker-compose exec postgres pg_isready -U epicmapping_user -d EPICMAPPING

# Test API Health Check
curl http://localhost:8080/api/Database/health
```

## 🔧 Configuration

### Base de données

- **Host** : postgres (interne) / localhost:5432 (externe)
- **Database** : EPICMAPPING
- **User** : epicmapping_user
- **Password** : epicmapping_password

### PgAdmin

- **Email** : admin@epicmapping.com
- **Password** : admin123

## 🛠️ Corrections apportées

### 1. Docker Compose
- Ajout des health checks pour PostgreSQL et l'API
- Configuration correcte des dépendances entre services
- Résolution des problèmes de réseau Docker
- Configuration de JWT_SECRET_KEY

### 2. Dockerfile
- Installation de curl pour les health checks
- Optimisation du build multi-stage
- Résolution des problèmes de BuildKit

### 3. Scripts d'automatisation
- Script de démarrage complet avec vérifications
- Gestion d'erreurs robuste
- Logs colorés et informatifs
- Tests de connectivité automatiques

### 4. Résolution des problèmes réseau
- Configuration correcte du réseau Docker
- Connectivité entre les conteneurs
- Exposition des ports appropriés

## 📝 Health Checks

Les services disposent de health checks automatiques :

### PostgreSQL
```bash
pg_isready -U epicmapping_user -d EPICMAPPING
```

### API .NET
```bash
curl -f http://localhost:8080/api/Database/health
```

## 🔄 Workflow de développement

1. **Démarrage** : `../scripts/start-dev.sh`
2. **Développement** : Modification du code frontend/backend
3. **Tests** : Utilisation des health checks
4. **Arrêt** : `../scripts/stop-dev.sh`

## 🚨 Dépannage

### Problèmes courants

**Erreur "Cannot connect to database"**
```bash
# Vérifier l'état des conteneurs
docker-compose ps

# Vérifier les logs
docker-compose logs postgres
docker-compose logs web-api
```

**Port déjà utilisé**
```bash
# Arrêter tous les services
docker-compose down

# Vérifier les ports
sudo netstat -tlnp | grep :8080
```

**Problème de build**
```bash
# Rebuild complet
docker-compose down
docker system prune -f
DOCKER_BUILDKIT=0 docker-compose build --no-cache
```

## 📊 Monitoring

Les scripts fournis incluent :
- Vérification automatique de l'état des services
- Tests de connectivité
- Affichage des logs en cas d'erreur
- Timeout configurable pour les health checks

## 🎯 Prochaines étapes

1. Configuration de l'environnement de production
2. Ajout de tests d'intégration automatisés
3. Configuration CI/CD avec Docker
4. Optimisation des images Docker pour la production

---

L'environnement Docker est maintenant pleinement fonctionnel et prêt pour le développement ! 🚀

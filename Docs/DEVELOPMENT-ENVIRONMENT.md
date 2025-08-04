# Epic Mapping - Guide de l'Environnement de Développement

Ce guide vous aide à démarrer et gérer l'environnement de développement complet (Frontend + Backend).

## 🚀 Démarrage Rapide

```bash
# Démarrage de l'environnement complet
./scripts/start-dev.sh
```

Ce script va :
- ✅ Nettoyer les conteneurs et réseaux orphelins
- ✅ Démarrer PostgreSQL avec les bonnes configurations
- ✅ Construire et démarrer l'API backend
- ✅ Vérifier la connectivité de la base de données
- ✅ Installer les dépendances npm si nécessaire
- ✅ Démarrer le serveur de développement frontend (Vite)
- ✅ Vérifier que tous les services sont accessibles

## 🛑 Arrêt Complet

```bash
# Arrêter tous les services
./scripts/stop-dev.sh
```

## 🔍 Vérification de l'État

```bash
# Vérifier l'état des services
./scripts/check-dev.sh
```

## 🌐 URLs de Développement

- **🎨 Frontend**: http://localhost:5173 (SvelteKit + Vite)
- **🔧 API**: http://localhost:8080 (.NET Core)
- **🏥 Health Check**: http://localhost:8080/api/Database/health
- **🗄️ PgAdmin**: http://localhost:8082
  - Email: admin@epicmapping.com
  - Mot de passe: admin123

## 🐛 Résolution de Problèmes

### Problème : "Cannot connect to database"

**Cause**: Les conteneurs sont sur des réseaux Docker différents ou problème de timing

**Solution**:
```bash
# Redémarrer proprement l'environnement
./scripts/stop-dev.sh
./scripts/start-dev.sh
```

### Problème : Frontend non accessible

**Solutions**:
1. Vérifier les logs: `tail -f frontend.log`
2. Vérifier que npm/Node.js est installé
3. Vérifier les dépendances: `cd frontEnd && npm install`

### Vérification Manuelle des Services

```bash
# Voir tous les conteneurs Epic Mapping
docker ps --filter "name=epicmapping"

# Vérifier les réseaux
docker network ls --filter "name=epicmapping"

# Logs des services
docker logs epicmapping-api
docker logs epicmapping-postgres
tail -f frontend.log
```

## ⚡ Scripts Disponibles

| Script | Description |
|--------|-------------|
| `./scripts/start-dev.sh` | Démarrage complet de l'environnement de développement |
| `./scripts/stop-dev.sh` | Arrêt complet de tous les services |
| `./scripts/check-dev.sh` | Diagnostic complet de l'état des services |

## 📋 Commandes Docker Utiles

```bash
# Redémarrer un service spécifique
docker restart epicmapping-api
docker restart epicmapping-postgres

# Nettoyer complètement (attention: supprime les données)
docker-compose down --remove-orphans --volumes
docker system prune -f

# Reconstruire l'API
cd backEnd
docker build -t epicmapping-api .
```

## 🔧 Configuration

### Variables d'Environnement Backend

- `ConnectionStrings__DefaultConnection`: Chaîne de connexion PostgreSQL
- `JWT_SECRET_KEY`: Clé secrète pour JWT (minimum 32 caractères)

### Ports Utilisés

- **5173**: Frontend (Vite dev server)
- **8080**: API Backend
- **5432**: PostgreSQL
- **8082**: PgAdmin (optionnel)

## 🚨 Points d'Attention

1. **Toujours utiliser les scripts** dans `/scripts/` pour éviter les conflits réseau
2. **Ne pas mélanger** `docker run` manuel et les scripts
3. **Vérifier les logs** en cas de problème avant de redémarrer
4. **S'assurer que les ports sont libres** avant de démarrer

## 💡 Bonnes Pratiques de Développement

1. **Démarrer l'environnement** avec `./scripts/start-dev.sh`
2. **Vérifier l'état** avec `./scripts/check-dev.sh` en cas de doute
3. **Arrêter proprement** avec `./scripts/stop-dev.sh` avant d'éteindre
4. **Consulter les logs** pour diagnostiquer les problèmes
5. **Nettoyer régulièrement** avec `docker system prune` (hors développement actif)

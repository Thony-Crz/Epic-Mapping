# Configuration PostgreSQL pour Epic Mapping

## Description

Cette configuration Docker permet de déployer l'application Epic Mapping avec une base de données PostgreSQL.

## Prérequis

- Docker
- Docker Compose

## Configuration

### Base de données

- **Nom de la BDD** : `EPICMAPPING`
- **Utilisateur** : `epicmapping_user`
- **Mot de passe** : `epicmapping_password`
- **Port** : `5432`

### Services

- **PostgreSQL** : Port 5432
- **API** : Ports 8080 (HTTP) et 8081 (HTTPS)

## Démarrage

### Développement local (sans Docker)

1. Démarrer seulement PostgreSQL :
   ```bash
   docker-compose up postgres -d
   ```

2. Lancer l'API en mode développement depuis VS Code ou avec :
   ```bash
   dotnet run --project EpicMapping.WebApi
   ```

### Démarrage complet avec Docker

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

## Migrations Entity Framework

### Utilisation du script (Recommandé)

Un script bash `ef-migrations.sh` est fourni pour simplifier la gestion des migrations :

```bash
# Rendre le script exécutable (une seule fois)
chmod +x ef-migrations.sh

# Ajouter une migration
./ef-migrations.sh add InitialCreate

# Appliquer les migrations
./ef-migrations.sh update

# Voir le statut des migrations
./ef-migrations.sh status

# Lister les migrations
./ef-migrations.sh list

# Supprimer la dernière migration (si pas encore appliquée)
./ef-migrations.sh remove

# Réinitialiser complètement (supprime toutes les migrations)
./ef-migrations.sh reset

# Afficher l'aide
./ef-migrations.sh help
```

### Commandes manuelles Entity Framework

### Ajouter une migration

```bash
# Depuis le dossier backEnd
dotnet ef migrations add InitialCreate --project src/Infrastructure --startup-project EpicMapping.WebApi
```

### Appliquer les migrations

```bash
# Depuis le dossier backEnd
dotnet ef database update --project src/Infrastructure --startup-project EpicMapping.WebApi
```

### Supprimer la dernière migration (si pas encore appliquée)

```bash
# Depuis le dossier backEnd
dotnet ef migrations remove --project src/Infrastructure --startup-project EpicMapping.WebApi
```

## Connexion à la base de données

### Via ligne de commande

```bash
# Se connecter au conteneur PostgreSQL
docker exec -it epicmapping-postgres psql -U epicmapping_user -d EPICMAPPING
```

### Via un client PostgreSQL

- **Host** : localhost
- **Port** : 5432
- **Database** : EPICMAPPING
- **Username** : epicmapping_user
- **Password** : epicmapping_password

## Structure des données

Les données PostgreSQL sont persistées dans un volume Docker nommé `postgres_data`.

## Sécurité

⚠️ **Important** : Les mots de passe dans cette configuration sont à des fins de développement uniquement. 
En production, utilisez des variables d'environnement sécurisées.

## Troubleshooting

### Port déjà utilisé

Si le port 5432 est déjà utilisé, modifiez le dans `docker-compose.yml` :

```yaml
services:
  postgres:
    ports:
      - "5433:5432"  # Utilise le port 5433 sur l'hôte
```

N'oubliez pas de mettre à jour la chaîne de connexion dans `appsettings.json`.

### Réinitialiser la base de données

```bash
# Arrêter les services
docker-compose down

# Supprimer le volume de données
docker volume rm epic-mapping_postgres_data

# Redémarrer
docker-compose up -d
```

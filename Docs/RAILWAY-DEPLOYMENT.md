# 🚀 Guide de Déploiement Railway - Epic Mapping

Ce guide détaille la configuration et le déploiement complet de l'application Epic Mapping sur Railway.

## 📋 Table des matières

1. [Pourquoi Railway ?](#pourquoi-railway-)
2. [Prérequis](#prérequis)
3. [Architecture de déploiement](#architecture-de-déploiement)
4. [Étape 1 : Création du projet Railway](#étape-1--création-du-projet-railway)
5. [Étape 2 : Configuration de la base de données PostgreSQL](#étape-2--configuration-de-la-base-de-données-postgresql)
6. [Étape 3 : Déploiement du Backend .NET](#étape-3--déploiement-du-backend-net)
7. [Étape 4 : Déploiement du Frontend SvelteKit](#étape-4--déploiement-du-frontend-sveltekit)
8. [Étape 5 : Configuration des variables d'environnement](#étape-5--configuration-des-variables-denvironnement)
9. [Étape 6 : Configuration du domaine personnalisé](#étape-6--configuration-du-domaine-personnalisé)
10. [Dépannage](#dépannage)
11. [Bonnes pratiques](#bonnes-pratiques)

---

## Pourquoi Railway ?

Railway est une plateforme cloud moderne qui supporte nativement :
- ✅ **.NET / ASP.NET Core** - Notre backend
- ✅ **Node.js / SvelteKit** - Notre frontend
- ✅ **PostgreSQL** - Notre base de données
- ✅ **Docker** - Déploiement containerisé
- ✅ **Déploiement automatique** depuis GitHub
- ✅ **Variables d'environnement** sécurisées
- ✅ **Domaines personnalisés** avec SSL automatique

> 💡 **Note :** Vercel ne supporte ni .NET ni Ruby. Railway est une excellente alternative pour les stacks polyglotales.

---

## Prérequis

Avant de commencer, assurez-vous d'avoir :

1. **Un compte Railway** - [Créer un compte](https://railway.app/)
2. **Le dépôt GitHub** lié à votre compte Railway
3. **Railway CLI** (optionnel mais recommandé) :
   ```bash
   npm install -g @railway/cli
   railway login
   ```

---

## Architecture de déploiement

```
┌─────────────────────────────────────────────────────────────┐
│                     Railway Project                         │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │    Frontend     │  │     Backend     │  │  PostgreSQL │ │
│  │   (SvelteKit)   │  │  (.NET 9 API)   │  │   Database  │ │
│  │    Port 80      │  │    Port 8080    │  │  Port 5432  │ │
│  └────────┬────────┘  └────────┬────────┘  └──────┬──────┘ │
│           │                    │                   │        │
│           │                    └───────────────────┘        │
│           │                    (Internal Connection)        │
│           │                                                 │
│           ▼                    ▼                            │
│    epicmapping.up.railway.app  api.epicmapping.up.railway.app│
└─────────────────────────────────────────────────────────────┘
```

---

## Étape 1 : Création du projet Railway

### Via l'interface web

1. Connectez-vous sur [railway.app](https://railway.app/)
2. Cliquez sur **"New Project"**
3. Sélectionnez **"Empty Project"**
4. Nommez votre projet : `epic-mapping`

### Via Railway CLI

```bash
# Se connecter à Railway
railway login

# Créer un nouveau projet
railway init

# Suivre les instructions pour nommer le projet
```

---

## Étape 2 : Configuration de la base de données PostgreSQL

### 2.1 Ajouter PostgreSQL au projet

1. Dans votre projet Railway, cliquez sur **"+ New"**
2. Sélectionnez **"Database"**
3. Choisissez **"PostgreSQL"**
4. Railway va automatiquement provisionner une instance PostgreSQL

### 2.2 Récupérer les informations de connexion

Une fois PostgreSQL déployé :

1. Cliquez sur le service PostgreSQL
2. Allez dans l'onglet **"Variables"**
3. Notez les variables suivantes (elles seront automatiquement disponibles) :
   - `DATABASE_URL` - URL de connexion complète
   - `PGHOST` - Hôte
   - `PGPORT` - Port
   - `PGUSER` - Utilisateur
   - `PGPASSWORD` - Mot de passe
   - `PGDATABASE` - Nom de la base

> 💡 Railway génère automatiquement ces variables. Vous pouvez les référencer dans d'autres services.

---

## Étape 3 : Déploiement du Backend .NET

### 3.1 Ajouter le service Backend

1. Cliquez sur **"+ New"** dans votre projet
2. Sélectionnez **"GitHub Repo"**
3. Choisissez votre dépôt `Epic-Mapping`
4. Railway détectera automatiquement le Dockerfile

### 3.2 Configuration du service

1. Cliquez sur le service créé
2. Allez dans **"Settings"**
3. Configurez :
   - **Root Directory** : `backEnd`
   - **Watch Paths** : `backEnd/**`

### 3.3 Variables d'environnement Backend

Allez dans l'onglet **"Variables"** et ajoutez :

```env
# Connexion à la base de données (utilise la variable Railway)
ConnectionStrings__DefaultConnection=Host=${{Postgres.PGHOST}};Port=${{Postgres.PGPORT}};Database=${{Postgres.PGDATABASE}};Username=${{Postgres.PGUSER}};Password=${{Postgres.PGPASSWORD}}

# Configuration JWT (générez une clé sécurisée)
JWT_SECRET_KEY=VotreCleSecreteTresLongueAuMoins32Caracteres!

# Environnement
ASPNETCORE_ENVIRONMENT=Production

# Port (Railway définit automatiquement $PORT)
ASPNETCORE_URLS=http://0.0.0.0:$PORT

# GitHub OAuth (optionnel)
GITHUB_CLIENT_ID=votre-client-id
GITHUB_CLIENT_SECRET=votre-client-secret
GITHUB_REDIRECT_URI=https://votre-domaine.up.railway.app/auth/callback
```

### 3.4 Modification du Dockerfile Backend pour Railway

Le Dockerfile existant fonctionne avec Railway. Assurez-vous qu'il expose le bon port :

```dockerfile
# Dans backEnd/Dockerfile, Railway utilise la variable $PORT
ENV ASPNETCORE_URLS=http://+:${PORT:-8080}
```

### 3.5 Générer un domaine public

1. Allez dans **"Settings"** du service backend
2. Dans la section **"Networking"**, cliquez sur **"Generate Domain"**
3. Vous obtiendrez une URL comme : `epicmapping-api-production.up.railway.app`

---

## Étape 4 : Déploiement du Frontend SvelteKit

### 4.1 Ajouter le service Frontend

1. Cliquez sur **"+ New"** dans votre projet
2. Sélectionnez **"GitHub Repo"**
3. Choisissez le même dépôt `Epic-Mapping`

### 4.2 Configuration du service

1. Cliquez sur le service créé
2. Allez dans **"Settings"**
3. Configurez :
   - **Root Directory** : `frontEnd`
   - **Watch Paths** : `frontEnd/**`

### 4.3 Variables d'environnement Frontend

Allez dans l'onglet **"Variables"** et ajoutez :

```env
# URL de l'API backend (utilise le domaine généré pour le backend)
PUBLIC_API_URL=https://epicmapping-api-production.up.railway.app

# Mode production
NODE_ENV=production
```

### 4.4 Générer un domaine public

1. Allez dans **"Settings"** du service frontend
2. Dans la section **"Networking"**, cliquez sur **"Generate Domain"**
3. Vous obtiendrez une URL comme : `epicmapping-production.up.railway.app`

---

## Étape 5 : Configuration des variables d'environnement

### 5.1 Variables partagées

Railway permet de créer des variables partagées entre services :

1. Allez dans les paramètres du projet
2. Section **"Shared Variables"**
3. Ajoutez les variables communes

### 5.2 Référencement entre services

Pour référencer une variable d'un autre service :

```env
# Dans le frontend, référencer le backend
API_URL=${{backend.RAILWAY_PUBLIC_DOMAIN}}
```

### 5.3 Variables secrètes

Pour les secrets comme les clés API :

1. Ne jamais commiter les secrets dans le code
2. Utilisez les variables Railway
3. Préfixez avec `PRIVATE_` pour les masquer dans les logs

---

## Étape 6 : Configuration du domaine personnalisé

### 6.1 Ajouter un domaine personnalisé

1. Allez dans **"Settings"** du service
2. Section **"Networking"**
3. Cliquez sur **"Custom Domain"**
4. Entrez votre domaine : `app.votredomaine.com`

### 6.2 Configuration DNS

Ajoutez un enregistrement CNAME chez votre registrar DNS :

```
Type: CNAME
Nom: app
Valeur: <votre-service>.up.railway.app
TTL: 3600
```

### 6.3 SSL automatique

Railway génère et renouvelle automatiquement les certificats SSL Let's Encrypt.

---

## Dépannage

### Le build échoue

```bash
# Vérifiez les logs de build dans Railway
# Ou localement :
cd backEnd && docker build -t test .
cd frontEnd && docker build -t test .
```

### La base de données n'est pas accessible

1. Vérifiez que PostgreSQL est bien démarré (indicateur vert)
2. Vérifiez les variables de connexion
3. Testez la connexion :
   ```bash
   railway connect postgres
   ```

### Le frontend ne se connecte pas au backend

1. Vérifiez que `PUBLIC_API_URL` est correctement définie
2. Vérifiez les CORS dans le backend
3. Vérifiez que le backend a un domaine public

### Logs et debugging

```bash
# Via Railway CLI
railway logs

# Ou via l'interface web
# Cliquez sur le service > Onglet "Logs"
```

---

## Bonnes pratiques

### 1. Branches et environnements

Railway supporte les environnements par branche :

- `main` → Production
- `develop` → Staging
- `feature/*` → Review apps

### 2. Healthchecks

Configurez des healthchecks pour vos services :

```env
RAILWAY_HEALTHCHECK_TIMEOUT=300
RAILWAY_HEALTHCHECK_PATH=/api/Database/health
```

### 3. Scaling

Pour augmenter les ressources :

1. Allez dans **"Settings"** du service
2. Ajustez **"Memory"** et **"CPU"**
3. Configurez **"Replicas"** pour la haute disponibilité

### 4. Backups

Railway effectue des backups automatiques de PostgreSQL :

1. Allez dans le service PostgreSQL
2. Onglet **"Backups"**
3. Configurez la fréquence et la rétention

### 5. Monitoring

Utilisez les métriques Railway :

1. Onglet **"Metrics"** de chaque service
2. CPU, Mémoire, Réseau en temps réel
3. Configurez des alertes si nécessaire

---

## 📦 Résumé des commandes Railway CLI

```bash
# Connexion
railway login

# Initialiser un projet
railway init

# Lier un projet existant
railway link

# Voir les logs
railway logs

# Ouvrir le dashboard
railway open

# Définir une variable
railway variables set KEY=value

# Connexion à la base de données
railway connect postgres

# Déployer manuellement
railway up

# Voir le statut
railway status
```

---

## 🔗 Liens utiles

- [Documentation Railway](https://docs.railway.app/)
- [Railway Templates](https://railway.app/templates)
- [Railway Discord](https://discord.gg/railway)
- [Status Railway](https://status.railway.app/)

---

## 📞 Support

En cas de problème :

1. Consultez la [documentation officielle](https://docs.railway.app/)
2. Rejoignez le [Discord Railway](https://discord.gg/railway)
3. Ouvrez une issue sur le dépôt GitHub du projet

---

**Bonne chance pour votre déploiement ! 🚀**

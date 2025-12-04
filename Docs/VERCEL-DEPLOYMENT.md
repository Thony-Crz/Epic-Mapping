# 🚀 Déploiement sur Vercel - Epic Mapping

Ce guide explique comment déployer Epic Mapping sur Vercel avec une configuration complète et la persistance des données.

## 📋 Architecture de Déploiement

Epic Mapping utilise une architecture séparée :
- **Frontend (SvelteKit)** : Déployé sur **Vercel**
- **Backend (.NET API)** : Déployé sur **Railway** ou **Azure** (Vercel ne supporte pas .NET)
- **Base de données (PostgreSQL)** : Hébergée sur **Railway**, **Supabase** ou **Neon**

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Vercel      │────▶│    Railway/     │────▶│   PostgreSQL    │
│   (Frontend)    │     │  Azure (API)    │     │  (Persistence)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 🔧 Étape 1 : Configuration de la Base de Données

### Option A : Railway (Recommandé)

1. Créez un compte sur [Railway](https://railway.app/)
2. Créez un nouveau projet → Add PostgreSQL
3. Copiez la `DATABASE_URL` depuis l'onglet "Connect"

### Option B : Supabase

1. Créez un projet sur [Supabase](https://supabase.com/)
2. Allez dans Settings → Database
3. Copiez la "Connection string"

### Option C : Neon

1. Créez un projet sur [Neon](https://neon.tech/)
2. Copiez la connection string depuis le dashboard

## 🔧 Étape 2 : Déploiement du Backend (.NET API)

### Sur Railway

1. Connectez votre repository GitHub à Railway
2. Configurez le root directory : `backEnd`
3. Ajoutez les variables d'environnement :

```env
# Base de données
ConnectionStrings__DefaultConnection=postgresql://user:password@host:port/database

# JWT
JWT_SECRET_KEY=votre-cle-secrete-jwt-minimum-32-caracteres

# GitHub OAuth
GITHUB_CLIENT_ID=votre-github-client-id
GITHUB_CLIENT_SECRET=votre-github-client-secret
GITHUB_REDIRECT_URI=https://votre-app.vercel.app/auth/callback

# Admin
ADMIN_GITHUB_ID=votre-github-user-id

# Production
ASPNETCORE_ENVIRONMENT=Production
```

4. Railway déploiera automatiquement avec le Dockerfile

### Sur Azure Container Apps

1. Créez une Azure Container App
2. Configurez le déploiement depuis GitHub Actions
3. Ajoutez les mêmes variables d'environnement

## 🔧 Étape 3 : Déploiement du Frontend sur Vercel

### Configuration Automatique

1. Allez sur [Vercel](https://vercel.com/)
2. Importez votre repository GitHub
3. Configurez :
   - **Framework Preset** : SvelteKit
   - **Root Directory** : `frontEnd`
   - **Build Command** : `npm run build`
   - **Output Directory** : `.vercel/output`

### Variables d'Environnement Vercel

Ajoutez ces variables dans Vercel → Settings → Environment Variables :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `VITE_API_BASE_URL` | `https://votre-api.railway.app` | URL de l'API backend |

### Configuration GitHub OAuth

Mettez à jour votre application GitHub OAuth :
1. Allez sur https://github.com/settings/developers
2. Modifiez votre OAuth App
3. Ajoutez l'URL de callback Vercel : `https://votre-app.vercel.app/auth/callback`

## 🔐 Variables d'Environnement - Récapitulatif

### Frontend (Vercel)

```env
VITE_API_BASE_URL=https://votre-api.railway.app
```

### Backend (Railway/Azure)

```env
# Obligatoire
ConnectionStrings__DefaultConnection=postgresql://...
JWT_SECRET_KEY=cle-secrete-32-caracteres-minimum
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
GITHUB_REDIRECT_URI=https://votre-app.vercel.app/auth/callback
ADMIN_GITHUB_ID=12345678

# Optionnel - SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=mot-de-passe-application
```

## 📊 Persistance des Données

### Migrations Entity Framework

Les migrations sont appliquées automatiquement au démarrage de l'API. Pour les appliquer manuellement :

```bash
# Depuis le dossier backEnd
dotnet ef database update --project src/Infrastructure --startup-project EpicMapping.WebApi
```

### Données Persistantes

Les données suivantes sont persistées en base :
- ✅ Utilisateurs et rôles
- ✅ Événements d'audit d'export
- ✅ Configuration des sessions

### Backup

Railway et Supabase offrent des backups automatiques. Pour une configuration manuelle :

```bash
# Export PostgreSQL
pg_dump $DATABASE_URL > backup.sql

# Import
psql $DATABASE_URL < backup.sql
```

## 🔄 CI/CD avec GitHub Actions

Le workflow CI/CD existant déploie automatiquement sur GitHub Pages. Pour ajouter Vercel :

1. Connectez Vercel à votre repository
2. Vercel détectera automatiquement les commits et déploiera

Ou utilisez le Vercel CLI dans GitHub Actions :

```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.ORG_ID }}
    vercel-project-id: ${{ secrets.PROJECT_ID }}
    working-directory: ./frontEnd
```

## 🧪 Vérification du Déploiement

1. **Frontend** : `https://votre-app.vercel.app`
2. **API Health** : `https://votre-api.railway.app/api/Database/health`
3. **OAuth Flow** : Testez la connexion GitHub

## 🐛 Dépannage

### Erreur CORS

Le frontend Vercel communique directement avec l'API backend. Vous devez configurer CORS sur le backend :

**Via appsettings.json :**
```json
{
  "Security": {
    "AllowedOrigins": [
      "https://votre-app.vercel.app",
      "http://localhost:5173"
    ]
  }
}
```

**Via variables d'environnement (recommandé pour production) :**
```env
Security__AllowedOrigins__0=https://votre-app.vercel.app
Security__AllowedOrigins__1=http://localhost:5173
```

### Erreur de connexion à la base

1. Vérifiez que la variable `ConnectionStrings__DefaultConnection` est correcte
2. Vérifiez que l'IP de Railway est autorisée sur votre base

### OAuth Callback Error

1. Vérifiez `GITHUB_REDIRECT_URI` dans le backend
2. Vérifiez l'URL de callback dans les settings de l'app GitHub OAuth

## 📚 Ressources

- [Documentation SvelteKit Vercel](https://kit.svelte.dev/docs/adapter-vercel)
- [Railway Docs](https://docs.railway.app/)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

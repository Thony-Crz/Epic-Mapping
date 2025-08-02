# 🔒 Guide de Sécurité - Epic Mapping API

## Vue d'ensemble

Ce guide explique comment configurer et utiliser l'API Epic Mapping de manière sécurisée, en particulier pour un repository public sur GitHub.

## 🛡️ Mesures de Sécurité Implémentées

### 1. **Gestion des Secrets**
- ❌ **Plus de secrets hardcodés** dans le code source
- ✅ **Variables d'environnement** pour tous les secrets
- ✅ **Configuration par environnement** (dev/prod)
- ✅ **Fichiers .gitignore** mis à jour

### 2. **Authentification JWT Renforcée**
- ✅ **Clés de chiffrement sécurisées** (minimum 32 caractères)
- ✅ **Validation complète des tokens** (issuer, audience, lifetime)
- ✅ **Claims enrichis** avec informations de sécurité
- ✅ **Expiration configurable** des tokens

### 3. **Protection contre les Attaques**
- ✅ **Rate Limiting** (limitation du nombre de requêtes)
- ✅ **Délais anti-brute force** sur les échecs d'authentification
- ✅ **Headers de sécurité** (XSS, CSRF, etc.)
- ✅ **CORS configuré** pour les domaines autorisés

### 4. **Middleware de Sécurité**
- ✅ **Logging des tentatives d'authentification**
- ✅ **Gestion centralisée des erreurs**
- ✅ **Validation des entrées** avec FluentValidation

## 🚀 Configuration Rapide

### Étape 1: Variables d'Environnement

Copiez le fichier `.env.example` vers `.env` et configurez vos secrets :

```bash
cp .env.example .env
```

```env
# JWT Configuration
JWT_SECRET_KEY=votre-cle-secrete-jwt-doit-faire-au-moins-32-caracteres-pour-etre-securisee

# Azure AD Configuration (optionnel)
AZURE_CLIENT_ID=votre-azure-client-id
AZURE_CLIENT_SECRET=votre-azure-client-secret
AZURE_TENANT_ID=votre-azure-tenant-id
```

### Étape 2: Configuration des Fichiers

1. **appsettings.json** : Configuration de base (sans secrets)
2. **appsettings.Development.json** : Configuration pour le développement
3. **appsettings.Production.json** : Configuration pour la production (créez ce fichier)

### Étape 3: Démarrage

```bash
cd backEnd
dotnet run --project EpicMapping.WebApi
```

## 🔧 Configuration Avancée

### Rate Limiting

```json
{
  "Security": {
    "RateLimiting": {
      "RequestsPerMinute": 60,        // Requêtes générales par minute
      "TokenRequestsPerMinute": 10    // Requêtes d'authentification par minute
    }
  }
}
```

### CORS

```json
{
  "Security": {
    "AllowedOrigins": [
      "https://localhost:5173",
      "https://votre-domaine.com"
    ]
  }
}
```

## 🧪 Test de l'API

### 1. Obtenir un Token

```bash
curl -X POST "https://localhost:7000/api/token/login" \
     -H "Content-Type: application/json" \
     -d '{
       "username": "admin",
       "password": "password"
     }'
```

### 2. Utiliser le Token

```bash
curl -X GET "https://localhost:7000/api/weatherforecast" \
     -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

## 🔒 Meilleures Pratiques

### Pour le Développement
1. ✅ Utilisez `appsettings.Development.json` avec des clés de test
2. ✅ N'exposez jamais vos vrais secrets dans le code
3. ✅ Testez régulièrement vos endpoints d'authentification

### Pour la Production
1. ✅ **OBLIGATOIRE** : Configurez toutes les variables d'environnement
2. ✅ Utilisez HTTPS uniquement (`"RequireHttps": true`)
3. ✅ Réduisez les limites de rate limiting si nécessaire
4. ✅ Configurez les logs pour surveiller les tentatives d'attaque

### Pour un Repository Public
1. ✅ **Jamais de secrets** dans les fichiers versionnés
2. ✅ Utilisez `appsettings.example.json` comme template
3. ✅ Documentez clairement la configuration requise
4. ✅ Ajoutez `.env*` dans `.gitignore`

## ⚠️ Alertes de Sécurité

### ❌ À NE JAMAIS FAIRE
- Commiter des fichiers `.env` ou avec des secrets
- Utiliser des clés JWT trop courtes (< 32 caractères)
- Désactiver HTTPS en production
- Ignorer les logs d'erreurs d'authentification

### ✅ À TOUJOURS FAIRE
- Changer les mots de passe par défaut
- surveiller les tentatives d'authentification échouées
- Maintenir les dépendances à jour
- Utiliser des mots de passe forts

## 🆘 Dépannage

### Erreur "JWT Key is missing"
- Vérifiez que `JWT_SECRET_KEY` est définie dans votre environnement
- Assurez-vous que la clé fait au moins 32 caractères

### Erreur "Rate limit exceeded"
- Attendez une minute et réessayez
- Ajustez les limites dans la configuration si nécessaire

### Erreur CORS
- Vérifiez que votre domaine est dans `AllowedOrigins`
- Vérifiez que vous utilisez HTTPS si configuré

## 📝 Logs de Sécurité

L'API log automatiquement :
- ✅ Tentatives d'authentification échouées
- ✅ Requêtes bloquées par rate limiting
- ✅ Erreurs de validation JWT
- ✅ Tentatives d'accès non autorisées

## 🔄 Mise à Jour

Pour mettre à jour votre configuration de sécurité :

1. Sauvegardez vos variables d'environnement
2. Tirez les dernières modifications du repository
3. Comparez `appsettings.example.json` avec votre configuration
4. Testez en environnement de développement
5. Déployez en production

---

**Important** : Cette configuration est adaptée à un repository public. Tous les secrets sont externalisés et le code source ne contient aucune information sensible.

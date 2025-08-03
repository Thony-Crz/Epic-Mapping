# Token de Développement - Guide d'utilisation

## Vue d'ensemble

Une nouvelle route `/api/token/dev-token` a été ajoutée pour faciliter le développement et les tests avec Swagger. Cette route permet de générer des tokens JWT sans authentification préalable.

## ⚠️ IMPORTANT - SÉCURITÉ

**Cette route ne doit être utilisée qu'en environnement de développement. Elle ne nécessite aucune authentification et doit être désactivée en production.**

## Utilisation

### 1. Génération d'un token avec utilisateur par défaut

```http
POST /api/token/dev-token
Content-Type: application/json

{}
```

Cela génère un token pour l'utilisateur `dev-user`.

### 2. Génération d'un token avec utilisateur personnalisé

```http
POST /api/token/dev-token
Content-Type: application/json

{
  "username": "nom-utilisateur-custom"
}
```

## Réponse

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresAt": "2025-08-02T10:30:00Z",
  "userName": "dev-user",
  "message": "Development token generated successfully. Do not use in production!"
}
```

## Utilisation avec Swagger

1. Accédez à Swagger UI (généralement `/swagger`)
2. Utilisez la route `/api/token/dev-token` pour générer un token
3. Copiez la valeur du token depuis la réponse
4. Cliquez sur le bouton "Authorize" dans Swagger
5. Entrez `Bearer {votre-token}` dans le champ d'autorisation
6. Vous pouvez maintenant utiliser toutes les routes protégées

## Configuration

L'utilisateur de développement `dev-user` avec le mot de passe `dev-password` est automatiquement ajouté à la liste des utilisateurs valides dans `GenerateToken.cs`.

## Sécurité en Production

Pour désactiver cette route en production, vous pouvez :

1. Utiliser une directive de compilation `#if DEBUG`
2. Configurer via les variables d'environnement
3. Retirer complètement la route du contrôleur

Exemple avec directive de compilation :

```csharp
#if DEBUG
[HttpPost("dev-token")]
[AllowAnonymous]
public async Task<IActionResult> GenerateDevToken([FromBody] GenerateDevTokenRequest? request = null)
{
    // ... code existant
}
#endif
```

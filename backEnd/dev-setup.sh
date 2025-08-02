#!/bin/bash

# 🚀 Script de développement pour Epic Mapping API
# Ce script facilite le développement local en configurant automatiquement l'environnement

echo "🧭 Epic Mapping API - Configuration de Développement"
echo "=================================================="

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    echo "⚙️  Création du fichier .env à partir de .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Fichier .env créé. Veuillez le configurer avec vos secrets."
        echo "📝 Éditez le fichier .env avant de continuer."
        exit 1
    else
        echo "❌ Fichier .env.example introuvable."
        exit 1
    fi
fi

# Charger les variables d'environnement
if [ -f ".env" ]; then
    echo "📋 Chargement des variables d'environnement..."
    set -a
    source .env
    set +a
fi

# Vérifier la clé JWT
if [ -z "$JWT_SECRET_KEY" ] || [ ${#JWT_SECRET_KEY} -lt 32 ]; then
    echo "⚠️  ATTENTION: JWT_SECRET_KEY manquante ou trop courte (< 32 caractères)"
    echo "🔧 Génération automatique d'une clé de développement..."
    
    # Générer une clé aléatoire
    NEW_KEY=$(openssl rand -base64 48 | tr -d "=+/" | cut -c1-32)
    
    # Remplacer dans le fichier .env
    if grep -q "JWT_SECRET_KEY=" .env; then
        sed -i "s/JWT_SECRET_KEY=.*/JWT_SECRET_KEY=$NEW_KEY/" .env
    else
        echo "JWT_SECRET_KEY=$NEW_KEY" >> .env
    fi
    
    echo "✅ Nouvelle clé JWT générée et sauvegardée dans .env"
fi

# Vérifier les dépendances .NET
echo "🔍 Vérification des dépendances .NET..."
if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET SDK non trouvé. Installez .NET 9.0 ou utilisez le script d'installation :"
    echo "   ../install-dotnet9.sh"
    exit 1
fi

# Vérifier la version .NET
DOTNET_VERSION=$(dotnet --version)
if [[ ! $DOTNET_VERSION == 9.* ]]; then
    echo "⚠️  Version .NET trouvée : $DOTNET_VERSION"
    echo "⚠️  .NET 9.x est recommandé pour ce projet."
    echo "📖 Utilisez le script d'installation : ../install-dotnet9.sh"
    echo ""
    read -p "❓ Continuer avec la version actuelle ? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ .NET 9 SDK trouvé : $DOTNET_VERSION"
fi

# Restaurer les packages NuGet
echo "📦 Restauration des packages NuGet..."
dotnet restore EpicMapping.sln

# Construire le projet
echo "🏗️  Construction du projet..."
if dotnet build EpicMapping.sln --no-restore; then
    echo "✅ Construction réussie!"
else
    echo "❌ Erreur lors de la construction."
    exit 1
fi

# Lancer les tests
echo "🧪 Exécution des tests..."
if dotnet test --no-build --verbosity normal; then
    echo "✅ Tous les tests passent!"
else
    echo "⚠️  Certains tests ont échoué."
fi

echo ""
echo "🎉 Configuration terminée!"
echo ""
echo "🚀 Pour démarrer l'API:"
echo "   dotnet run --project EpicMapping.WebApi"
echo ""
echo "📖 Pour voir la documentation Swagger:"
echo "   https://localhost:7000 (une fois l'API démarrée)"
echo ""
echo "🔒 Configuration de sécurité:"
echo "   - JWT configuré avec une clé sécurisée"
echo "   - Rate limiting activé"
echo "   - CORS configuré pour le développement"
echo "   - Headers de sécurité appliqués"
echo ""
echo "📝 Comptes de test disponibles:"
echo "   - admin / password"
echo "   - demo / demo123"
echo "   - test / test123"
echo ""

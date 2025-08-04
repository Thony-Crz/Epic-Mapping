#!/bin/bash

# Script de démarrage Docker pour Epic Mapping
# Ce script démarre uniquement l'environnement Docker (Backend + PostgreSQL + PgAdmin)

set -e  # Arrêter le script en cas d'erreur

echo "🐳 Démarrage de l'environnement Docker Epic Mapping..."

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Obtenir le répertoire racine du projet
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backEnd"

# Vérifier si Docker est en cours d'exécution
if ! docker info >/dev/null 2>&1; then
    log_error "Docker n'est pas en cours d'exécution. Veuillez démarrer Docker."
    exit 1
fi

log_success "Docker est en cours d'exécution"

# Aller dans le dossier backend
cd "$BACKEND_DIR" || {
    log_error "Impossible de trouver le dossier backEnd"
    exit 1
}

# Nettoyer les conteneurs existants
log_info "Nettoyage des conteneurs existants..."
docker-compose down 2>/dev/null || true

# Construire et démarrer les services
log_info "Construction des images Docker..."
DOCKER_BUILDKIT=0 docker-compose build --no-cache

log_info "Démarrage des services Docker..."
docker-compose up -d

# Attendre que PostgreSQL soit prêt
log_info "Attente du démarrage de PostgreSQL..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if docker-compose exec -T postgres pg_isready -U epicmapping_user -d EPICMAPPING >/dev/null 2>&1; then
        log_success "PostgreSQL est prêt"
        break
    fi
    
    attempt=$((attempt + 1))
    echo -n "."
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    log_error "PostgreSQL n'a pas démarré dans les temps"
    docker-compose logs postgres
    exit 1
fi

# Attendre que l'API soit prête
log_info "Attente du démarrage de l'API..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:8080/api/Database/health >/dev/null 2>&1; then
        log_success "API est prête"
        break
    fi
    
    attempt=$((attempt + 1))
    echo -n "."
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    log_warning "L'API n'a pas démarré dans les temps"
    log_info "Vérifiez les logs avec: docker-compose logs web-api"
else
    # Test de connectivité
    log_info "Test de la connectivité de la base de données..."
    response=$(curl -s http://localhost:8080/api/Database/health || echo "")
    
    if echo "$response" | grep -q "Healthy"; then
        log_success "✨ Environnement Docker opérationnel!"
    else
        log_warning "Problème de connectivité détecté"
        echo "Réponse de l'API: $response"
    fi
fi

echo ""
log_success "🎉 Environnement Docker démarré!"
echo ""
echo "🌐 Services disponibles:"
echo "   • 🔧 API: http://localhost:8080"
echo "   • 🏥 Health Check: http://localhost:8080/api/Database/health"
echo "   • 🗄️ PgAdmin: http://localhost:8082"
echo "   • 📊 PostgreSQL: localhost:5432"
echo ""
echo "🔑 Accès PgAdmin:"
echo "   • Email: admin@epicmapping.com"
echo "   • Mot de passe: admin123"
echo ""
echo "📝 Commandes utiles:"
echo "   • État des services: docker-compose ps"
echo "   • Logs en temps réel: docker-compose logs -f"
echo "   • Logs API: docker-compose logs web-api"
echo "   • Test PostgreSQL: docker-compose exec postgres pg_isready -U epicmapping_user -d EPICMAPPING"
echo ""
echo "🛑 Pour arrêter:"
echo "   • Tous les services: docker-compose down"
echo "   • Ou utilisez: $PROJECT_ROOT/scripts/stop-dev.sh"
echo ""

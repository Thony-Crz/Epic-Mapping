#!/bin/bash

# Script d'arrêt de l'environnement de développement Epic Mapping
# Ce script arrête tous les services (Frontend + Backend)

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

echo "🛑 Arrêt de l'environnement de développement Epic Mapping..."

# Arrêter le frontend
log_info "Arrêt du frontend..."
if [ -f "$PROJECT_ROOT/.frontend.pid" ]; then
    frontend_pid=$(cat "$PROJECT_ROOT/.frontend.pid")
    if kill "$frontend_pid" 2>/dev/null; then
        log_success "Frontend arrêté (PID: $frontend_pid)"
    else
        log_warning "Impossible d'arrêter le frontend avec le PID sauvegardé"
    fi
    rm -f "$PROJECT_ROOT/.frontend.pid"
fi

# Arrêter les processus Vite restants
pkill -f "vite dev" 2>/dev/null && log_info "Processus Vite restants arrêtés" || true

# Arrêter les conteneurs backend
log_info "Arrêt des conteneurs backend..."
docker container stop epicmapping-api epicmapping-postgres 2>/dev/null && log_success "Conteneurs arrêtés" || log_warning "Certains conteneurs étaient déjà arrêtés"

# Nettoyer les conteneurs
log_info "Suppression des conteneurs..."
docker container rm -f epicmapping-api epicmapping-postgres epicmapping-pgadmin epicmapping-api-new 2>/dev/null || true

# Supprimer le réseau
log_info "Suppression du réseau..."
docker network rm backend_epicmapping-network 2>/dev/null || true

# Supprimer les logs du frontend
if [ -f "$PROJECT_ROOT/frontend.log" ]; then
    log_info "Suppression des logs frontend..."
    rm -f "$PROJECT_ROOT/frontend.log"
fi

log_success "🎉 Environnement de développement arrêté!"
echo ""
echo "Pour redémarrer l'environnement de développement:"
echo "   $PROJECT_ROOT/scripts/start-dev.sh"
echo ""

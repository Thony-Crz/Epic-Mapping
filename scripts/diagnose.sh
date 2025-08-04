#!/bin/bash

# Script de diagnostic avancé pour Epic Mapping
# Aide à identifier les problèmes de connectivité

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

echo -e "${BLUE}🔧 Diagnostic avancé Epic Mapping${NC}"
echo ""

# Test de connectivité réseau interne
log_info "Test de connectivité réseau interne..."

if docker ps --filter "name=epicmapping-api" --filter "status=running" | grep -q epicmapping-api; then
    log_info "Test de résolution DNS postgres depuis l'API..."
    if docker exec epicmapping-api getent hosts postgres >/dev/null 2>&1; then
        log_success "DNS postgres résolu depuis l'API"
    else
        log_error "DNS postgres non résolu depuis l'API"
    fi
    
    log_info "Variables d'environnement de l'API..."
    docker exec epicmapping-api printenv | grep -E "(ConnectionStrings|JWT)" || log_warning "Variables d'environnement manquantes"
    
    log_info "Logs récents de l'API..."
    docker logs epicmapping-api --tail 15
else
    log_error "Conteneur API non trouvé"
fi

echo ""

if docker ps --filter "name=epicmapping-postgres" --filter "status=running" | grep -q epicmapping-postgres; then
    log_info "Test de connectivité PostgreSQL..."
    if docker exec epicmapping-postgres pg_isready -U epicmapping_user -d EPICMAPPING; then
        log_success "PostgreSQL accepte les connexions"
    else
        log_error "PostgreSQL refuse les connexions"
    fi
    
    log_info "Logs récents de PostgreSQL..."
    docker logs epicmapping-postgres --tail 10
else
    log_error "Conteneur PostgreSQL non trouvé"
fi

echo ""
log_info "Résumé des recommandations:"
echo "1. Vérifier que les conteneurs sont sur le même réseau"
echo "2. Vérifier la résolution DNS entre conteneurs"
echo "3. Vérifier les variables d'environnement de connexion"
echo "4. Consulter les logs pour des erreurs spécifiques"

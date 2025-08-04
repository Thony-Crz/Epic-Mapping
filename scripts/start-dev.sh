#!/bin/bash

# Script de démarrage de développement pour Epic Mapping
# Ce script démarre l'ensemble de la stack (Backend + Frontend)

set -e  # Arrêter le script en cas d'erreur

echo "🚀 Démarrage de l'environnement de développement Epic Mapping..."

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
FRONTEND_DIR="$PROJECT_ROOT/frontEnd"

# Vérifier si Docker est en cours d'exécution
if ! docker info >/dev/null 2>&1; then
    log_error "Docker n'est pas en cours d'exécution. Veuillez démarrer Docker."
    exit 1
fi

log_success "Docker est en cours d'exécution"

# Nettoyer les conteneurs existants pour éviter les conflits de réseau
log_info "Nettoyage des conteneurs existants..."
docker container rm -f epicmapping-api epicmapping-postgres epicmapping-pgadmin epicmapping-api-new 2>/dev/null || true

# Nettoyer les réseaux orphelins
log_info "Nettoyage des réseaux orphelins..."
docker network rm backend_epicmapping-network 2>/dev/null || true

log_success "Nettoyage terminé"

# Créer le réseau
log_info "Création du réseau..."
docker network create backend_epicmapping-network 2>/dev/null || true

# Démarrer PostgreSQL
log_info "Démarrage de PostgreSQL..."
docker run -d \
  --name epicmapping-postgres \
  --network backend_epicmapping-network \
  -p 5432:5432 \
  -e POSTGRES_DB=EPICMAPPING \
  -e POSTGRES_USER=epicmapping_user \
  -e POSTGRES_PASSWORD=epicmapping_password \
  postgres:16

# Attendre que PostgreSQL soit prêt
log_info "Attente du démarrage de PostgreSQL..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if docker exec epicmapping-postgres pg_isready -U epicmapping_user -d EPICMAPPING >/dev/null 2>&1; then
        log_success "PostgreSQL est prêt"
        break
    fi
    
    attempt=$((attempt + 1))
    echo -n "."
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    log_error "PostgreSQL n'a pas démarré dans les temps"
    exit 1
fi

# Construire l'image API
log_info "Construction de l'image API..."
cd "$BACKEND_DIR"
docker build -t epicmapping-api . >/dev/null 2>&1 || {
    log_error "Échec de la construction de l'image API"
    exit 1
}

# Démarrer l'API
log_info "Démarrage de l'API..."
docker run -d \
  --name epicmapping-api \
  --network backend_epicmapping-network \
  -p 8080:8080 \
  -p 8081:8081 \
  -e "ASPNETCORE_ENVIRONMENT=Development" \
  -e "ConnectionStrings__DefaultConnection=Host=epicmapping-postgres;Database=EPICMAPPING;Username=epicmapping_user;Password=epicmapping_password;Port=5432" \
  -e "JWT_SECRET_KEY=CECI_EST_UNE_CLE_SECRETE_POUR_JWT_AU_MOINS_32_CARACTERES_LONG" \
  epicmapping-api

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
    log_warning "L'API n'a pas démarré dans les temps, mais continuons..."
fi

# Test de connectivité backend
log_info "Test de la connectivité de la base de données..."
response=$(curl -s http://localhost:8080/api/Database/health || echo "")

if echo "$response" | grep -q "Healthy"; then
    log_success "✨ Backend est opérationnel!"
    
    # Démarrer le frontend
    log_info "Démarrage du frontend..."
    
    # Vérifier si Node.js est installé
    if ! command -v npm >/dev/null 2>&1; then
        log_error "npm n'est pas installé. Veuillez installer Node.js/npm pour démarrer le frontend."
        log_warning "Backend est opérationnel, mais le frontend ne peut pas démarrer."
        exit 0
    fi
    
    # Aller dans le dossier frontend
    cd "$FRONTEND_DIR" || {
        log_error "Impossible de trouver le dossier frontEnd"
        log_warning "Backend est opérationnel, mais le frontend ne peut pas démarrer."
        exit 0
    }
    
    # Installer les dépendances si nécessaire
    if [ ! -d "node_modules" ]; then
        log_info "Installation des dépendances npm..."
        npm install || {
            log_error "Échec de l'installation des dépendances npm"
            log_warning "Backend est opérationnel, mais le frontend ne peut pas démarrer."
            exit 0
        }
    fi
    
    # Démarrer le serveur de développement en arrière-plan
    log_info "Lancement du serveur de développement frontend..."
    nohup npm run dev > "$PROJECT_ROOT/frontend.log" 2>&1 &
    frontend_pid=$!
    
    # Attendre que le frontend soit prêt
    log_info "Attente du démarrage du frontend..."
    max_attempts=30
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s http://localhost:5173 >/dev/null 2>&1; then
            log_success "Frontend est prêt!"
            break
        fi
        
        attempt=$((attempt + 1))
        echo -n "."
        sleep 2
    done
    
    if [ $attempt -eq $max_attempts ]; then
        log_warning "Le frontend n'a pas démarré dans les temps"
        log_info "Vérifiez les logs dans $PROJECT_ROOT/frontend.log"
    fi
    
    echo ""
    log_success "🎉 Environnement de développement opérationnel!"
    echo ""
    echo "🌐 Services disponibles:"
    echo "   • 🎨 Frontend: http://localhost:5173"
    echo "   • 🔧 API: http://localhost:8080"
    echo "   • 🏥 Health Check: http://localhost:8080/api/Database/health"
    echo ""
    echo "📝 Logs:"
    echo "   • Frontend: tail -f $PROJECT_ROOT/frontend.log"
    echo "   • Backend: docker logs epicmapping-api"
    echo ""
    echo "🛑 Pour arrêter tous les services:"
    echo "   • Utilisez: $PROJECT_ROOT/scripts/stop-dev.sh"
    echo ""
    
    # Sauvegarder le PID du frontend pour l'arrêt
    echo "$frontend_pid" > "$PROJECT_ROOT/.frontend.pid"
    
else
    log_error "Problème de connectivité détecté avec le backend"
    echo "Réponse de l'API: $response"
    exit 1
fi

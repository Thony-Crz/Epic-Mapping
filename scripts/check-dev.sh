#!/bin/bash

# Script de vérification de l'état de l'environnement de développement Epic Mapping

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Obtenir le répertoire racine du projet
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${BLUE}🔍 Vérification de l'état de l'environnement Epic Mapping...${NC}"
echo ""

# Vérifier l'état des conteneurs
echo -e "${BLUE}📦 État des conteneurs:${NC}"
docker ps --filter "name=epicmapping" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "Aucun conteneur Epic Mapping trouvé"
echo ""

# Vérifier les réseaux
echo -e "${BLUE}🌐 Réseaux Docker:${NC}"
docker network ls --filter "name=epicmapping" 2>/dev/null || echo "Aucun réseau Epic Mapping trouvé"
echo ""

# Vérifier la connectivité réseau entre les conteneurs
echo -e "${BLUE}🔗 Connectivité réseau:${NC}"
api_container=$(docker ps --filter "name=epicmapping-api" --filter "status=running" --format "{{.Names}}" | head -1)
if [ -n "$api_container" ]; then
    echo "API container trouvé: $api_container"
    
    # Vérifier si l'API et PostgreSQL sont sur le même réseau
    api_networks=$(docker inspect "$api_container" --format '{{range $key, $value := .NetworkSettings.Networks}}{{$key}} {{end}}' 2>/dev/null || echo "N/A")
    postgres_networks=$(docker inspect epicmapping-postgres --format '{{range $key, $value := .NetworkSettings.Networks}}{{$key}} {{end}}' 2>/dev/null || echo "N/A")
    
    echo "  API networks: $api_networks"
    echo "  PostgreSQL networks: $postgres_networks"
    
    # Vérifier s'ils partagent au moins un réseau
    common_network=""
    for api_net in $api_networks; do
        for pg_net in $postgres_networks; do
            if [ "$api_net" = "$pg_net" ]; then
                common_network="$api_net"
                break 2
            fi
        done
    done
    
    if [ -n "$common_network" ]; then
        echo -e "${GREEN}  ✅ API et PostgreSQL sont sur le même réseau: $common_network${NC}"
    else
        echo -e "${RED}  ❌ API et PostgreSQL ne sont PAS sur le même réseau!${NC}"
    fi
else
    echo -e "${YELLOW}  ⚠️ Conteneur API non trouvé ou non démarré${NC}"
fi

echo ""

# Test de l'API de santé
echo -e "${BLUE}🏥 Test de santé de la base de données:${NC}"
health_response=$(curl -s http://localhost:8080/api/Database/health 2>/dev/null || echo "Connection failed")

if echo "$health_response" | grep -q "Healthy"; then
    echo -e "${GREEN}  ✅ Base de données: SAINE${NC}"
    echo "  📊 Détails: $(echo "$health_response" | jq -r '.message' 2>/dev/null || echo "$health_response")"
elif echo "$health_response" | grep -q "Unhealthy"; then
    echo -e "${RED}  ❌ Base de données: PROBLÈME${NC}"
    echo "  📊 Détails: $(echo "$health_response" | jq -r '.message' 2>/dev/null || echo "$health_response")"
else
    echo -e "${RED}  ❌ Impossible de joindre l'API${NC}"
    echo "  📊 Réponse: $health_response"
fi

echo ""

# Test du frontend
echo -e "${BLUE}🎨 Test du frontend:${NC}"
frontend_response=$(curl -s http://localhost:5173 2>/dev/null || echo "Connection failed")

if [ "$frontend_response" != "Connection failed" ] && [ -n "$frontend_response" ]; then
    echo -e "${GREEN}  ✅ Frontend: OPÉRATIONNEL${NC}"
    echo "  🌐 URL: http://localhost:5173"
else
    echo -e "${RED}  ❌ Frontend: NON ACCESSIBLE${NC}"
    
    # Vérifier si le processus frontend est en cours
    if pgrep -f "vite dev" >/dev/null; then
        echo -e "${YELLOW}  ⚠️ Processus Vite détecté mais pas accessible${NC}"
    else
        echo -e "${RED}  ❌ Processus Vite non trouvé${NC}"
    fi
fi

echo ""

# Résumé des URLs utiles
echo -e "${BLUE}🔗 URLs utiles:${NC}"
echo "  • 🎨 Frontend: http://localhost:5173"
echo "  • 🔧 API: http://localhost:8080"
echo "  • 🏥 Health Check: http://localhost:8080/api/Database/health"
echo "  • 🗄️ PgAdmin: http://localhost:8082"
echo ""

# Suggestions d'actions
if echo "$health_response" | grep -q "Unhealthy" || [ "$health_response" = "Connection failed" ] || [ "$frontend_response" = "Connection failed" ]; then
    echo -e "${YELLOW}💡 Actions suggérées:${NC}"
    echo "  1. Redémarrer l'environnement: $PROJECT_ROOT/scripts/start-dev.sh"
    echo "  2. Vérifier les logs backend: docker logs epicmapping-api"
    echo "  3. Vérifier les logs PostgreSQL: docker logs epicmapping-postgres"
    if [ "$frontend_response" = "Connection failed" ]; then
        echo "  4. Vérifier les logs frontend: tail -f $PROJECT_ROOT/frontend.log"
    fi
    echo ""
    echo -e "${BLUE}🛑 Pour arrêter tous les services:${NC}"
    echo "  $PROJECT_ROOT/scripts/stop-dev.sh"
fi

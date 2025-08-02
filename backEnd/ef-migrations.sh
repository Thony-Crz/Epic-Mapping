#!/bin/bash

# Script pour gérer les migrations Entity Framework
# Usage: ./ef-migrations.sh [command] [migration-name]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR"
INFRASTRUCTURE_PROJECT="src/Infrastructure"
STARTUP_PROJECT="EpicMapping.WebApi"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher l'aide
show_help() {
    echo -e "${BLUE}Epic Mapping - Gestionnaire de migrations Entity Framework${NC}"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  add <name>      Ajouter une nouvelle migration"
    echo "  update          Appliquer les migrations en attente"
    echo "  remove          Supprimer la dernière migration (non appliquée)"
    echo "  list            Lister les migrations"
    echo "  status          Voir le statut des migrations"
    echo "  reset           Supprimer toutes les migrations et recréer la base"
    echo "  help            Afficher cette aide"
    echo ""
    echo "Examples:"
    echo "  $0 add InitialCreate"
    echo "  $0 update"
    echo "  $0 status"
}

# Vérifier si dotnet ef est installé
check_ef_tools() {
    if ! dotnet ef --version > /dev/null 2>&1; then
        echo -e "${RED}❌ dotnet ef n'est pas installé.${NC}"
        echo "Installez-le avec: dotnet tool install --global dotnet-ef"
        exit 1
    fi
}

# Vérifier la structure du projet
check_project_structure() {
    if [[ ! -d "$INFRASTRUCTURE_PROJECT" ]]; then
        echo -e "${RED}❌ Le projet Infrastructure n'a pas été trouvé dans $INFRASTRUCTURE_PROJECT${NC}"
        exit 1
    fi
    
    if [[ ! -d "$STARTUP_PROJECT" ]]; then
        echo -e "${RED}❌ Le projet WebApi n'a pas été trouvé dans $STARTUP_PROJECT${NC}"
        exit 1
    fi
}

# Ajouter une migration
add_migration() {
    local migration_name="$1"
    
    if [[ -z "$migration_name" ]]; then
        echo -e "${RED}❌ Nom de migration requis${NC}"
        echo "Usage: $0 add <migration-name>"
        exit 1
    fi
    
    echo -e "${BLUE}🔄 Ajout de la migration: $migration_name${NC}"
    
    dotnet ef migrations add "$migration_name" \
        --project "$INFRASTRUCTURE_PROJECT" \
        --startup-project "$STARTUP_PROJECT" \
        --verbose
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}✅ Migration '$migration_name' ajoutée avec succès${NC}"
    else
        echo -e "${RED}❌ Échec de l'ajout de la migration${NC}"
        exit 1
    fi
}

# Appliquer les migrations
update_database() {
    echo -e "${BLUE}🔄 Application des migrations en attente...${NC}"
    
    dotnet ef database update \
        --project "$INFRASTRUCTURE_PROJECT" \
        --startup-project "$STARTUP_PROJECT" \
        --verbose
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}✅ Base de données mise à jour avec succès${NC}"
    else
        echo -e "${RED}❌ Échec de la mise à jour de la base de données${NC}"
        exit 1
    fi
}

# Supprimer la dernière migration
remove_migration() {
    echo -e "${YELLOW}⚠️  Suppression de la dernière migration...${NC}"
    
    dotnet ef migrations remove \
        --project "$INFRASTRUCTURE_PROJECT" \
        --startup-project "$STARTUP_PROJECT" \
        --verbose
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}✅ Dernière migration supprimée avec succès${NC}"
    else
        echo -e "${RED}❌ Échec de la suppression de la migration${NC}"
        exit 1
    fi
}

# Lister les migrations
list_migrations() {
    echo -e "${BLUE}📋 Liste des migrations:${NC}"
    
    dotnet ef migrations list \
        --project "$INFRASTRUCTURE_PROJECT" \
        --startup-project "$STARTUP_PROJECT"
}

# Voir le statut des migrations
migration_status() {
    echo -e "${BLUE}📊 Statut des migrations:${NC}"
    
    # Migrations appliquées
    echo -e "${GREEN}Migrations appliquées:${NC}"
    dotnet ef migrations list \
        --project "$INFRASTRUCTURE_PROJECT" \
        --startup-project "$STARTUP_PROJECT"
    
    echo ""
    echo -e "${YELLOW}Vérification de la base de données...${NC}"
}

# Réinitialiser complètement
reset_migrations() {
    echo -e "${RED}⚠️  ATTENTION: Cette action va supprimer toutes les migrations!${NC}"
    read -p "Êtes-vous sûr? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}🗑️  Suppression de toutes les migrations...${NC}"
        
        # Supprimer le dossier Migrations s'il existe
        if [[ -d "$INFRASTRUCTURE_PROJECT/Migrations" ]]; then
            rm -rf "$INFRASTRUCTURE_PROJECT/Migrations"
            echo -e "${GREEN}✅ Dossier Migrations supprimé${NC}"
        fi
        
        # Créer une nouvelle migration initiale
        echo -e "${BLUE}🔄 Création d'une nouvelle migration initiale...${NC}"
        add_migration "InitialCreate"
        
    else
        echo -e "${YELLOW}❌ Opération annulée${NC}"
    fi
}

# Main script
main() {
    cd "$PROJECT_DIR"
    
    check_ef_tools
    check_project_structure
    
    case "${1:-help}" in
        "add")
            add_migration "$2"
            ;;
        "update")
            update_database
            ;;
        "remove")
            remove_migration
            ;;
        "list")
            list_migrations
            ;;
        "status")
            migration_status
            ;;
        "reset")
            reset_migrations
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

main "$@"

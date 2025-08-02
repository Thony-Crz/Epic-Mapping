#!/bin/bash
set -e

# Ce script est exécuté lors de l'initialisation du conteneur PostgreSQL
# Il crée la base de données EPICMAPPING si elle n'existe pas déjà

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- La base de données EPICMAPPING est déjà créée via POSTGRES_DB
    -- Mais on peut ajouter des configurations supplémentaires ici si nécessaire
    
    -- Exemple : Créer des extensions si nécessaire
    -- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Afficher un message de confirmation
    SELECT 'Base de données EPICMAPPING initialisée avec succès' AS message;
EOSQL

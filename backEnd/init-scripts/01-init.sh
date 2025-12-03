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

    DO $$
    DECLARE
        v_epic_id uuid := 'b1a4f2b8-5e2f-4bc7-8a04-4d1a17aa0f22';
        v_feature_id uuid := 'f9c1ed8b-3ba1-4cbf-9d8c-55f3239e9a77';
        v_scenario_id uuid := 'a4cbb21b-20a0-41de-9cef-690339c48131';
    BEGIN
        -- Seed a Ready epic for manual export tests
        IF EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = 'epics'
        ) THEN
            INSERT INTO public.epics (id, key, title, summary, status, owner, business_value, estimate, confidence, ready_at, updated_at)
            VALUES (
                v_epic_id,
                'EPIC-READY-001',
                'Ready Export Pilot Epic',
                'Seed data used to validate Ready-only export flows end-to-end.',
                'Ready',
                'alba.martin@epicmapping.com',
                80,
                21,
                'High',
                NOW() - INTERVAL '1 day',
                NOW()
            )
            ON CONFLICT (id) DO UPDATE
            SET
                title = EXCLUDED.title,
                summary = EXCLUDED.summary,
                status = EXCLUDED.status,
                owner = EXCLUDED.owner,
                business_value = EXCLUDED.business_value,
                estimate = EXCLUDED.estimate,
                confidence = EXCLUDED.confidence,
                ready_at = EXCLUDED.ready_at,
                updated_at = NOW();
            RAISE NOTICE 'Ready epic seed available (id=%).', v_epic_id;
        ELSE
            RAISE NOTICE 'Skipping Ready epic seed: table public.epics missing.';
        END IF;

        -- Seed child feature linked to the Ready epic
        IF EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = 'features'
        ) THEN
            INSERT INTO public.features (id, epic_id, key, title, status, "order")
            VALUES (
                v_feature_id,
                v_epic_id,
                'FEAT-READY-ALPHA',
                'Azure DevOps bootstrap slice',
                'Ready',
                1
            )
            ON CONFLICT (id) DO UPDATE
            SET
                title = EXCLUDED.title,
                status = EXCLUDED.status,
                "order" = EXCLUDED."order";
            RAISE NOTICE 'Feature seed available (id=%).', v_feature_id;
        ELSE
            RAISE NOTICE 'Skipping feature seed: table public.features missing.';
        END IF;

        -- Seed scenario linked to the feature
        IF EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = 'scenarios'
        ) THEN
            INSERT INTO public.scenarios (id, feature_id, title, description, status, "order")
            VALUES (
                v_scenario_id,
                v_feature_id,
                'Export Ready epic payload',
                'Covers serialization + download path for Ready epics.',
                'Ready',
                1
            )
            ON CONFLICT (id) DO UPDATE
            SET
                title = EXCLUDED.title,
                description = EXCLUDED.description,
                status = EXCLUDED.status,
                "order" = EXCLUDED."order";
            RAISE NOTICE 'Scenario seed available (id=%).', v_scenario_id;
        ELSE
            RAISE NOTICE 'Skipping scenario seed: table public.scenarios missing.';
        END IF;
    END
    $$;
EOSQL

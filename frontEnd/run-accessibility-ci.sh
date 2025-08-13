#!/bin/bash

# Script pour préparer et exécuter les tests d'accessibilité en CI
# Usage: ./run-accessibility-ci.sh [browser] [test-file]

set -e

# Configuration par défaut
BROWSER=${1:-"chromium"}
TEST_FILE=${2:-""}
CI_MODE=true

echo "🔍 Préparation des tests d'accessibilité en CI"
echo "📅 Date: $(date)"
echo "🌐 Navigateur: $BROWSER"
echo "📁 Fichier de test: ${TEST_FILE:-"Tous les tests"}"
echo ""

# Vérifier les dépendances
echo "📦 Vérification des dépendances..."
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules manquant. Installez les dépendances avec: npm ci"
    exit 1
fi

if [ ! -d "node_modules/@playwright" ]; then
    echo "❌ Playwright non installé. Installez avec: npm ci"
    exit 1
fi

# Vérifier la build
echo "🏗️ Vérification de la build..."
if [ ! -d "build" ]; then
    echo "⚠️ Dossier build manquant. Construction de l'application..."
    npm run build
fi

# Préparer l'environnement CI
echo "🔧 Configuration de l'environnement CI..."
export CI=true
export PWTEST_HTML_REPORT_OPEN=never
export PLAYWRIGHT_HTML_REPORT=accessibility-report

# Créer les dossiers de rapport
mkdir -p accessibility-report test-results

echo "🧪 Exécution des tests d'accessibilité..."

# Construire la commande
COMMAND="npx playwright test --config=e2e/accessibility.config.ts"

if [ -n "$TEST_FILE" ]; then
    COMMAND="$COMMAND accessibility/$TEST_FILE"
fi

if [ "$BROWSER" != "all" ]; then
    COMMAND="$COMMAND --project=accessibility-$BROWSER"
fi

# Options CI
COMMAND="$COMMAND --reporter=html,json --output-dir=test-results"

echo "📝 Commande exécutée: $COMMAND"
echo ""

# Exécuter les tests (ne pas échouer le script si les tests échouent)
set +e
eval $COMMAND
TEST_EXIT_CODE=$?
set -e

echo ""
echo "📊 Génération du résumé..."

# Générer un résumé des résultats
if [ -f "accessibility-results.json" ]; then
    # Utiliser jq pour parser le JSON si disponible, sinon grep/sed
    if command -v jq &> /dev/null; then
        TOTAL=$(jq -r '.stats.total // 0' accessibility-results.json)
        PASSED=$(jq -r '.stats.expected // 0' accessibility-results.json)
        FAILED=$(jq -r '.stats.unexpected // 0' accessibility-results.json)
        SKIPPED=$(jq -r '.stats.skipped // 0' accessibility-results.json)
    else
        # Fallback sans jq
        TOTAL=$(grep -o '"total":[0-9]*' accessibility-results.json | cut -d: -f2 || echo "0")
        PASSED=$(grep -o '"expected":[0-9]*' accessibility-results.json | cut -d: -f2 || echo "0")
        FAILED=$(grep -o '"unexpected":[0-9]*' accessibility-results.json | cut -d: -f2 || echo "0")
        SKIPPED=$(grep -o '"skipped":[0-9]*' accessibility-results.json | cut -d: -f2 || echo "0")
    fi
    
    echo "📈 Résultats des tests d'accessibilité:"
    echo "   Total: $TOTAL"
    echo "   Réussis: $PASSED"
    echo "   Échoués: $FAILED"
    echo "   Ignorés: $SKIPPED"
    
    if [ "$TOTAL" -gt 0 ]; then
        SUCCESS_RATE=$((PASSED * 100 / TOTAL))
        echo "   Taux de réussite: ${SUCCESS_RATE}%"
        
        if [ "$SUCCESS_RATE" -ge 90 ]; then
            echo "✅ Excellent niveau d'accessibilité !"
        elif [ "$SUCCESS_RATE" -ge 70 ]; then
            echo "🟡 Bon niveau d'accessibilité, améliorations possibles"
        else
            echo "🔴 Niveau d'accessibilité insuffisant, corrections nécessaires"
        fi
    fi
else
    echo "❌ Fichier de résultats non trouvé"
fi

echo ""
echo "📁 Artefacts générés:"
[ -d "accessibility-report" ] && echo "   - Rapport HTML: accessibility-report/"
[ -f "accessibility-results.json" ] && echo "   - Résultats JSON: accessibility-results.json"
[ -d "test-results" ] && echo "   - Résultats détaillés: test-results/"

echo ""
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ Tests d'accessibilité terminés avec succès !"
    exit 0
else
    echo "⚠️ Tests d'accessibilité terminés avec des échecs (code: $TEST_EXIT_CODE)"
    echo "💡 En mode CI non-bloquant, ceci est informatif et n'interrompt pas le pipeline"
    
    # En mode CI, on retourne 0 pour ne pas bloquer
    if [ "$CI_MODE" = "true" ]; then
        echo "🔄 Mode CI non-bloquant activé - pipeline continue"
        exit 0
    else
        exit $TEST_EXIT_CODE
    fi
fi

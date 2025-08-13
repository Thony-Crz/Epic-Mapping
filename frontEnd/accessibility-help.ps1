#!/usr/bin/env pwsh

# Script d'aide pour les tests d'accessibilité
# Affiche les options disponibles et les temps d'exécution estimés

Write-Host "🔍 Tests d'Accessibilité Epic-Mapping" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "💡 Configuration Optimisée GitHub Actions Gratuit" -ForegroundColor Yellow
Write-Host "   → Tests automatiques désactivés pour économiser vos minutes" -ForegroundColor Gray
Write-Host "   → Exécution manuelle locale et GitHub Actions uniquement" -ForegroundColor Gray
Write-Host ""

Write-Host "🚀 OPTIONS D'EXÉCUTION" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. 🏠 LOCAL (Recommandé pour développement)" -ForegroundColor White
Write-Host "   npm run test:a11y                    # Tests complets (~3-5 min)"
Write-Host "   npm run test:a11y:report             # Voir dernier rapport"
Write-Host "   .\run-accessibility-tests.ps1 -UI   # Interface graphique"
Write-Host ""

Write-Host "2. ☁️  GITHUB ACTIONS (Manuel uniquement)" -ForegroundColor White
Write-Host "   → GitHub → Actions → 'Tests d'Accessibilité WCAG' → Run workflow"
Write-Host "   Options disponibles:"
Write-Host "     • Navigateur: chromium, firefox, webkit, all"
Write-Host "     • Test spécifique: (optionnel)"
Write-Host "     • Environnement: local-build, production"
Write-Host ""

Write-Host "⏱️  TEMPS D'EXÉCUTION ESTIMÉS" -ForegroundColor Cyan
Write-Host ""
$timeTable = @(
    @("Tests WCAG de base", "2-3 min", "4-5 min"),
    @("Tests complets (1 navigateur)", "5-7 min", "8-10 min"),
    @("Tests multi-navigateurs", "15-20 min", "20-25 min")
)

Write-Host "Type de Test".PadRight(30) + "Local".PadRight(15) + "GitHub Actions" -ForegroundColor Yellow
Write-Host ("─" * 60) -ForegroundColor Gray
foreach ($row in $timeTable) {
    Write-Host $row[0].PadRight(30) + $row[1].PadRight(15) + $row[2] -ForegroundColor White
}
Write-Host ""

Write-Host "🎯 QUAND UTILISER QUOI ?" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔄 DÉVELOPPEMENT QUOTIDIEN:" -ForegroundColor Green
Write-Host "   → Tests locaux avant commits importants"
Write-Host "   → Interface graphique pour debugging"
Write-Host ""
Write-Host "🚀 VALIDATION PROJET:" -ForegroundColor Blue
Write-Host "   → GitHub Actions manuel avant releases"
Write-Host "   → Tests multi-navigateurs pour validation complète"
Write-Host ""
Write-Host "💰 ÉCONOMIES:" -ForegroundColor Yellow
Write-Host "   → Aucun déclenchement automatique"
Write-Host "   → ~85% d'économie sur minutes GitHub Actions"
Write-Host "   → Contrôle total du timing d'exécution"
Write-Host ""

Write-Host "📋 COMMANDES RAPIDES" -ForegroundColor Cyan
Write-Host ""
Write-Host "# Tests complets maintenant"
Write-Host "npm run test:a11y" -ForegroundColor Green
Write-Host ""
Write-Host "# Interface graphique interactive"  
Write-Host ".\run-accessibility-tests.ps1 -UI" -ForegroundColor Green
Write-Host ""
Write-Host "# Tests spécifiques (plus rapide)"
Write-Host ".\run-accessibility-tests.ps1 -TestFile wcag-compliance.spec.ts" -ForegroundColor Green
Write-Host ""

Write-Host "📚 DOCUMENTATION COMPLÈTE" -ForegroundColor Cyan
Write-Host "   accessibility/README.md           # Guide technique complet"
Write-Host "   accessibility/MANUAL-TESTING.md   # Guide d'utilisation manuelle"
Write-Host "   ACCESSIBILITY-QUICKSTART.md       # Démarrage rapide"
Write-Host ""

$choice = Read-Host "Voulez-vous lancer les tests maintenant ? (o/N)"
if ($choice -eq "o" -or $choice -eq "O") {
    Write-Host ""
    Write-Host "🚀 Lancement des tests d'accessibilité..." -ForegroundColor Green
    npm run test:a11y
}

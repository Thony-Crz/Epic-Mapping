#!/usr/bin/env pwsh

# Script PowerShell pour lancer les tests d'accessibilite
# Usage: .\run-accessibility-tests.ps1 [options]

param(
    [string]$TestFile = "",
    [string]$Browser = "chromium",
    [switch]$UI = $false,
    [switch]$Headed = $false,
    [switch]$Debug = $false,
    [switch]$Reporter = $false,
    [switch]$Help = $false
)

function Show-Help {
    Write-Host "Tests d'Accessibilite WCAG - Epic Mapping" -ForegroundColor Green
    Write-Host ""
    Write-Host "Usage: .\run-accessibility-tests.ps1 [options]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Cyan
    Write-Host "  -TestFile <nom>    Lance un fichier de test specifique"
    Write-Host "  -Browser <nom>     Specifie le navigateur (chromium, firefox, webkit)"
    Write-Host "  -UI                Lance l'interface graphique de Playwright"
    Write-Host "  -Headed            Lance les tests avec interface graphique"
    Write-Host "  -Debug             Lance en mode debug"
    Write-Host "  -Reporter          Ouvre le rapport HTML apres execution"
    Write-Host "  -Help              Affiche cette aide"
    Write-Host ""
    Write-Host "Exemples:" -ForegroundColor Cyan
    Write-Host "  .\run-accessibility-tests.ps1"
    Write-Host "  .\run-accessibility-tests.ps1 -TestFile wcag-compliance.spec.ts"
    Write-Host "  .\run-accessibility-tests.ps1 -UI"
    Write-Host "  .\run-accessibility-tests.ps1 -Browser firefox -Headed"
    Write-Host ""
    Write-Host "Tests disponibles:" -ForegroundColor Cyan
    Write-Host "  - wcag-compliance.spec.ts           : Tests WCAG generaux"
    Write-Host "  - keyboard-navigation.spec.ts       : Navigation au clavier"
    Write-Host "  - forms-accessibility.spec.ts       : Accessibilite des formulaires"
    Write-Host "  - multimedia-accessibility.spec.ts  : Contenu multimedia"
    Write-Host "  - comprehensive-accessibility.spec.ts: Tests complets avec utilitaires"
}

if ($Help) {
    Show-Help
    exit 0
}

Write-Host "=== Tests d'Accessibilite WCAG ===" -ForegroundColor Green
Write-Host ""

# Verifier que nous sommes dans le bon repertoire
if (-not (Test-Path "package.json")) {
    Write-Error "Erreur: Ce script doit etre execute depuis le repertoire frontEnd"
    exit 1
}

# Verifier l'installation des dependances
if (-not (Test-Path "node_modules")) {
    Write-Host "Installation des dependances..." -ForegroundColor Yellow
    npm ci
}

# Construire la commande Playwright
$command = "npx playwright test"
$config = "--config=e2e/accessibility.config.ts"

if ($TestFile) {
    $command += " accessibility/$TestFile"
}

if ($UI) {
    $command += " --ui"
} elseif ($Debug) {
    $command += " --debug"
} elseif ($Headed) {
    $command += " --headed"
}

if ($Browser -and -not $UI) {
    $command += " --project=accessibility-$Browser"
}

$fullCommand = "$command $config"

Write-Host "Commande executee: $fullCommand" -ForegroundColor Cyan
Write-Host ""

# Executer les tests
try {
    Invoke-Expression $fullCommand
    $exitCode = $LASTEXITCODE
    
    if ($exitCode -eq 0) {
        Write-Host ""
        Write-Host "✅ Tests d'accessibilite termines avec succes!" -ForegroundColor Green
        
        if ($Reporter) {
            Write-Host "Ouverture du rapport HTML..." -ForegroundColor Yellow
            npx playwright show-report accessibility-report
        } else {
            Write-Host "Pour voir le rapport detaille, utilisez: npx playwright show-report accessibility-report" -ForegroundColor Cyan
        }
    } else {
        Write-Host ""
        Write-Host "❌ Certains tests d'accessibilite ont echoue" -ForegroundColor Red
        Write-Host "Consultez le rapport pour plus de details: npx playwright show-report accessibility-report" -ForegroundColor Yellow
    }
    
    exit $exitCode
} catch {
    Write-Error "Erreur lors de l'execution des tests: $($_.Exception.Message)"
    exit 1
}

# Guide de Démarrage Rapide - Tests d'Accessibilité

## Installation Terminée ✅

Votre application Epic-Mapping dispose maintenant d'une suite complète de tests d'accessibilité WCAG 2.1 AA !

## Commandes Principales

### Lancer tous les tests d'accessibilité
```bash
npm run test:accessibility
# ou
npm run test:a11y
```

### Lancer avec l'interface graphique
```bash
npx playwright test --ui --config=e2e/accessibility.config.ts
```

### Lancer un test spécifique
```bash
npx playwright test accessibility/wcag-compliance.spec.ts --config=e2e/accessibility.config.ts
```

### Voir le rapport HTML
```bash
npx playwright show-report accessibility-report
```

## Script PowerShell (Windows)
```powershell
# Aide
.\run-accessibility-tests.ps1 -Help

# Tests complets
.\run-accessibility-tests.ps1

# Interface graphique
.\run-accessibility-tests.ps1 -UI

# Test spécifique
.\run-accessibility-tests.ps1 -TestFile wcag-compliance.spec.ts
```

## Ce qui a été Installé

### 📦 Dépendances
- `@axe-core/playwright` : Tests automatisés axe-core
- `axe-core` : Moteur d'analyse d'accessibilité
- `@types/node` : Types TypeScript pour Node.js

### 🧪 Tests d'Accessibilité (135 tests)
- **Tests WCAG généraux** : Conformité automatisée
- **Navigation clavier** : Ordre de tabulation, focus
- **Formulaires** : Labels, erreurs, validation
- **Contenu multimédia** : Images, vidéos, contraste
- **Tests complets** : Simulation utilisateur malvoyant

### 🛠️ Configuration
- Configuration Playwright spécialisée
- Rapports HTML et JSON
- Tests multi-navigateurs (Chrome, Firefox, Safari)
- Utilitaires de test réutilisables

### 📚 Documentation
- Guide complet dans `accessibility/README.md`
- Configuration VS Code avec extensions recommandées
- Scripts d'aide PowerShell

## Vérifications WCAG Couvertes

### ✅ Niveau A
- Contenu non textuel (images alt)
- Information et relations (structure)
- Accessibilité au clavier
- Langue de la page

### ✅ Niveau AA
- Contraste des couleurs (4.5:1)
- Redimensionnement du texte (200%)
- En-têtes et étiquettes
- Focus visible
- Identification des erreurs

## Intégration dans votre Workflow

### 1. Développement
```bash
# Avant chaque commit
npm run test:a11y

# Pendant le développement
.\run-accessibility-tests.ps1 -UI
```

### 2. CI/CD
**Tests manuels uniquement** pour économiser les minutes GitHub Actions :
```bash
# GitHub → Actions → "Tests d'Accessibilité WCAG" → Run workflow
# Choisissez vos options et lancez quand nécessaire
```

### 3. Code Review
- Lancez manuellement les tests avant les reviews importantes
- Utilisez les extensions VS Code recommandées
- Testez manuellement avec un lecteur d'écran

## Prochaines Étapes

### Immédiat
1. **Lancez les tests** : `npm run test:a11y` (local)
2. **Corrigez les erreurs** trouvées
3. **Intégrez** dans votre processus de développement local

### Validation Projet
1. **GitHub Actions** : Déclenchement manuel pour validation complète
2. **Multi-navigateurs** : Tests complets avant les releases importantes

### Outils Complémentaires
- **Lecteurs d'écran** : NVDA (gratuit), JAWS, VoiceOver
- **Extensions navigateur** : axe DevTools, WAVE
- **Outils design** : Contrast checkers, Color Oracle

## Support et Ressources

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Axe Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [Playwright Accessibility](https://playwright.dev/docs/accessibility-testing)

### Aide
- Documentation complète : `accessibility/README.md`
- Utilitaires de test : `accessibility/accessibility-helpers.ts`
- Exemples d'usage : Fichiers `*.spec.ts`

## Félicitations ! 🎉

Votre application est maintenant prête pour une accessibilité de niveau professionnel. 
Les tests automatisés vous aideront à maintenir la conformité WCAG au fil du développement.

**Commencez dès maintenant :**
```bash
npm run test:a11y
```

# Configuration des Badges d'Accessibilité

## Badges pour README.md

Ajoutez ces badges à votre README principal pour afficher le statut des tests d'accessibilité :

### Badge du workflow principal
```markdown
[![Tests d'Accessibilité](https://github.com/Thony-Crz/Epic-Mapping/actions/workflows/accessibility.yml/badge.svg)](https://github.com/Thony-Crz/Epic-Mapping/actions/workflows/accessibility.yml)
```

### Badge de la CI principale
```markdown
[![CI/CD Pipeline](https://github.com/Thony-Crz/Epic-Mapping/actions/workflows/ci.yml/badge.svg)](https://github.com/Thony-Crz/Epic-Mapping/actions/workflows/ci.yml)
```

### Badge personnalisé d'accessibilité
```markdown
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1%20AA-blue.svg)](https://www.w3.org/WAI/WCAG21/quickref/)
```

### Badge de conformité
```markdown
[![Accessibilité](https://img.shields.io/badge/Accessibilité-Testée-green.svg)](./frontEnd/accessibility/README.md)
```

## Section README suggérée

Ajoutez cette section à votre README principal :

```markdown
## 🔍 Accessibilité

Cette application respecte les standards **WCAG 2.1 AA** pour l'accessibilité web.

[![Tests d'Accessibilité](https://github.com/Thony-Crz/Epic-Mapping/actions/workflows/accessibility.yml/badge.svg)](https://github.com/Thony-Crz/Epic-Mapping/actions/workflows/accessibility.yml)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1%20AA-blue.svg)](https://www.w3.org/WAI/WCAG21/quickref/)

### Tests Automatisés

- ✅ **135 tests d'accessibilité** couvrant les critères WCAG
- ✅ **Navigation au clavier** complète
- ✅ **Contraste des couleurs** (4.5:1 minimum)
- ✅ **Textes alternatifs** pour tous les médias
- ✅ **Formulaires accessibles** avec labels appropriés
- ✅ **Support des lecteurs d'écran**
- ✅ **Responsive** jusqu'à 200% de zoom

### Lancer les Tests

```bash
# Tests complets
npm run test:a11y

# Interface graphique
npx playwright test --ui --config=e2e/accessibility.config.ts

# Rapport HTML
npx playwright show-report accessibility-report
```

📖 [Guide complet d'accessibilité](./frontEnd/accessibility/README.md)
```

## Monitoring en continu

Les tests d'accessibilité sont exécutés :

1. **Automatiquement** : Chaque lundi à 9h (workflow programmé)
2. **Sur les PRs** : Mode informatif avec commentaires automatiques
3. **À la demande** : Workflow manuel avec options personnalisées
4. **En CI** : Mode non-bloquant intégré au pipeline principal

## Artefacts générés

Chaque exécution génère :
- 📊 **Rapport HTML interactif** : Navigation visuelle des résultats
- 📋 **Résultats JSON** : Données structurées pour l'analyse
- 📝 **Résumé markdown** : Vue d'ensemble lisible
- 🖼️ **Screenshots** : Capture des échecs pour debugging

## Intégration Slack/Teams (optionnel)

Pour recevoir des notifications sur les échecs d'accessibilité, ajoutez un webhook à votre workflow :

```yaml
- name: Notify accessibility results
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: custom
    custom_payload: |
      {
        text: "Tests d'accessibilité échoués sur Epic-Mapping",
        attachments: [{
          color: "warning",
          fields: [{
            title: "Projet",
            value: "Epic-Mapping",
            short: true
          }, {
            title: "Branche",
            value: "${{ github.ref }}",
            short: true
          }]
        }]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

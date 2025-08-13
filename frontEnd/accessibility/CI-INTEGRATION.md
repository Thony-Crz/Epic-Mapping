# Intégration CI/CD - Tests d'Accessibilité

## 🎯 Configuration Terminée

Vos tests d'accessibilité sont maintenant **intégrés en mode non-bloquant** dans votre pipeline CI/CD !

## 🔧 Ce qui a été configuré

### 1. Job CI Principal (ci.yml)
```yaml
accessibility-tests:
  runs-on: ubuntu-latest
  continue-on-error: true  # ← Mode non-bloquant
```

**Caractéristiques :**
- ✅ **Non-bloquant** : N'interrompt jamais la CI principale
- ✅ **Artefacts automatiques** : Rapports uploadés à chaque run
- ✅ **Commentaires PR** : Résultats directement sur les pull requests
- ✅ **Multi-navigateurs** : Tests sur Chromium, Firefox, WebKit

### 2. Workflow Dédié (accessibility.yml)
```yaml
on:
  workflow_dispatch:    # Déclenchement manuel
  schedule:             # Tous les lundis à 9h
  pull_request:         # Sur les PRs (informatif)
```

**Fonctionnalités avancées :**
- 🎛️ **Déclenchement manuel** avec options (navigateur, fichier de test)
- 📅 **Exécution programmée** hebdomadaire
- 📊 **Rapports globaux** multi-navigateurs
- 💬 **Commentaires automatiques** sur les PRs

## 🚀 Utilisation

### Commandes Locales
```bash
# Tests complets
npm run test:a11y

# Mode CI local
npm run test:a11y:ci

# Voir le rapport
npm run test:a11y:report
```

### Déclenchement Manuel GitHub
1. Allez sur **Actions** → **Tests d'Accessibilité WCAG**
2. Cliquez **Run workflow**
3. Choisissez vos options :
   - Navigateur (chromium/firefox/webkit/all)
   - Fichier de test spécifique (optionnel)

### Surveillance Continue
- **Automatique** : Tous les lundis à 9h UTC
- **Sur PR** : Commentaires informatifs automatiques
- **Sur push** : Job intégré au pipeline principal

## 📊 Rapports et Artefacts

### Ce qui est généré automatiquement :
1. **Rapport HTML interactif** (`accessibility-report/`)
2. **Résultats JSON** (`accessibility-results.json`)
3. **Screenshots des échecs** (`test-results/`)
4. **Résumé markdown** (`accessibility-summary.md`)

### Où les trouver :
- **GitHub Actions** → Votre workflow → **Artifacts** (en bas de page)
- **PR Comments** → Résumé automatique
- **Locally** → Après `npm run test:a11y`

## 🎨 Badges README

Ajoutez ces badges à votre README :

```markdown
[![Tests d'Accessibilité](https://github.com/Thony-Crz/Epic-Mapping/actions/workflows/accessibility.yml/badge.svg)](https://github.com/Thony-Crz/Epic-Mapping/actions/workflows/accessibility.yml)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1%20AA-blue.svg)](https://www.w3.org/WAI/WCAG21/quickref/)
```

## 🔍 Monitoring et Alertes

### Niveaux d'Évaluation Automatique :
- **✅ Excellent (95%+)** : Conformité remarquable
- **🟢 Très bon (85-94%)** : Bien accessible
- **🟡 Bon (70-84%)** : Améliorations recommandées  
- **🟠 Moyen (50-69%)** : Corrections importantes nécessaires
- **🔴 Insuffisant (<50%)** : Corrections majeures requises

### Notifications Automatiques :
- **Commentaires PR** : Résultats sur chaque pull request
- **Artifacts** : Rapports détaillés téléchargeables
- **Résumés** : Vue d'ensemble en markdown

## 🛠️ Personnalisation

### Modifier la Fréquence
Dans `.github/workflows/accessibility.yml` :
```yaml
schedule:
  - cron: '0 9 * * 1'  # Lundis 9h → Modifiez selon vos besoins
```

### Ajouter des Notifications Slack/Teams
```yaml
- name: Notify team
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: failure
    text: "Tests d'accessibilité échoués"
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Filtrer les Tests
```bash
# Seulement les tests WCAG généraux
npm run test:a11y:ci chromium wcag-compliance.spec.ts

# Tous les navigateurs, tests de formulaires
npm run test:a11y:ci all forms-accessibility.spec.ts
```

## 📋 Checklist d'Intégration

- [x] **CI principale mise à jour** avec job non-bloquant
- [x] **Workflow dédié** créé pour tests avancés
- [x] **Scripts automatisés** ajoutés au package.json
- [x] **Documentation complète** fournie
- [x] **Badges prêts** pour le README
- [x] **Commentaires PR** configurés
- [x] **Exécution programmée** activée

## 🎉 Résultat

Votre application Epic-Mapping respecte maintenant :
- ✅ **Standards WCAG 2.1 AA** automatiquement vérifiés
- ✅ **Pipeline CI non-bloquant** qui informe sans interrompre
- ✅ **Surveillance continue** avec rapports détaillés
- ✅ **Feedback développeurs** direct sur les PRs

**Prêt à utiliser !** 🚀

Votre première exécution se fera automatiquement à la prochaine action GitHub ou vous pouvez la déclencher manuellement dès maintenant.

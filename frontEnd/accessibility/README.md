# Tests d'Accessibilité WCAG

Ce dossier contient une suite complète de tests d'accessibilité pour assurer la conformité aux standards WCAG 2.1 AA.

## Vue d'ensemble

Les tests d'accessibilité vérifient que votre application respecte les critères WCAG (Web Content Accessibility Guidelines) et est utilisable par tous les utilisateurs, y compris ceux utilisant des technologies d'assistance.

## Structure des Tests

### 1. Tests WCAG Généraux (`wcag-compliance.spec.ts`)
- **Conformité WCAG 2.1 AA** : Tests automatisés avec axe-core
- **Navigation au clavier** : Vérification de l'accessibilité clavier
- **Contraste des couleurs** : Validation des rapports de contraste
- **Images et médias** : Vérification des textes alternatifs
- **Formulaires** : Labels et descriptions accessibles
- **Hiérarchie des titres** : Structure sémantique correcte
- **Technologies d'assistance** : Support des lecteurs d'écran
- **Responsive** : Accessibilité jusqu'à 200% de zoom

### 2. Navigation au Clavier (`keyboard-navigation.spec.ts`)
- **Ordre de tabulation** : Navigation logique avec Tab/Shift+Tab
- **Activation des éléments** : Boutons, liens, contrôles
- **Formulaires** : Navigation et soumission au clavier
- **Menus et dropdowns** : Interactions clavier
- **Raccourcis clavier** : Touches d'accélération
- **Pièges à clavier** : Détection et prévention
- **Focus visible** : Indicateurs visuels de focus

### 3. Accessibilité des Formulaires (`forms-accessibility.spec.ts`)
- **Labels** : Association correcte avec les champs
- **Messages d'erreur** : Accessibilité et association
- **Instructions** : Descriptions claires
- **Groupes de champs** : Fieldsets et legends
- **Validation** : Messages en temps réel accessibles
- **Contrôles personnalisés** : ARIA et interaction
- **Auto-complétion** : Suggestions accessibles

### 4. Contenu Multimédia (`multimedia-accessibility.spec.ts`)
- **Images** : Textes alternatifs appropriés
- **Vidéos** : Sous-titres et contrôles
- **Contraste** : Conformité WCAG AA
- **Redimensionnement** : Zoom jusqu'à 200%
- **Animations** : Respect des préférences utilisateur
- **Clignotement** : Prévention des contenus dangereux
- **Couleur seule** : Alternatives disponibles
- **Focus visible** : Indicateurs de navigation
- **Espacement** : Critères de confort visuel

### 5. Tests Complets avec Utilitaires (`comprehensive-accessibility.spec.ts`)
- **Rapports complets** : Évaluation globale
- **Tests de stress** : Navigation intensive
- **Simulation utilisateur malvoyant** : Test en conditions réelles

### 6. Utilitaires (`accessibility-helpers.ts`)
- **Fonctions helper** : Vérifications réutilisables
- **Constantes WCAG** : Standards de référence
- **Sélecteurs** : Éléments communs pour les tests

## Installation et Configuration

### Dépendances Installées
```json
{
  "@axe-core/playwright": "^latest",
  "axe-core": "^latest",
  "@types/node": "^latest"
}
```

### Configuration
Les tests utilisent une configuration Playwright spécialisée (`accessibility.config.ts`) qui :
- Lance l'application en mode build
- Génère des rapports détaillés
- Teste sur plusieurs navigateurs
- Capture les échecs avec screenshots

## Exécution des Tests

### Commandes Disponibles

```bash
# Lancer tous les tests d'accessibilité
npm run test:accessibility

# Alias court
npm run test:a11y

# Lancer un fichier de test spécifique
npx playwright test accessibility/wcag-compliance.spec.ts --config=e2e/accessibility.config.ts

# Lancer avec interface graphique
npx playwright test --ui --config=e2e/accessibility.config.ts

# Générer un rapport HTML
npx playwright show-report accessibility-report
```

### Rapports Générés

Les tests génèrent plusieurs types de rapports :
- **HTML Report** : Interface interactive dans `accessibility-report/`
- **JSON Report** : Données brutes dans `accessibility-results.json`
- **Console Output** : Résumé des erreurs en temps réel

## Standards WCAG Vérifiés

### Niveau A
- **1.1.1** Contenu non textuel
- **1.3.1** Information et relations
- **2.1.1** Accessibilité au clavier
- **2.4.1** Contournement de blocs
- **3.1.1** Langue de la page

### Niveau AA
- **1.4.3** Contraste (minimum)
- **1.4.4** Redimensionnement du texte
- **2.4.6** En-têtes et étiquettes
- **2.4.7** Focus visible
- **3.2.1** Au focus
- **3.3.1** Identification des erreurs
- **3.3.2** Étiquettes ou instructions

### Niveau AAA (optionnel)
- **1.4.6** Contraste (amélioré)
- **2.4.9** Fonction du lien (dans son contexte)

## Critères de Réussite

### Tests Critiques (doivent passer)
- Labels de formulaires
- Hiérarchie des titres
- Textes alternatifs des images
- Navigation au clavier
- Contraste des couleurs

### Tests d'Amélioration (avertissements)
- Optimisations de performance
- Bonnes pratiques UX
- Accessibilité avancée

## Intégration CI/CD

### GitHub Actions / Pipeline
```yaml
- name: Tests d'accessibilité
  run: |
    npm ci
    npm run build
    npm run test:accessibility
```

### Vérifications Pré-commit
Ajoutez à vos hooks git :
```bash
npm run test:accessibility
```

## Debugging et Dépannage

### Erreurs Communes

1. **Échec de contraste** : Vérifiez les couleurs CSS
2. **Labels manquants** : Ajoutez aria-label ou associez des labels
3. **Ordre de tabulation** : Utilisez tabindex si nécessaire
4. **Images sans alt** : Ajoutez des attributs alt appropriés

### Outils de Debug
- **Playwright Inspector** : `npx playwright test --debug`
- **Axe DevTools** : Extension navigateur
- **Screen Reader Testing** : NVDA, JAWS, VoiceOver

## Bonnes Pratiques

### Développement
- Testez avec un lecteur d'écran
- Naviguez uniquement au clavier
- Vérifiez les contrastes dès la conception
- Utilisez des éléments sémantiques HTML

### Tests
- Exécutez les tests à chaque modification
- Corrigez les erreurs critiques immédiatement
- Documentez les exceptions justifiées
- Testez sur de vrais utilisateurs

## Ressources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## Support

Pour des questions ou des améliorations sur les tests d'accessibilité, consultez :
- Documentation WCAG officielle
- Issues GitHub du projet
- Communauté Playwright

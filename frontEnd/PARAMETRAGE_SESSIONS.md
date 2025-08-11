# Paramétrage des Sessions

## Fonctionnalités

Le composant `SessionControls` permet maintenant de configurer la durée des sessions selon vos besoins.

### Options disponibles

1. **Durées prédéfinies** :
   - 15 minutes
   - 30 minutes (par défaut)
   - 45 minutes  
   - 1 heure (60 minutes)

2. **Durée personnalisée** :
   - Possibilité de saisir n'importe quelle durée en minutes
   - Validation automatique (durée minimum : 1 minute, maximum : 480 minutes / 8 heures)

### Utilisation

1. **Sélection d'une durée prédéfinie** :
   - Utilisez le menu déroulant pour choisir parmi les options disponibles
   - Cliquez sur "Démarrer la session" pour lancer

2. **Saisie d'une durée personnalisée** :
   - Sélectionnez "Personnalisé" dans le menu déroulant
   - Un champ de saisie apparaît
   - Entrez la durée souhaitée en minutes
   - Cliquez sur "Démarrer la session" pour lancer

### Interface

- **Design responsive** : S'adapte aux différentes tailles d'écran
- **Validation** : Contrôle automatique des valeurs saisies
- **Feedback visuel** : Affichage de la durée totale pendant la session active
- **Timer en temps réel** : Affichage du temps restant avec mise à jour en continu

### Exemples d'utilisation

- **Session courte** : 15 minutes pour une révision rapide
- **Session standard** : 30 minutes pour un travail concentré
- **Session longue** : 45 minutes ou 1 heure pour des tâches complexes
- **Session personnalisée** : 90 minutes pour des ateliers ou formations

### Architecture technique

Le système utilise :
- **Store Svelte** (`sessionStore`) pour la gestion d'état
- **Entité Session** pour la logique métier
- **Composant SessionControls** pour l'interface utilisateur
- **Tests unitaires** pour garantir la fiabilité

### Tests

Tous les scénarios sont couverts par des tests automatisés :
- Création de session avec durée par défaut
- Création de session avec durées personnalisées (15, 45, 75 minutes)
- Validation des valeurs
- Termination de session

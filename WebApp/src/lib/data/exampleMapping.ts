// src/lib/data/exampleMapping.ts

export const exampleMapping = [
  {
    id: 'epic-001',
    title: "Authentification",
    status: "open",
    features: [
      {
        id: 'feature-001-1',
        title: "Saisie login",
        status: "ready",
        scenarios: [
          { title: "L'utilisateur entre un identifiant valide", type: "green" },
          { title: "L'utilisateur entre un identifiant invalide", type: "green" },
          { title: "Et si le champ est vide ?", type: "grey" }
        ]
      },
      {
        id: 'feature-001-2',
        title: "Saisie mot de passe",
        status: "in-progress",
        scenarios: [
          { title: "Le mot de passe est correct", type: "green" },
          { title: "Mot de passe oublié", type: "grey" }
        ]
      }
    ]
  },
  {
    id: 'epic-002',
    title: "Navigation et Menu",
    status: "in progress",
    features: [
      {
        id: 'feature-002-1',
        title: "Menu principal",
        status: "ready",
        scenarios: [
          { title: "Affichage du menu utilisateur connecté", type: "green" },
          { title: "Sous-menus déroulants", type: "green" },
          { title: "Menu responsive sur mobile", type: "green" }
        ]
      },
      {
        id: 'feature-002-2',
        title: "Barre de recherche",
        status: "ready",
        scenarios: [
          { title: "Recherche avec résultats", type: "green" },
          { title: "Autocomplétion fonctionnelle", type: "green" }
        ]
      },
      {
        id: 'feature-002-3',
        title: "Fil d'Ariane",
        status: "ready",
        scenarios: [
          { title: "Navigation dans l'arborescence", type: "green" },
          { title: "Retour à la page précédente", type: "green" }
        ]
      }
    ]
  },
  {
    id: 'epic-003',
    title: "Gestion des utilisateurs",
    status: "closed",
    features: [
      {
        id: 'feature-003-1',
        title: "Création d'utilisateur",
        status: "ready",
        scenarios: [
          { title: "L'utilisateur saisit des informations valides", type: "green" },
          { title: "L'utilisateur oublie un champ obligatoire", type: "grey" }
        ]
      },
      {
        id: 'feature-003-2',
        title: "Suppression d'utilisateur",
        status: "in-progress",
        scenarios: [
          { title: "Suppression confirmée", type: "green" }
        ]
      }
    ]
  },
  {
    id: 'epic-004',
    title: "Gestion des rôles",
    status: "open",
    features: [
      {
        id: 'feature-004-1',
        title: "Attribution de rôle",
        status: "ready",
        scenarios: [
          { title: "Rôle administrateur attribué", type: "green" },
          { title: "Erreur lors de l'attribution", type: "grey" }
        ]
      }
    ]
  },
  {
    id: 'epic-005',
    title: "Tableau de bord",
    status: "in progress",
    features: [
      {
        id: 'feature-005-1',
        title: "Affichage des statistiques",
        status: "in-progress",
        scenarios: [
          { title: "Statistiques chargées avec succès", type: "green" },
          { title: "Erreur de chargement", type: "grey" }
        ]
      }
    ]
  },
  {
    id: 'epic-006',
    title: "Notifications",
    status: "open",
    features: [
      {
        id: 'feature-006-1',
        title: "Envoi de notification",
        status: "ready",
        scenarios: [
          { title: "Notification envoyée", type: "green" },
          { title: "Notification non envoyée", type: "grey" }
        ]
      }
    ]
  },
  {
    id: 'epic-007',
    title: "Paramètres",
    status: "closed",
    features: [
      {
        id: 'feature-007-1',
        title: "Modification du mot de passe",
        status: "ready",
        scenarios: [
          { title: "Mot de passe modifié", type: "green" },
          { title: "Ancien mot de passe incorrect", type: "grey" }
        ]
      }
    ]
  },
  {
    id: 'epic-008',
    title: "Support client",
    status: "in progress",
    features: [
      {
        id: 'feature-008-1',
        title: "Création de ticket",
        status: "in-progress",
        scenarios: [
          { title: "Ticket créé avec succès", type: "green" },
          { title: "Erreur lors de la création", type: "grey" }
        ]
      }
    ]
  },
  {
    id: 'epic-009',
    title: "Export de données",
    status: "open",
    features: [
      {
        id: 'feature-009-1',
        title: "Export CSV",
        status: "ready",
        scenarios: [
          { title: "Export réussi", type: "green" },
          { title: "Erreur d'export", type: "grey" }
        ]
      }
    ]
  },
  {
    id: 'epic-010',
    title: "Import de données",
    status: "open",
    features: [
      {
        id: 'feature-010-1',
        title: "Import CSV",
        status: "in-progress",
        scenarios: [
          { title: "Import réussi", type: "green" },
          { title: "Erreur d'import", type: "grey" }
        ]
      }
    ]
  },
  {
    id: 'epic-011',
    title: "Gestion des accès",
    status: "in progress",
    features: [
      {
        id: 'feature-011-1',
        title: "Connexion SSO",
        status: "ready",
        scenarios: [
          { title: "Connexion réussie", type: "green" },
          { title: "Échec de connexion", type: "grey" }
        ]
      }
    ]
  }
];

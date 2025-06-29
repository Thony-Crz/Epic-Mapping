// src/lib/data/exampleMapping.ts

export const exampleMapping = [
  {
    id: 'epic-001',
    title: "Authentification",
    status: "open",
    features: [
      {
        title: "Saisie login",
        scenarios: [
          { title: "L'utilisateur entre un identifiant valide", type: "green" },
          { title: "L'utilisateur entre un identifiant invalide", type: "green" },
          { title: "Et si le champ est vide ?", type: "grey" }
        ]
      },
      {
        title: "Saisie mot de passe",
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
        title: "Menu principal",
        scenarios: [
          { title: "Affichage du menu utilisateur connecté", type: "green" },
          { title: "Menu responsive sur mobile", type: "yellow" },
          { title: "Sous-menus déroulants", type: "green" }
        ]
      },
      {
        title: "Barre de recherche",
        scenarios: [
          { title: "Recherche avec résultats", type: "green" },
          { title: "Recherche sans résultat", type: "grey" },
          { title: "Autocomplétion des suggestions", type: "yellow" }
        ]
      },
      {
        title: "Fil d'Ariane",
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
        title: "Création d'utilisateur",
        scenarios: [
          { title: "L'utilisateur saisit des informations valides", type: "green" },
          { title: "L'utilisateur oublie un champ obligatoire", type: "grey" }
        ]
      },
      {
        title: "Suppression d'utilisateur",
        scenarios: [
          { title: "Suppression confirmée", type: "green" },
          { title: "Annulation de la suppression", type: "yellow" }
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
        title: "Attribution de rôle",
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
        title: "Affichage des statistiques",
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
        title: "Envoi de notification",
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
        title: "Modification du mot de passe",
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
        title: "Création de ticket",
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
        title: "Export CSV",
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
        title: "Import CSV",
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
        title: "Connexion SSO",
        scenarios: [
          { title: "Connexion réussie", type: "green" },
          { title: "Échec de connexion", type: "grey" }
        ]
      }
    ]
  }
];

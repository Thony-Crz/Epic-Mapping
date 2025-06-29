// src/lib/data/exampleMapping.ts

// Projets par défaut
export const exampleProjects = [
  {
    id: 'project-001',
    name: 'Application Web E-Commerce',
    description: 'Plateforme de vente en ligne avec gestion des utilisateurs et commandes',
    color: '#3B82F6',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'project-002', 
    name: 'Système de Gestion Interne',
    description: 'Outils de gestion des employés, rôles et processus internes',
    color: '#10B981',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: 'project-003',
    name: 'API et Services',
    description: 'Services backend et APIs pour les applications métier',
    color: '#F59E0B',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20')
  }
];

export const exampleMapping = [
  // ====== ÉPICS READY (prêtes pour l'export) ======
  {
    id: 'epic-001',
    title: "Authentification Utilisateur",
    status: "closed", // Épic terminée = ready pour l'export
    projectId: 'project-001',
    features: [
      {
        id: 'feature-001-1',
        title: "Saisie login",
        status: "ready",
        scenarios: [
          { title: "L'utilisateur entre un identifiant valide", type: "green" },
          { title: "L'utilisateur entre un identifiant invalide", type: "green" },
          { title: "Et si le champ est vide ?", type: "green" }
        ]
      },
      {
        id: 'feature-001-2',
        title: "Saisie mot de passe",
        status: "ready",
        scenarios: [
          { title: "Le mot de passe est correct", type: "green" },
          { title: "Mot de passe oublié", type: "green" },
          { title: "Mot de passe expiré", type: "green" }
        ]
      },
      {
        id: 'feature-001-3',
        title: "Gestion de session",
        status: "ready",
        scenarios: [
          { title: "Session active maintenue", type: "green" },
          { title: "Déconnexion automatique après timeout", type: "green" }
        ]
      }
    ]
  },
  {
    id: 'epic-002',
    title: "Navigation et Menu",
    status: "closed", // Épic terminée = ready pour l'export
    projectId: 'project-001',
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
          { title: "Autocomplétion fonctionnelle", type: "green" },
          { title: "Recherche sans résultats", type: "green" }
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
    title: "Gestion des Employés",
    status: "closed", // Épic terminée = ready pour l'export
    projectId: 'project-002',
    features: [
      {
        id: 'feature-003-1',
        title: "Création d'employé",
        status: "ready",
        scenarios: [
          { title: "L'utilisateur saisit des informations valides", type: "green" },
          { title: "Validation des champs obligatoires", type: "green" },
          { title: "Email déjà existant", type: "green" }
        ]
      },
      {
        id: 'feature-003-2',
        title: "Modification d'employé",
        status: "ready",
        scenarios: [
          { title: "Modification réussie", type: "green" },
          { title: "Employé inexistant", type: "green" }
        ]
      }
    ]
  },
  {
    id: 'epic-004',
    title: "API Authentification",
    status: "closed", // Épic terminée = ready pour l'export
    projectId: 'project-003',
    features: [
      {
        id: 'feature-004-1',
        title: "Endpoint login",
        status: "ready",
        scenarios: [
          { title: "Authentification réussie", type: "green" },
          { title: "Identifiants incorrects", type: "green" },
          { title: "Compte bloqué", type: "green" }
        ]
      },
      {
        id: 'feature-004-2',
        title: "Gestion des tokens JWT",
        status: "ready",
        scenarios: [
          { title: "Token valide généré", type: "green" },
          { title: "Token expiré", type: "green" },
          { title: "Refresh token", type: "green" }
        ]
      }
    ]
  },

  // ====== ÉPICS EN COURS ======
  {
    id: 'epic-005',
    title: "Panier E-Commerce",
    status: "in progress",
    projectId: 'project-001',
    features: [
      {
        id: 'feature-005-1',
        title: "Ajout au panier",
        status: "ready",
        scenarios: [
          { title: "Produit ajouté avec succès", type: "green" },
          { title: "Produit en rupture de stock", type: "green" }
        ]
      },
      {
        id: 'feature-005-2',
        title: "Calcul des totaux",
        status: "in-progress",
        scenarios: [
          { title: "Total calculé correctement", type: "green" },
          { title: "Application des remises", type: "yellow" },
          { title: "Gestion des taxes", type: "grey" }
        ]
      }
    ]
  },
  {
    id: 'epic-006',
    title: "Gestion des Rôles",
    status: "in progress",
    projectId: 'project-002',
    features: [
      {
        id: 'feature-006-1',
        title: "Attribution de rôle",
        status: "ready",
        scenarios: [
          { title: "Rôle administrateur attribué", type: "green" },
          { title: "Rôle utilisateur standard", type: "green" }
        ]
      },
      {
        id: 'feature-006-2',
        title: "Permissions dynamiques",
        status: "in-progress",
        scenarios: [
          { title: "Vérification des permissions", type: "green" },
          { title: "Accès refusé", type: "yellow" },
          { title: "Permissions héritées", type: "grey" }
        ]
      }
    ]
  },
  {
    id: 'epic-007',
    title: "Tableau de Bord Analytics",
    status: "in progress",
    projectId: 'project-001',
    features: [
      {
        id: 'feature-007-1',
        title: "Graphiques de vente",
        status: "in-progress",
        scenarios: [
          { title: "Graphiques chargés", type: "green" },
          { title: "Données manquantes", type: "yellow" },
          { title: "Période personnalisée", type: "grey" }
        ]
      },
      {
        id: 'feature-007-2',
        title: "Export des rapports",
        status: "draft",
        scenarios: [
          { title: "Export PDF généré", type: "yellow" },
          { title: "Erreur de génération", type: "grey" }
        ]
      }
    ]
  },
  {
    id: 'epic-008',
    title: "API de Gestion des Données",
    status: "in progress",
    projectId: 'project-003',
    features: [
      {
        id: 'feature-008-1',
        title: "Endpoints CRUD",
        status: "ready",
        scenarios: [
          { title: "Création d'entité", type: "green" },
          { title: "Lecture d'entité", type: "green" },
          { title: "Mise à jour d'entité", type: "green" }
        ]
      },
      {
        id: 'feature-008-2',
        title: "Validation des données",
        status: "in-progress",
        scenarios: [
          { title: "Données valides", type: "green" },
          { title: "Champs obligatoires manquants", type: "yellow" },
          { title: "Format de données incorrect", type: "grey" }
        ]
      }
    ]
  },

  // ====== ÉPICS ARCHIVÉES ======
  {
    id: 'epic-009',
    title: "Ancien Système de Notifications",
    status: "archived",
    projectId: 'project-001',
    features: [
      {
        id: 'feature-009-1',
        title: "Notifications par email",
        status: "ready",
        scenarios: [
          { title: "Email envoyé", type: "green" },
          { title: "Email non delivré", type: "green" }
        ]
      }
    ]
  },
  {
    id: 'epic-010',
    title: "Première Version RH",
    status: "archived",
    projectId: 'project-002',
    features: [
      {
        id: 'feature-010-1',
        title: "Fiche employé basique",
        status: "ready",
        scenarios: [
          { title: "Affichage des informations", type: "green" },
          { title: "Modification limitée", type: "green" }
        ]
      }
    ]
  },
  {
    id: 'epic-011',
    title: "API v1 (Dépréciée)",
    status: "archived",
    projectId: 'project-003',
    features: [
      {
        id: 'feature-011-1',
        title: "Authentification basique",
        status: "ready",
        scenarios: [
          { title: "Login/password simple", type: "green" },
          { title: "Session limitée", type: "green" }
        ]
      }
    ]
  },

  // ====== NOUVELLES ÉPICS EN DÉVELOPPEMENT ======
  {
    id: 'epic-012',
    title: "Commandes et Paiements",
    status: "in progress",
    projectId: 'project-001',
    features: [
      {
        id: 'feature-012-1',
        title: "Processus de commande",
        status: "draft",
        scenarios: [
          { title: "Commande créée", type: "yellow" },
          { title: "Validation du panier", type: "grey" }
        ]
      },
      {
        id: 'feature-012-2',
        title: "Intégration paiement",
        status: "draft",
        scenarios: [
          { title: "Paiement par carte", type: "yellow" },
          { title: "Paiement refusé", type: "grey" }
        ]
      }
    ]
  },
  {
    id: 'epic-013',
    title: "Workflows RH Avancés",
    status: "in progress",
    projectId: 'project-002',
    features: [
      {
        id: 'feature-013-1',
        title: "Demandes de congés",
        status: "draft",
        scenarios: [
          { title: "Demande soumise", type: "yellow" },
          { title: "Validation hiérarchique", type: "grey" }
        ]
      }
    ]
  },
  {
    id: 'epic-014',
    title: "API GraphQL",
    status: "in progress",
    projectId: 'project-003',
    features: [
      {
        id: 'feature-014-1',
        title: "Schema GraphQL",
        status: "draft",
        scenarios: [
          { title: "Requête simple", type: "yellow" },
          { title: "Requête complexe avec relations", type: "grey" }
        ]
      }
    ]
  }
];

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
  }
];

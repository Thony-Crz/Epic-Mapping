// src/lib/stores/epicsStore.ts
import { writable } from 'svelte/store';
import { exampleMapping } from '../data/exampleMapping';

// Types pour la structure des données
export interface Scenario {
  title: string;
  type: 'green' | 'grey' | 'yellow';
}

export interface Feature {
  id: string;
  title: string;
  status: 'ready' | 'in-progress' | 'todo';
  scenarios: Scenario[];
}

export interface Epic {
  id: string;
  title: string;
  status: 'open' | 'in progress' | 'closed';
  features: Feature[];
}

// Store pour les epics
function initializeEpicsWithIds(epics: any[]): Epic[] {
  return epics.map(epic => ({
    ...epic,
    features: epic.features.map((feature: any) => ({
      ...feature,
      id: feature.id || crypto.randomUUID()
    }))
  }));
}

export const epicsStore = writable<Epic[]>(initializeEpicsWithIds(exampleMapping));

// Fonction pour ajouter une nouvelle epic
export function addNewEpic(title: string) {
  epicsStore.update(epics => {
    // Générer un nouvel ID
    const newId = `epic-${String(epics.length + 1).padStart(3, '0')}`;
    
    const newEpic: Epic = {
      id: newId,
      title,
      status: 'open',
      features: []
    };
    
    return [...epics, newEpic];
  });
}

// Fonction pour ajouter une feature à une epic
export function addFeatureToEpic(epicId: string, featureTitle: string) {
  epicsStore.update(epics => {
    return epics.map(epic => {
      if (epic.id === epicId) {
        const newFeature: Feature = {
          id: crypto.randomUUID(),
          title: featureTitle,
          status: 'todo' as const,
          scenarios: []
        };
        return {
          ...epic,
          features: [...epic.features, newFeature]
        };
      }
      return epic;
    });
  });
}

// Fonction pour ajouter un scénario à une feature
export function addScenarioToFeature(epicId: string, featureIndex: number, scenarioTitle: string, scenarioType: 'green' | 'grey' | 'yellow' = 'grey') {
  epicsStore.update(epics => {
    return epics.map(epic => {
      if (epic.id === epicId) {
        const updatedFeatures = [...epic.features];
        if (updatedFeatures[featureIndex]) {
          const newScenario: Scenario = {
            title: scenarioTitle,
            type: scenarioType
          };
          updatedFeatures[featureIndex] = {
            ...updatedFeatures[featureIndex],
            scenarios: [...updatedFeatures[featureIndex].scenarios, newScenario]
          };
        }
        return {
          ...epic,
          features: updatedFeatures
        };
      }
      return epic;
    });
  });
}

// Fonction pour ajouter un scénario à une feature par ID
export function addScenarioToFeatureById(epicId: string, featureId: string, scenarioTitle: string, scenarioType: 'green' | 'grey' | 'yellow' = 'grey') {
  epicsStore.update(epics => {
    return epics.map(epic => {
      if (epic.id === epicId) {
        const updatedFeatures = epic.features.map(feature => {
          if (feature.id === featureId) {
            const newScenario: Scenario = {
              title: scenarioTitle,
              type: scenarioType
            };
            const updatedScenarios = [...feature.scenarios, newScenario];
            
            // Vérifier si on doit changer le statut automatiquement
            const hasGreenCards = updatedScenarios.some(scenario => scenario.type === 'green');
            let newStatus = feature.status;
            
            // Si la feature est en "todo" et qu'on ajoute une carte verte, passer à "in-progress"
            if (feature.status === 'todo' && scenarioType === 'green') {
              newStatus = 'in-progress';
            }
            
            return {
              ...feature,
              scenarios: updatedScenarios,
              status: newStatus
            };
          }
          return feature;
        });
        return {
          ...epic,
          features: updatedFeatures
        };
      }
      return epic;
    });
  });
}

// Fonction pour mettre à jour le titre d'une epic
export function updateEpicTitle(epicId: string, newTitle: string) {
  epicsStore.update(epics => {
    return epics.map(epic => {
      if (epic.id === epicId) {
        return {
          ...epic,
          title: newTitle
        };
      }
      return epic;
    });
  });
}

// Fonction pour mettre à jour une feature
export function updateFeature(epicId: string, featureId: string, newTitle: string) {
  epicsStore.update(epics => {
    return epics.map(epic => {
      if (epic.id === epicId) {
        const updatedFeatures = epic.features.map(feature => {
          if (feature.id === featureId) {
            return {
              ...feature,
              title: newTitle
            };
          }
          return feature;
        });
        return {
          ...epic,
          features: updatedFeatures
        };
      }
      return epic;
    });
  });
}

// Fonction pour mettre à jour un scénario
export function updateScenario(epicId: string, featureId: string, scenarioIndex: number, newTitle: string) {
  epicsStore.update(epics => {
    return epics.map(epic => {
      if (epic.id === epicId) {
        const updatedFeatures = epic.features.map(feature => {
          if (feature.id === featureId) {
            const updatedScenarios = [...feature.scenarios];
            if (updatedScenarios[scenarioIndex]) {
              updatedScenarios[scenarioIndex] = {
                ...updatedScenarios[scenarioIndex],
                title: newTitle
              };
            }
            return {
              ...feature,
              scenarios: updatedScenarios
            };
          }
          return feature;
        });
        return {
          ...epic,
          features: updatedFeatures
        };
      }
      return epic;
    });
  });
}

// Fonction pour mettre à jour le statut d'une feature
export function updateFeatureStatus(epicId: string, featureId: string, newStatus: 'ready' | 'in-progress' | 'todo') {
  epicsStore.update(epics => {
    return epics.map(epic => {
      if (epic.id === epicId) {
        const updatedFeatures = epic.features.map(feature => {
          if (feature.id === featureId) {
            return {
              ...feature,
              status: newStatus
            };
          }
          return feature;
        });
        return {
          ...epic,
          features: updatedFeatures
        };
      }
      return epic;
    });
  });
}

// Fonction pour gérer la transition automatique des statuts
export function handleAutomaticStatusTransition(epicId: string, featureId: string, scenarios: Scenario[]) {
  epicsStore.update(epics => {
    return epics.map(epic => {
      if (epic.id === epicId) {
        const updatedFeatures = epic.features.map(feature => {
          if (feature.id === featureId) {
            // Vérifier s'il y a des cartes vertes
            const hasGreenCards = scenarios.some(scenario => scenario.type === 'green');
            
            // Si la feature est en "todo" et qu'il y a des cartes vertes, passer à "in-progress"
            if (feature.status === 'todo' && hasGreenCards) {
              return {
                ...feature,
                status: 'in-progress' as const
              };
            }
            return feature;
          }
          return feature;
        });
        return {
          ...epic,
          features: updatedFeatures
        };
      }
      return epic;
    });
  });
}

// Fonction pour réorganiser les features dans une epic
export function reorderFeatures(epicId: string, newFeatures: Feature[]) {
  epicsStore.update(epics => {
    return epics.map(epic => {
      if (epic.id === epicId) {
        return {
          ...epic,
          features: newFeatures
        };
      }
      return epic;
    });
  });
}

// Fonction pour réorganiser les scenarios dans une feature
export function reorderScenarios(epicId: string, featureId: string, newScenarios: Scenario[]) {
  epicsStore.update(epics => {
    return epics.map(epic => {
      if (epic.id === epicId) {
        const updatedFeatures = epic.features.map(feature => {
          if (feature.id === featureId) {
            return {
              ...feature,
              scenarios: newScenarios
            };
          }
          return feature;
        });
        return {
          ...epic,
          features: updatedFeatures
        };
      }
      return epic;
    });
  });
}

// Fonction pour déplacer un scenario d'une feature à une autre
export function moveScenarioBetweenFeatures(
  epicId: string, 
  sourceFeatureId: string, 
  targetFeatureId: string, 
  scenarioIndex: number, 
  targetIndex: number
) {
  epicsStore.update(epics => {
    return epics.map(epic => {
      if (epic.id === epicId) {
        const sourceFeature = epic.features.find(f => f.id === sourceFeatureId);
        const targetFeature = epic.features.find(f => f.id === targetFeatureId);
        
        if (!sourceFeature || !targetFeature || !sourceFeature.scenarios[scenarioIndex]) {
          return epic;
        }

        const scenarioToMove = sourceFeature.scenarios[scenarioIndex];
        
        const updatedFeatures = epic.features.map(feature => {
          if (feature.id === sourceFeatureId) {
            // Retirer le scenario de la feature source
            const newScenarios = [...feature.scenarios];
            newScenarios.splice(scenarioIndex, 1);
            return {
              ...feature,
              scenarios: newScenarios
            };
          } else if (feature.id === targetFeatureId) {
            // Ajouter le scenario à la feature target
            const newScenarios = [...feature.scenarios];
            newScenarios.splice(targetIndex, 0, scenarioToMove);
            return {
              ...feature,
              scenarios: newScenarios
            };
          }
          return feature;
        });
        
        return {
          ...epic,
          features: updatedFeatures
        };
      }
      return epic;
    });
  });
}

// Fonction pour supprimer un scenario
export function deleteScenario(epicId: string, featureId: string, scenarioIndex: number) {
  epicsStore.update(epics => {
    return epics.map(epic => {
      if (epic.id === epicId) {
        return {
          ...epic,
          features: epic.features.map(feature => {
            if (feature.id === featureId) {
              const newScenarios = [...feature.scenarios];
              newScenarios.splice(scenarioIndex, 1);
              return {
                ...feature,
                scenarios: newScenarios
              };
            }
            return feature;
          })
        };
      }
      return epic;
    });
  });
}

// Fonction pour supprimer une feature
export function deleteFeature(epicId: string, featureId: string) {
  epicsStore.update(epics => {
    return epics.map(epic => {
      if (epic.id === epicId) {
        return {
          ...epic,
          features: epic.features.filter(feature => feature.id !== featureId)
        };
      }
      return epic;
    });
  });
}

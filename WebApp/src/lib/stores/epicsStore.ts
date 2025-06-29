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

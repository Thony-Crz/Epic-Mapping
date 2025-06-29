// src/lib/stores/epicsStore.ts
import { writable } from 'svelte/store';
import { exampleMapping } from '../data/exampleMapping';

// Types pour la structure des données
export interface Scenario {
  title: string;
  type: 'green' | 'grey' | 'yellow';
}

export interface Feature {
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
export const epicsStore = writable<Epic[]>(exampleMapping as Epic[]);

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
          title: featureTitle,
          status: 'todo',
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

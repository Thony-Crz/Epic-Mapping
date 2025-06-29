// src/lib/stores/epicsStore.new.ts

import { derived } from 'svelte/store';
import { serviceContainer } from '../../services/ServiceContainer';
import type { Epic, EpicProps } from '../../domain/entities';

// Export du store réactif pour l'UI (entités)
export const epicsStore = serviceContainer.getEpicsStore();

// Store dérivé pour l'affichage (props sérialisées)
export const epicsDisplayStore = derived(epicsStore, (epics: Epic[]) => {
  return epics.map(epic => epic.toProps());
});

// Service pour les opérations métier
const epicService = serviceContainer.getEpicService();

// API simplifiée pour l'UI - chaque fonction utilise les use cases appropriés

export async function addNewEpic(title: string, projectId: string) {
  try {
    await epicService.createNewEpic({ title, projectId });
  } catch (error) {
    console.error('Failed to create epic:', error);
    throw error;
  }
}

export async function updateEpicTitle(epicId: string, newTitle: string) {
  try {
    await epicService.updateEpicDetails({ epicId, title: newTitle });
  } catch (error) {
    console.error('Failed to update epic title:', error);
    throw error;
  }
}

export async function addFeatureToEpic(epicId: string, featureTitle: string) {
  try {
    await epicService.addFeature({ epicId, title: featureTitle });
  } catch (error) {
    console.error('Failed to add feature:', error);
    throw error;
  }
}

export async function updateFeature(epicId: string, featureId: string, newTitle: string) {
  try {
    await epicService.updateFeatureDetails({ epicId, featureId, title: newTitle });
  } catch (error) {
    console.error('Failed to update feature:', error);
    throw error;
  }
}

export async function updateFeatureStatus(epicId: string, featureId: string, newStatus: 'ready' | 'in-progress' | 'todo') {
  try {
    await epicService.updateFeatureDetails({ epicId, featureId, status: newStatus });
  } catch (error) {
    console.error('Failed to update feature status:', error);
    throw error;
  }
}

export async function deleteFeature(epicId: string, featureId: string) {
  try {
    await epicService.removeFeature({ epicId, featureId });
  } catch (error) {
    console.error('Failed to delete feature:', error);
    throw error;
  }
}

export async function addScenarioToFeatureById(
  epicId: string, 
  featureId: string, 
  scenarioTitle: string, 
  scenarioType: 'green' | 'grey' | 'yellow' = 'grey'
) {
  try {
    await epicService.addScenario({ epicId, featureId, title: scenarioTitle, type: scenarioType });
  } catch (error) {
    console.error('Failed to add scenario:', error);
    throw error;
  }
}

export async function updateScenario(
  epicId: string, 
  featureId: string, 
  scenarioIndex: number, 
  newTitle: string
) {
  try {
    await epicService.updateScenarioDetails({ epicId, featureId, scenarioIndex, title: newTitle });
  } catch (error) {
    console.error('Failed to update scenario:', error);
    throw error;
  }
}

export async function deleteScenario(epicId: string, featureId: string, scenarioIndex: number) {
  try {
    await epicService.removeScenario({ epicId, featureId, scenarioIndex });
  } catch (error) {
    console.error('Failed to delete scenario:', error);
    throw error;
  }
}

// Fonctions utilitaires pour des opérations complexes
export async function reorderFeatures(epicId: string, newFeatures: Epic['features']) {
  try {
    const epic = await epicService.getEpicById(epicId);
    if (!epic) {
      throw new Error(`Epic with id ${epicId} not found`);
    }
    
    const updatedEpic = epic.reorderFeatures(newFeatures);
    await serviceContainer.getEpicRepository().save(updatedEpic);
  } catch (error) {
    console.error('Failed to reorder features:', error);
    throw error;
  }
}

export async function reorderScenarios(epicId: string, featureId: string, newScenarios: Epic['features'][0]['scenarios']) {
  try {
    const epic = await epicService.getEpicById(epicId);
    if (!epic) {
      throw new Error(`Epic with id ${epicId} not found`);
    }
    
    const feature = epic.features.find(f => f.id === featureId);
    if (!feature) {
      throw new Error(`Feature with id ${featureId} not found`);
    }

    const updatedFeature = feature.reorderScenarios(newScenarios);
    const updatedEpic = epic.updateFeature(featureId, updatedFeature);
    await serviceContainer.getEpicRepository().save(updatedEpic);
  } catch (error) {
    console.error('Failed to reorder scenarios:', error);
    throw error;
  }
}

export async function moveScenarioBetweenFeatures(
  epicId: string,
  sourceFeatureId: string,
  targetFeatureId: string,
  scenarioIndex: number,
  targetIndex: number
) {
  try {
    const epic = await epicService.getEpicById(epicId);
    if (!epic) {
      throw new Error(`Epic with id ${epicId} not found`);
    }

    const sourceFeature = epic.features.find(f => f.id === sourceFeatureId);
    const targetFeature = epic.features.find(f => f.id === targetFeatureId);
    
    if (!sourceFeature || !targetFeature) {
      throw new Error('Source or target feature not found');
    }

    if (scenarioIndex < 0 || scenarioIndex >= sourceFeature.scenarios.length) {
      throw new Error('Invalid scenario index');
    }

    const scenarioToMove = sourceFeature.scenarios[scenarioIndex];
    
    // Retirer le scénario de la feature source
    const updatedSourceFeature = sourceFeature.removeScenario(scenarioIndex);
    
    // Ajouter le scénario à la feature target à l'index spécifié
    const newTargetScenarios = [...targetFeature.scenarios];
    newTargetScenarios.splice(targetIndex, 0, scenarioToMove);
    const updatedTargetFeature = targetFeature.reorderScenarios(newTargetScenarios);

    // Mettre à jour l'epic avec les deux features modifiées
    let updatedEpic = epic.updateFeature(sourceFeatureId, updatedSourceFeature);
    updatedEpic = updatedEpic.updateFeature(targetFeatureId, updatedTargetFeature);
    
    await serviceContainer.getEpicRepository().save(updatedEpic);
  } catch (error) {
    console.error('Failed to move scenario between features:', error);
    throw error;
  }
}

export async function deleteEpic(epicId: string) {
  try {
    await epicService.removeEpic({ epicId });
  } catch (error) {
    console.error('Failed to delete epic:', error);
    throw error;
  }
}

export async function archiveEpic(epicId: string) {
  try {
    const epic = await epicService.getEpicById(epicId);
    if (!epic) {
      throw new Error(`Epic with id ${epicId} not found`);
    }
    
    const archivedEpic = epic.archive();
    await serviceContainer.getEpicRepository().save(archivedEpic);
  } catch (error) {
    console.error('Failed to archive epic:', error);
    throw error;
  }
}

// Fonctions dépréciées pour compatibilité ascendante
export function addScenarioToFeature(epicId: string, featureIndex: number, scenarioTitle: string, scenarioType: 'green' | 'grey' | 'yellow' = 'grey') {
  console.warn('addScenarioToFeature is deprecated, use addScenarioToFeatureById instead');
  // Cette fonction pourrait être implémentée pour maintenir la compatibilité si nécessaire
  throw new Error('This function is deprecated, please use addScenarioToFeatureById instead');
}

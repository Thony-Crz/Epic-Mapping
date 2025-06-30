// src/infrastructure/repositories/SvelteEpicRepository.ts

import { writable, type Writable } from 'svelte/store';
import { Epic, Feature, Scenario } from '../../domain/entities';
import type { EpicRepository } from '../../domain/repositories';
import { exampleMapping } from '../../lib/data/exampleMapping';

function initializeEpicsWithIds(epics: any[]): Epic[] {
  return epics.map((epic, epicIndex) => {
    const features = epic.features.map((feature: any, index: number) => {
      const scenarios = feature.scenarios.map((scenario: any) => ({
        title: scenario.title,
        type: scenario.type
      }));

      return {
        id: feature.id || `feature-${epic.id}-${index + 1}`,
        title: feature.title,
        status: feature.status,
        scenarios
      };
    });

    const epicResult = Epic.fromProps({
      id: epic.id,
      title: epic.title,
      status: epic.status,
      projectId: epic.projectId, // Ajout du projectId
      features
    });
    
    return epicResult;
  });
}

export class SvelteEpicRepository implements EpicRepository {
  private store: Writable<Epic[]>;

  constructor() {
    this.store = writable<Epic[]>(initializeEpicsWithIds(exampleMapping));
  }

  // Méthode pour réinitialiser les données avec les nouvelles données d'exemple
  reinitializeData(): void {
    this.store.set(initializeEpicsWithIds(exampleMapping));
  }

  getStore(): Writable<Epic[]> {
    return this.store;
  }

  async findAll(): Promise<Epic[]> {
    return new Promise((resolve) => {
      this.store.subscribe((epics) => {
        resolve(epics);
      })();
    });
  }

  async findById(id: string): Promise<Epic | null> {
    const epics = await this.findAll();
    return epics.find(epic => epic.id === id) || null;
  }

  async save(epic: Epic): Promise<void> {
    this.store.update(epics => {
      const existingIndex = epics.findIndex(e => e.id === epic.id);
      
      if (existingIndex >= 0) {
        // Mise à jour
        const newEpics = [...epics];
        newEpics[existingIndex] = epic;
        return newEpics;
      } else {
        // Création
        return [...epics, epic];
      }
    });
  }

  async delete(id: string): Promise<void> {
    this.store.update(epics => {
      return epics.filter(epic => epic.id !== id);
    });
  }
}

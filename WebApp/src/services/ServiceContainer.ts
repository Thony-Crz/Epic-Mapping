// src/services/ServiceContainer.ts

import { SvelteEpicRepository } from '../infrastructure/repositories/SvelteEpicRepository';
import { EpicService } from './EpicService';

class ServiceContainer {
  private static instance: ServiceContainer;
  private epicRepository: SvelteEpicRepository;
  private epicService: EpicService;

  private constructor() {
    // Initialize dependencies
    this.epicRepository = new SvelteEpicRepository();
    this.epicService = new EpicService(this.epicRepository);
  }

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  getEpicService(): EpicService {
    return this.epicService;
  }

  getEpicRepository(): SvelteEpicRepository {
    return this.epicRepository;
  }

  // Expose the Svelte store for reactive UI
  getEpicsStore() {
    return this.epicRepository.getStore();
  }
}

export const serviceContainer = ServiceContainer.getInstance();

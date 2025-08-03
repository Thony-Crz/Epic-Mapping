// src/services/ServiceContainer.ts

import { SvelteEpicRepository } from '../infrastructure/repositories/SvelteEpicRepository';
import { EpicService } from './EpicService';
import { ProjectService } from './ProjectService';
import type { ProjectProps } from '../domain/entities/Project';

class ServiceContainer {
	private static instance: ServiceContainer;
	private epicRepository: SvelteEpicRepository;
	private epicService: EpicService;
	private projectService: ProjectService;

	private constructor() {
		// Initialize dependencies
		this.epicRepository = new SvelteEpicRepository();
		this.epicService = new EpicService(this.epicRepository);
		this.projectService = new ProjectService();
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

	getProjectService(): ProjectService {
		return this.projectService;
	}

	getEpicRepository(): SvelteEpicRepository {
		return this.epicRepository;
	}

	// Expose the Svelte store for reactive UI
	getEpicsStore() {
		return this.epicRepository.getStore();
	}

	// Méthode pour réinitialiser les données d'exemple
	reinitializeEpicsData(): void {
		this.epicRepository.reinitializeData();
	}

	// Méthode pour réinitialiser les données de projets
	async reinitializeProjectsData(exampleProjects: ProjectProps[]): Promise<void> {
		await this.projectService.reinitializeWithExampleData(exampleProjects);
	}

	// Méthode pour vider complètement le localStorage et forcer la réinitialisation
	async clearAllData(): Promise<void> {
		await this.projectService.clearStorage();
		this.epicRepository.reinitializeData();
	}
}

export const serviceContainer = ServiceContainer.getInstance();

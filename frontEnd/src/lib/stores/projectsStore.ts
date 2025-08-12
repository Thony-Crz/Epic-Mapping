// src/lib/stores/projectsStore.ts

import { writable } from 'svelte/store';
import { serviceContainer } from '../../services/ServiceContainer';
import type { Project } from '../../domain/entities/Project';
import type { CreateProjectRequest } from '../../features/project-management/use-cases';
import { exampleProjects } from '../data/exampleMapping';

const projectService = serviceContainer.getProjectService();

// Store réactif pour les projets
export const projectsStore = writable<Project[]>([]);

// Actions pour gérer les projets
export async function loadProjects() {
	try {
		let projects = await projectService.getAllProjects();

		// Si aucun projet n'existe, initialiser avec les projets d'exemple
		if (projects.length === 0) {
			for (const projectData of exampleProjects) {
				const request: CreateProjectRequest = {
					id: projectData.id, // Utiliser l'ID prédéfini
					name: projectData.name,
					description: projectData.description,
					color: projectData.color
				};
				await projectService.createProject(request);
			}
			projects = await projectService.getAllProjects();
		}

		projectsStore.set(projects);
		return projects;
	} catch (error) {
		console.error('Erreur lors du chargement des projets:', error);
		throw error;
	}
}

export async function createProject(request: CreateProjectRequest): Promise<Project> {
	try {
		const newProject = await projectService.createProject(request);

		projectsStore.update((projects) => {
			const updatedProjects = [...projects, newProject];
			return updatedProjects;
		});

		return newProject;
	} catch (error) {
		console.error('❌ Erreur lors de la création du projet dans le store:', error);
		throw error;
	}
}

export async function deleteProject(projectId: string) {
	try {
		await projectService.deleteProject(projectId);

		// Mettre à jour le store
		projectsStore.update((projects) => projects.filter((p) => p.id !== projectId));
	} catch (error) {
		console.error('Erreur lors de la suppression du projet:', error);
		throw error;
	}
}

// Initialiser le store au premier import (uniquement côté client)
if (typeof window !== 'undefined') {
	loadProjects();
}

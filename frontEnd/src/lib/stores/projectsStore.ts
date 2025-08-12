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
		console.log('🔍 Chargement des projets...');
		let projects = await projectService.getAllProjects();
		console.log(`📋 Projets existants trouvés: ${projects.length}`);

		// Si aucun projet n'existe, initialiser avec les projets d'exemple
		if (projects.length === 0) {
			console.log('🏗️ Initialisation des projets par défaut...');
			for (const projectData of exampleProjects) {
				const request: CreateProjectRequest = {
					id: projectData.id, // Utiliser l'ID prédéfini
					name: projectData.name,
					description: projectData.description,
					color: projectData.color
				};
				await projectService.createProject(request);
				console.log(`✅ Projet créé: ${projectData.name} avec ID: ${projectData.id}`);
			}
			projects = await projectService.getAllProjects();
			console.log(`🎯 Total projets après initialisation: ${projects.length}`);
		}

		projectsStore.set(projects);
		console.log('💾 Store des projets mis à jour');
		return projects;
	} catch (error) {
		console.error('Erreur lors du chargement des projets:', error);
		throw error;
	}
}

export async function createProject(request: CreateProjectRequest) {
	try {
		console.log('🔧 Store createProject appelé avec:', request);
		const newProject = await projectService.createProject(request);
		console.log('📋 Nouveau projet reçu du service:', newProject);

		// Mettre à jour le store
		projectsStore.update((projects) => {
			const updatedProjects = [...projects, newProject];
			console.log('🔄 Store mis à jour, nouveaux projets:', updatedProjects.length);
			return updatedProjects;
		});

		console.log('✅ Projet créé et store mis à jour');
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

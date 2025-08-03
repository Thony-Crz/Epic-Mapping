// src/features/project-management/use-cases/CreateProject.ts

import { Project, type ProjectProps } from '../../../domain/entities/Project';
import type { ProjectRepository } from '../../../domain/repositories/ProjectRepository';

export interface CreateProjectRequest {
	id?: string; // ID optionnel pour les données d'exemple
	name: string;
	description?: string;
	color?: string;
}

export class CreateProject {
	constructor(private projectRepository: ProjectRepository) {}

	async execute(request: CreateProjectRequest): Promise<Project> {
		// Vérifier si l'ID est déjà utilisé (uniquement si un ID est fourni)
		if (request.id) {
			const existingProject = await this.projectRepository.findById(request.id);
			if (existingProject) {
				throw new Error(`Un projet avec l'ID ${request.id} existe déjà`);
			}
		}

		const projectProps: ProjectProps = {
			id: request.id || `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			name: request.name.trim(),
			description: request.description?.trim(),
			color: request.color || '#3B82F6', // Bleu par défaut
			createdAt: new Date(),
			updatedAt: new Date()
		};

		if (!projectProps.name) {
			throw new Error('Le nom du projet est obligatoire');
		}

		if (projectProps.name.length > 100) {
			throw new Error('Le nom du projet ne peut pas dépasser 100 caractères');
		}

		const project = new Project(projectProps);
		await this.projectRepository.save(project);

		return project;
	}
}

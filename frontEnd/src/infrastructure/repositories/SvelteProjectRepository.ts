// src/infrastructure/repositories/SvelteProjectRepository.ts

import { Project, type ProjectProps } from '../../domain/entities/Project';
import type { ProjectRepository } from '../../domain/repositories/ProjectRepository';

export class SvelteProjectRepository implements ProjectRepository {
	private readonly storageKey = 'projects';

	private isClient(): boolean {
		return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
	}

	async save(project: Project): Promise<void> {
		if (!this.isClient()) return;

		const projects = await this.findAll();
		const existingIndex = projects.findIndex((p) => p.id === project.id);

		if (existingIndex >= 0) {
			projects[existingIndex] = project;
		} else {
			projects.push(project);
		}

		const plainProjects = projects.map((p) => p.toPlainObject());
		localStorage.setItem(this.storageKey, JSON.stringify(plainProjects));
	}

	async findById(id: string): Promise<Project | null> {
		const projects = await this.findAll();
		return projects.find((project) => project.id === id) || null;
	}

	async findAll(): Promise<Project[]> {
		if (!this.isClient()) return [];

		const stored = localStorage.getItem(this.storageKey);
		if (!stored) return [];

		try {
			const projectsData: ProjectProps[] = JSON.parse(stored);
			return projectsData.map(
				(data) =>
					new Project({
						...data,
						createdAt: new Date(data.createdAt),
						updatedAt: new Date(data.updatedAt)
					})
			);
		} catch {
			return [];
		}
	}

	async delete(id: string): Promise<void> {
		if (!this.isClient()) return;

		const projects = await this.findAll();
		const filtered = projects.filter((project) => project.id !== id);
		const plainProjects = filtered.map((p) => p.toPlainObject());
		localStorage.setItem(this.storageKey, JSON.stringify(plainProjects));
	}

	async update(project: Project): Promise<void> {
		await this.save(project);
	}

	// Méthode pour vider complètement le localStorage des projets
	async clearAll(): Promise<void> {
		if (!this.isClient()) return;
		localStorage.removeItem(this.storageKey);
	}
}

// src/services/ProjectService.ts

import { SvelteProjectRepository } from '../infrastructure/repositories/SvelteProjectRepository';
import { CreateProject, GetAllProjects, DeleteProject, type CreateProjectRequest } from '../features/project-management/use-cases';
import type { Project } from '../domain/entities/Project';

export class ProjectService {
  private projectRepository: SvelteProjectRepository;
  private createProjectUseCase: CreateProject;
  private getAllProjectsUseCase: GetAllProjects;
  private deleteProjectUseCase: DeleteProject;

  constructor() {
    this.projectRepository = new SvelteProjectRepository();
    this.createProjectUseCase = new CreateProject(this.projectRepository);
    this.getAllProjectsUseCase = new GetAllProjects(this.projectRepository);
    this.deleteProjectUseCase = new DeleteProject(this.projectRepository);
  }

  async createProject(request: CreateProjectRequest): Promise<Project> {
    return await this.createProjectUseCase.execute(request);
  }

  async getAllProjects(): Promise<Project[]> {
    return await this.getAllProjectsUseCase.execute();
  }

  async deleteProject(projectId: string): Promise<void> {
    return await this.deleteProjectUseCase.execute(projectId);
  }

  // Méthode pour réinitialiser les données avec les projets d'exemple
  async reinitializeWithExampleData(exampleProjects: any[]): Promise<void> {
    // Supprimer tous les projets existants
    const existingProjects = await this.getAllProjects();
    for (const project of existingProjects) {
      await this.deleteProject(project.id);
    }

    // Créer les projets d'exemple avec leurs IDs prédéfinis
    for (const projectData of exampleProjects) {
      const request: CreateProjectRequest = {
        id: projectData.id,
        name: projectData.name,
        description: projectData.description,
        color: projectData.color
      };
      await this.createProject(request);
    }
  }
}

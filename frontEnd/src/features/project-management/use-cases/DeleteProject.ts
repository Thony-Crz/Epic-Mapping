// src/features/project-management/use-cases/DeleteProject.ts

import type { ProjectRepository } from '../../../domain/repositories/ProjectRepository';

export class DeleteProject {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(projectId: string): Promise<void> {
    if (!projectId) {
      throw new Error('L\'ID du projet est obligatoire');
    }

    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new Error('Projet non trouvé');
    }

    await this.projectRepository.delete(projectId);
  }
}

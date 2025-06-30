// src/features/project-management/use-cases/GetAllProjects.ts

import type { Project } from '../../../domain/entities/Project';
import type { ProjectRepository } from '../../../domain/repositories/ProjectRepository';

export class GetAllProjects {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(): Promise<Project[]> {
    return await this.projectRepository.findAll();
  }
}

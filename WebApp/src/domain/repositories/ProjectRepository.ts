// src/domain/repositories/ProjectRepository.ts

import { Project, type ProjectProps } from '../entities/Project';

export interface ProjectRepository {
  save(project: Project): Promise<void>;
  findById(id: string): Promise<Project | null>;
  findAll(): Promise<Project[]>;
  delete(id: string): Promise<void>;
  update(project: Project): Promise<void>;
}

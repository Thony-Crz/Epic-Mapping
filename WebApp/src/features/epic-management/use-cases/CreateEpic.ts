// src/features/epic-management/use-cases/CreateEpic.ts

import { Epic } from '../../../domain/entities';
import type { EpicRepository } from '../../../domain/repositories';

export interface CreateEpicInput {
  title: string;
  status?: 'open' | 'in progress' | 'closed';
}

export interface CreateEpicOutput {
  epic: Epic;
}

export class CreateEpic {
  constructor(private epicRepository: EpicRepository) {}

  async execute(input: CreateEpicInput): Promise<CreateEpicOutput> {
    const epic = Epic.create({
      title: input.title,
      status: input.status || 'open',
      features: []
    });

    await this.epicRepository.save(epic);

    return { epic };
  }
}

// src/features/feature-management/use-cases/UpdateFeature.ts

import type { EpicRepository } from '../../../domain/repositories';
import type { FeatureStatus } from '../../../domain/entities';

export interface UpdateFeatureInput {
  epicId: string;
  featureId: string;
  title?: string;
  status?: FeatureStatus;
}

export interface UpdateFeatureOutput {
  success: boolean;
}

export class UpdateFeature {
  constructor(private epicRepository: EpicRepository) {}

  async execute(input: UpdateFeatureInput): Promise<UpdateFeatureOutput> {
    const epic = await this.epicRepository.findById(input.epicId);
    if (!epic) {
      throw new Error(`Epic with id ${input.epicId} not found`);
    }

    const feature = epic.features.find(f => f.id === input.featureId);
    if (!feature) {
      throw new Error(`Feature with id ${input.featureId} not found`);
    }

    let updatedFeature = feature;

    if (input.title !== undefined) {
      updatedFeature = updatedFeature.updateTitle(input.title);
    }

    if (input.status !== undefined) {
      updatedFeature = updatedFeature.updateStatus(input.status);
    }

    const updatedEpic = epic.updateFeature(input.featureId, updatedFeature);
    await this.epicRepository.save(updatedEpic);

    return { success: true };
  }
}

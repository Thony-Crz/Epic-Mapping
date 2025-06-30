// src/features/scenario-management/use-cases/UpdateScenario.ts

import type { EpicRepository } from '../../../domain/repositories';
import type { ScenarioType } from '../../../domain/entities';

export interface UpdateScenarioInput {
  epicId: string;
  featureId: string;
  scenarioIndex: number;
  title?: string;
  type?: ScenarioType;
}

export interface UpdateScenarioOutput {
  success: boolean;
}

export class UpdateScenario {
  constructor(private epicRepository: EpicRepository) {}

  async execute(input: UpdateScenarioInput): Promise<UpdateScenarioOutput> {
    const epic = await this.epicRepository.findById(input.epicId);
    if (!epic) {
      throw new Error(`Epic with id ${input.epicId} not found`);
    }

    const feature = epic.features.find(f => f.id === input.featureId);
    if (!feature) {
      throw new Error(`Feature with id ${input.featureId} not found`);
    }

    if (input.scenarioIndex < 0 || input.scenarioIndex >= feature.scenarios.length) {
      throw new Error('Invalid scenario index');
    }

    const scenario = feature.scenarios[input.scenarioIndex];
    let updatedScenario = scenario;

    if (input.title !== undefined) {
      updatedScenario = updatedScenario.updateTitle(input.title);
    }

    if (input.type !== undefined) {
      updatedScenario = updatedScenario.updateType(input.type);
    }

    const updatedFeature = feature.updateScenario(input.scenarioIndex, updatedScenario);
    const updatedEpic = epic.updateFeature(input.featureId, updatedFeature);
    
    await this.epicRepository.save(updatedEpic);

    return { success: true };
  }
}

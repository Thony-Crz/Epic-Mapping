// src/features/scenario-management/use-cases/DeleteScenario.ts

import type { EpicRepository } from '../../../domain/repositories';

export interface DeleteScenarioInput {
	epicId: string;
	featureId: string;
	scenarioIndex: number;
}

export interface DeleteScenarioOutput {
	success: boolean;
}

export class DeleteScenario {
	constructor(private epicRepository: EpicRepository) {}

	async execute(input: DeleteScenarioInput): Promise<DeleteScenarioOutput> {
		const epic = await this.epicRepository.findById(input.epicId);
		if (!epic) {
			throw new Error(`Epic with id ${input.epicId} not found`);
		}

		const feature = epic.features.find((f) => f.id === input.featureId);
		if (!feature) {
			throw new Error(`Feature with id ${input.featureId} not found`);
		}

		if (input.scenarioIndex < 0 || input.scenarioIndex >= feature.scenarios.length) {
			throw new Error('Invalid scenario index');
		}

		const updatedFeature = feature.removeScenario(input.scenarioIndex);
		const updatedEpic = epic.updateFeature(input.featureId, updatedFeature);

		await this.epicRepository.save(updatedEpic);

		return { success: true };
	}
}

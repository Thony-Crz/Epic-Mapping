// src/features/scenario-management/use-cases/AddScenarioToFeature.ts

import { Scenario } from '../../../domain/entities';
import type { EpicRepository } from '../../../domain/repositories';
import type { ScenarioType } from '../../../domain/entities';

export interface AddScenarioToFeatureInput {
	epicId: string;
	featureId: string;
	title: string;
	type?: ScenarioType;
}

export interface AddScenarioToFeatureOutput {
	scenario: Scenario;
}

export class AddScenarioToFeature {
	constructor(private epicRepository: EpicRepository) {}

	async execute(input: AddScenarioToFeatureInput): Promise<AddScenarioToFeatureOutput> {
		const epic = await this.epicRepository.findById(input.epicId);
		if (!epic) {
			throw new Error(`Epic with id ${input.epicId} not found`);
		}

		const feature = epic.features.find((f) => f.id === input.featureId);
		if (!feature) {
			throw new Error(`Feature with id ${input.featureId} not found`);
		}

		const scenario = Scenario.create({
			title: input.title,
			type: input.type || 'grey'
		});

		const updatedFeature = feature.addScenario(scenario);
		const updatedEpic = epic.updateFeature(input.featureId, updatedFeature);

		await this.epicRepository.save(updatedEpic);

		return { scenario };
	}
}

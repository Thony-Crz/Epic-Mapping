// src/features/feature-management/use-cases/DeleteFeature.ts

import type { EpicRepository } from '../../../domain/repositories';

export interface DeleteFeatureInput {
	epicId: string;
	featureId: string;
}

export interface DeleteFeatureOutput {
	success: boolean;
}

export class DeleteFeature {
	constructor(private epicRepository: EpicRepository) {}

	async execute(input: DeleteFeatureInput): Promise<DeleteFeatureOutput> {
		const epic = await this.epicRepository.findById(input.epicId);
		if (!epic) {
			throw new Error(`Epic with id ${input.epicId} not found`);
		}

		const feature = epic.features.find((f) => f.id === input.featureId);
		if (!feature) {
			throw new Error(`Feature with id ${input.featureId} not found`);
		}

		const updatedEpic = epic.removeFeature(input.featureId);
		await this.epicRepository.save(updatedEpic);

		return { success: true };
	}
}

// src/features/feature-management/use-cases/AddFeatureToEpic.ts

import { Feature } from '../../../domain/entities';
import type { EpicRepository } from '../../../domain/repositories';

export interface AddFeatureToEpicInput {
	epicId: string;
	title: string;
	status?: 'ready' | 'in-progress' | 'todo';
}

export interface AddFeatureToEpicOutput {
	feature: Feature;
}

export class AddFeatureToEpic {
	constructor(private epicRepository: EpicRepository) {}

	async execute(input: AddFeatureToEpicInput): Promise<AddFeatureToEpicOutput> {
		const epic = await this.epicRepository.findById(input.epicId);
		if (!epic) {
			throw new Error(`Epic with id ${input.epicId} not found`);
		}

		const feature = Feature.create({
			title: input.title,
			status: input.status || 'todo',
			scenarios: []
		});

		const updatedEpic = epic.addFeature(feature);
		await this.epicRepository.save(updatedEpic);

		return { feature };
	}
}

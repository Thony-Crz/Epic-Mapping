// src/features/epic-management/use-cases/UpdateEpic.ts

import { Epic } from '../../../domain/entities';
import type { EpicRepository } from '../../../domain/repositories';

export interface UpdateEpicInput {
	epicId: string;
	title?: string;
	status?: 'open' | 'in progress' | 'closed';
}

export interface UpdateEpicOutput {
	epic: Epic;
}

export class UpdateEpic {
	constructor(private epicRepository: EpicRepository) {}

	async execute(input: UpdateEpicInput): Promise<UpdateEpicOutput> {
		const existingEpic = await this.epicRepository.findById(input.epicId);
		if (!existingEpic) {
			throw new Error(`Epic with id ${input.epicId} not found`);
		}

		let updatedEpic = existingEpic;

		if (input.title !== undefined) {
			updatedEpic = updatedEpic.updateTitle(input.title);
		}

		if (input.status !== undefined) {
			updatedEpic = updatedEpic.updateStatus(input.status);
		}

		await this.epicRepository.save(updatedEpic);

		return { epic: updatedEpic };
	}
}

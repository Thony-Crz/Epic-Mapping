// src/features/epic-management/use-cases/DeleteEpic.ts

import type { EpicRepository } from '../../../domain/repositories';

export interface DeleteEpicInput {
	epicId: string;
}

export interface DeleteEpicOutput {
	success: boolean;
}

export class DeleteEpic {
	constructor(private epicRepository: EpicRepository) {}

	async execute(input: DeleteEpicInput): Promise<DeleteEpicOutput> {
		const existingEpic = await this.epicRepository.findById(input.epicId);
		if (!existingEpic) {
			throw new Error(`Epic with id ${input.epicId} not found`);
		}

		await this.epicRepository.delete(input.epicId);

		return { success: true };
	}
}

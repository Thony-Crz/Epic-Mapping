// src/features/session-management/use-cases/UpdateEpicWithSession.ts

import { Epic, Session } from '../../../domain/entities';
import type { EpicRepository } from '../../../domain/repositories';

export interface UpdateEpicWithSessionInput {
	epicId: string;
	session: Session;
	title?: string;
	status?: 'open' | 'in progress' | 'closed';
}

export interface UpdateEpicWithSessionOutput {
	epic: Epic;
}

export class UpdateEpicWithSession {
	constructor(private epicRepository: EpicRepository) {}

	async execute(input: UpdateEpicWithSessionInput): Promise<UpdateEpicWithSessionOutput> {
		// Vérifier que la session est active
		if (!input.session.isActive()) {
			throw new Error('Cannot modify epic: session is not active');
		}

		// Récupérer l'epic existant
		const existingEpic = await this.epicRepository.findById(input.epicId);
		if (!existingEpic) {
			throw new Error(`Epic with id ${input.epicId} not found`);
		}

		// Appliquer les modifications
		let updatedEpic = existingEpic;

		if (input.title !== undefined) {
			updatedEpic = updatedEpic.updateTitle(input.title);
		}

		if (input.status !== undefined) {
			updatedEpic = updatedEpic.updateStatus(input.status);
		}

		// Sauvegarder
		await this.epicRepository.save(updatedEpic);

		return { epic: updatedEpic };
	}
}

// src/features/session-management/use-cases/StartSession.ts

import { Session } from '../../../domain/entities';

export interface StartSessionInput {
	durationInMinutes?: number;
}

export interface StartSessionOutput {
	session: Session;
}

export class StartSession {
	async execute(input: StartSessionInput): Promise<StartSessionOutput> {
		const durationInMinutes = input.durationInMinutes ?? 30;
		const session = Session.create(durationInMinutes);
		
		return { session };
	}
}

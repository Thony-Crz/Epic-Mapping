// src/lib/stores/sessionStore.ts

import { writable } from 'svelte/store';
import { Session } from '../../domain/entities';

// Store pour la session courante (null = pas de session active)
export const sessionStore = writable<Session | null>(null);

/**
 * Démarre une nouvelle session avec la durée spécifiée
 */
export function startSession(durationInMinutes: number = 30): void {
	const session = Session.create(durationInMinutes);
	sessionStore.set(session);
}

/**
 * Termine la session courante
 */
export function terminateSession(): void {
	sessionStore.update((currentSession) => {
		if (currentSession) {
			return currentSession.terminate();
		}
		return null;
	});
}

/**
 * Vérifie si une session est actuellement active
 */
export function isSessionActive(): boolean {
	let isActive = false;
	sessionStore.subscribe((session) => {
		isActive = session?.isActive() ?? false;
	})();
	return isActive;
}

// src/routes/epic/[id]/__tests__/+page.test.ts

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { sessionStore, startSession, terminateSession } from '../../../../lib/stores/sessionStore';
import { safeUpdateEpicTitle, safeUpdateFeature } from '../sessionGuards';

describe('Epic Page with Session Guards', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		sessionStore.set(null); // Reset du store
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should prevent epic title update when no active session', async () => {
		// Arrange - Pas de session active
		const session = get(sessionStore);
		expect(session).toBeNull();

		// Act & Assert - Tenter de modifier le titre doit lever une erreur
		await expect(safeUpdateEpicTitle('epic-1', 'New Title')).rejects.toThrow('Cannot modify epic: no active session');
	});

	it('should allow epic title update when session is active', async () => {
		// Arrange - Session active
		startSession(30);
		const session = get(sessionStore);
		expect(session?.isActive()).toBe(true);

		// Act - Modifier le titre ne doit pas lever d'erreur
		await expect(safeUpdateEpicTitle('epic-1', 'New Title')).resolves.not.toThrow();
	});

	it('should prevent feature update when session expires', async () => {
		// Arrange - Session de 1 minute
		startSession(1);
		let session = get(sessionStore);
		expect(session?.isActive()).toBe(true);

		// Act - Faire expirer la session
		vi.advanceTimersByTime(61 * 1000); // 61 secondes
		session = get(sessionStore);
		expect(session?.isActive()).toBe(false);

		// Assert - La modification doit être empêchée
		await expect(safeUpdateFeature('epic-1', 'feature-1', 'New Feature Title')).rejects.toThrow('Cannot modify epic: no active session');
	});
});

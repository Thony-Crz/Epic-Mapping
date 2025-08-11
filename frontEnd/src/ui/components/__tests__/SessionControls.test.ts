// src/ui/components/__tests__/SessionControls.test.ts

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { sessionStore, startSession, terminateSession } from '../../../lib/stores/sessionStore';

// Test de la logique du composant SessionControls
describe('SessionControls Logic', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		sessionStore.set(null); // Reset du store
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should have no session initially', () => {
		const session = get(sessionStore);
		expect(session).toBeNull();
	});

	it('should start a session and format remaining time', () => {
		startSession(30);
		const session = get(sessionStore);
		
		expect(session).not.toBeNull();
		expect(session?.isActive()).toBe(true);
		expect(session?.getDurationInMinutes()).toBe(30);
		
		// Test de formatage du temps (30 minutes = 1800000ms)
		const remainingMs = session?.getRemainingTimeInMs() ?? 0;
		const minutes = Math.floor(remainingMs / 60000);
		const seconds = Math.floor((remainingMs % 60000) / 1000);
		const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;
		
		expect(timeDisplay).toBe('30:00');
	});

	it('should terminate session when requested', () => {
		startSession(30);
		let session = get(sessionStore);
		expect(session?.isActive()).toBe(true);

		terminateSession();
		session = get(sessionStore);
		expect(session?.isActive()).toBe(false);
	});
});

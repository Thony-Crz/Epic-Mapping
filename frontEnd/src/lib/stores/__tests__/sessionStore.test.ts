// src/lib/stores/__tests__/sessionStore.test.ts

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { sessionStore, startSession, terminateSession, isSessionActive } from '../sessionStore';

describe('SessionStore', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should start with no active session', () => {
		const session = get(sessionStore);
		expect(session).toBeNull();
	});

	it('should start a new session', () => {
		startSession(30);
		
		const session = get(sessionStore);
		expect(session).not.toBeNull();
		expect(session?.isActive()).toBe(true);
		expect(session?.getDurationInMinutes()).toBe(30);
	});

	it('should terminate the current session', () => {
		startSession(30);
		let session = get(sessionStore);
		expect(session?.isActive()).toBe(true);

		terminateSession();
		session = get(sessionStore);
		expect(session?.isActive()).toBe(false);
	});

	it('should check if session is active with helper function', () => {
		expect(isSessionActive()).toBe(false);
		
		startSession(30);
		expect(isSessionActive()).toBe(true);
		
		terminateSession();
		expect(isSessionActive()).toBe(false);
	});
});

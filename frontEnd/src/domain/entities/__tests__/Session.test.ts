// src/domain/entities/__tests__/Session.test.ts

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Session } from '../Session';

describe('Session', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should create a session with default 30 minutes duration', () => {
		const session = Session.create();
		
		expect(session.isActive()).toBe(true);
		expect(session.getDurationInMinutes()).toBe(30);
		expect(session.getRemainingTimeInMs()).toBe(30 * 60 * 1000); // 30 minutes en ms
	});

	it('should become inactive when timer expires', () => {
		const session = Session.create(1); // 1 minute pour test rapide
		
		expect(session.isActive()).toBe(true);
		expect(session.getRemainingTimeInMs()).toBe(60 * 1000); // 1 minute en ms
		
		// Avancer le temps de 61 secondes
		vi.advanceTimersByTime(61 * 1000);
		
		expect(session.isActive()).toBe(false);
		expect(session.getRemainingTimeInMs()).toBe(0);
	});

	it('should allow manual termination of an active session', () => {
		const session = Session.create(30);
		
		expect(session.isActive()).toBe(true);
		
		const terminatedSession = session.terminate();
		
		expect(terminatedSession.isActive()).toBe(false);
		expect(terminatedSession.getRemainingTimeInMs()).toBe(0);
	});
});

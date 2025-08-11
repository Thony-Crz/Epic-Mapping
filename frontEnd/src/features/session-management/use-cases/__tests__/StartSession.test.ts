// src/features/session-management/use-cases/__tests__/StartSession.test.ts

import { describe, it, expect } from 'vitest';
import { StartSession } from '../StartSession';

describe('StartSession', () => {
	it('should start a new session with default duration', async () => {
		const startSession = new StartSession();

		const result = await startSession.execute({});

		expect(result.session.isActive()).toBe(true);
		expect(result.session.getDurationInMinutes()).toBe(30);
	});
});

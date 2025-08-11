// src/features/session-management/use-cases/__tests__/UpdateEpicWithSession.test.ts

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UpdateEpicWithSession } from '../UpdateEpicWithSession';
import { Session } from '../../../../domain/entities';
import type { EpicRepository } from '../../../../domain/repositories';
import { Epic } from '../../../../domain/entities';

// Mock du repository
const mockEpicRepository: EpicRepository = {
	findById: vi.fn(),
	save: vi.fn(),
	findAll: vi.fn(),
	delete: vi.fn()
};

describe('UpdateEpicWithSession', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should update epic when session is active', async () => {
		// Arrange
		const activeSession = Session.create(30);
		const existingEpic = Epic.create({
			title: 'Original Title',
			status: 'open',
			features: [],
			projectId: 'project-1'
		});

		vi.mocked(mockEpicRepository.findById).mockResolvedValue(existingEpic);
		vi.mocked(mockEpicRepository.save).mockResolvedValue(undefined);

		const updateEpicWithSession = new UpdateEpicWithSession(mockEpicRepository);

		// Act
		const result = await updateEpicWithSession.execute({
			epicId: 'epic-1',
			title: 'Updated Title',
			session: activeSession
		});

		// Assert
		expect(result.epic.title).toBe('Updated Title');
		expect(mockEpicRepository.save).toHaveBeenCalledWith(expect.any(Epic));
	});

	it('should throw error when session is not active', async () => {
		// Arrange
		const inactiveSession = Session.create(30).terminate();
		
		const updateEpicWithSession = new UpdateEpicWithSession(mockEpicRepository);

		// Act & Assert
		await expect(updateEpicWithSession.execute({
			epicId: 'epic-1',
			title: 'Updated Title',
			session: inactiveSession
		})).rejects.toThrow('Cannot modify epic: session is not active');
	});
});

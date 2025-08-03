// src/domain/repositories/EpicRepository.ts

import { Epic } from '../entities';

export interface EpicRepository {
	findAll(): Promise<Epic[]>;
	findById(id: string): Promise<Epic | null>;
	save(epic: Epic): Promise<void>;
	delete(id: string): Promise<void>;
}

import { describe, it, expect, vi } from 'vitest';
import { get } from 'svelte/store';
import { createExportReadyEpicStore, type ExportReadyEpicState } from './exportReadyEpicStore.js';

type FakeEpic = {
	id: string;
	key: string;
	title: string;
	status: 'Draft' | 'Ready' | 'Refinement';
};

type ExportDeps = ReturnType<typeof createDeps>;

const readyEpic: FakeEpic = {
	id: 'b1a4f2b8-5e2f-4bc7-8a04-4d1a17aa0f22',
	key: 'EPIC-READY-001',
	title: 'Ready export pilot',
	status: 'Ready'
};

const draftEpic: FakeEpic = { ...readyEpic, status: 'Draft' };

function createDeps() {
	return {
		api: {
			exportReadyEpic: vi.fn()
		},
		downloader: {
			save: vi.fn().mockResolvedValue(undefined)
		},
		toasts: {
			success: vi.fn(),
			error: vi.fn()
		}
	};
}

function createStore(epic: FakeEpic, deps?: ExportDeps) {
	return createExportReadyEpicStore({
		deps: deps ?? createDeps(),
		epic
	});
}

describe('exportReadyEpicStore', () => {
	it('disables export when epic is not Ready and enables it when Ready', () => {
		const store = createStore(draftEpic);
		let state: ExportReadyEpicState = get(store.state);

		expect(state.canExport).toBe(false);
		expect(state.disabledHint).toContain('Ready');

		store.setEpicStatus('Ready');
		state = get(store.state);

		expect(state.canExport).toBe(true);
		expect(state.disabledHint).toBe('');
	});

	it('streams JSON blob download and announces success', async () => {
		const deps = createDeps();
		const blob = new Blob(['{"meta":{}}'], { type: 'application/json' });
		deps.api.exportReadyEpic.mockResolvedValue({
			blob,
			fileName: 'epic-ready-001.json',
			checksum: 'abc123',
			contentType: 'application/json'
		});

		const store = createStore(readyEpic, deps);
		const exportPromise = store.exportNow();

		expect(get(store.state).isExporting).toBe(true);

		await exportPromise;

		expect(deps.api.exportReadyEpic).toHaveBeenCalledWith(readyEpic.id);
		expect(deps.downloader.save).toHaveBeenCalledWith(blob, 'epic-ready-001.json');
		expect(deps.toasts.success).toHaveBeenCalledWith(
			expect.stringContaining('epic-ready-001.json')
		);

		const state = get(store.state);
		expect(state.isExporting).toBe(false);
		expect(state.lastFileName).toBe('epic-ready-001.json');
		expect(state.error).toBeNull();
	});

	it('surfaces error toast when backend blocks export', async () => {
		const deps = createDeps();
		const error = Object.assign(new Error('Epic must be Ready'), { status: 409 });
		deps.api.exportReadyEpic.mockRejectedValue(error);

		const store = createStore(readyEpic, deps);

		await store.exportNow();

		expect(deps.toasts.error).toHaveBeenCalledWith(
			expect.stringContaining('Epic must be Ready')
		);

		const state = get(store.state);
		expect(state.isExporting).toBe(false);
		expect(state.error?.status).toBe(409);
		expect(state.lastFileName).toBeUndefined();
	});
});

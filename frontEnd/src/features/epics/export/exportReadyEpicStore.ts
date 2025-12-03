import { get, writable, type Readable } from 'svelte/store';
import {
    exportReadyEpic as exportReadyEpicApi,
    type ExportReadyEpicResponse
} from '../../../infrastructure/api/epics';

export type ExportReadyEpicState = {
	isExporting: boolean;
	canExport: boolean;
	disabledHint: string;
	lastFileName?: string;
	error: { status?: number; message: string } | null;
};

export type ExportReadyEpicStore = {
	state: Readable<ExportReadyEpicState>;
	exportNow: () => Promise<void>;
	setEpicStatus: (status: string) => void;
};

export type ExportReadyEpicStoreDeps = {
	api: {
		exportReadyEpic: (epicId: string) => Promise<ExportReadyEpicResponse>;
	};
	downloader: {
		save: (blob: Blob, filename: string) => Promise<void> | void;
	};
	toasts: {
		success: (message: string) => void;
		error: (message: string) => void;
	};
};

export type CreateExportReadyEpicStoreArgs = {
	deps?: Partial<ExportReadyEpicStoreDeps>;
	epic: {
		id: string;
		key?: string;
		title?: string;
		status: string;
	};
};

export function createExportReadyEpicStore(
{
	deps,
	epic
}: CreateExportReadyEpicStoreArgs
): ExportReadyEpicStore {
	const resolvedDeps = resolveDeps(deps);
	const initialState: ExportReadyEpicState = {
		isExporting: false,
		canExport: epic.status === 'Ready',
		disabledHint: buildDisabledHint(epic.status),
		lastFileName: undefined,
		error: null
	};

	const state = writable(initialState);

	async function exportNow() {
		const current = get(state);
		if (!current.canExport || current.isExporting) {
			return;
		}

		state.set({ ...current, isExporting: true, error: null });

		try {
			const result = await resolvedDeps.api.exportReadyEpic(epic.id);
			await resolvedDeps.downloader.save(result.blob, result.fileName);
			resolvedDeps.toasts.success(
				`Export prêt pour ${result.fileName ?? epic.key ?? epic.id}`
			);
			state.update((previous) => ({
				...previous,
				isExporting: false,
				lastFileName: result.fileName,
				error: null
			}));
		}
		catch (error) {
			const normalized = normalizeError(error);
			resolvedDeps.toasts.error(normalized.message);
			state.update((previous) => ({
				...previous,
				isExporting: false,
				error: normalized
			}));
		}
	}

	function setEpicStatus(status: string) {
		state.update((previous) => ({
			...previous,
			canExport: status === 'Ready',
			disabledHint: buildDisabledHint(status)
		}));
	}

	return {
		state: { subscribe: state.subscribe },
		exportNow,
		setEpicStatus
	};
}

function createDefaultDeps(): ExportReadyEpicStoreDeps {
	return {
		api: {
			exportReadyEpic: exportReadyEpicApi
		},
		downloader: {
			save: defaultSaveBlob
		},
		toasts: {
			success: (message: string) => console.info(message),
			error: (message: string) => console.error(message)
		}
	};
}

function resolveDeps(overrides?: Partial<ExportReadyEpicStoreDeps>): ExportReadyEpicStoreDeps {
	const defaults = createDefaultDeps();
	return {
		api: { ...defaults.api, ...(overrides?.api ?? {}) },
		downloader: { ...defaults.downloader, ...(overrides?.downloader ?? {}) },
		toasts: { ...defaults.toasts, ...(overrides?.toasts ?? {}) }
	};
}

function defaultSaveBlob(blob: Blob, filename: string) {
	if (typeof window === 'undefined') {
		return;
	}
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = filename;
	anchor.style.display = 'none';
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
	URL.revokeObjectURL(url);
}

function buildDisabledHint(status: string) {
	return status === 'Ready'
		? ''
		: 'Export disponible uniquement lorsque le statut est Ready.';
}

function normalizeError(error: unknown): { status?: number; message: string } {
	if (error && typeof error === 'object') {
		const status = 'status' in error ? (error as { status?: number }).status : undefined;
		const message = error instanceof Error ? error.message : 'Export impossible.';
		return { status, message };
	}
	return { message: 'Export impossible.', status: undefined };
}

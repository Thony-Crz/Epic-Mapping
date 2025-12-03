import type { Readable } from 'svelte/store';

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
		exportReadyEpic: (epicId: string) => Promise<unknown>;
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
	deps: ExportReadyEpicStoreDeps;
	epic: {
		id: string;
		key?: string;
		title?: string;
		status: string;
	};
};

export function createExportReadyEpicStore(
	_args: CreateExportReadyEpicStoreArgs
): ExportReadyEpicStore {
	throw new Error('exportReadyEpicStore is not implemented yet');
}

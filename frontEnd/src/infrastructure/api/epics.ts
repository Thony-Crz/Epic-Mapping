const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export type ExportReadyEpicResponse = {
    blob: Blob;
    fileName: string;
    checksum: string;
    contentType: string;
};

export async function exportReadyEpic(epicId: string): Promise<ExportReadyEpicResponse> {
    if (!API_BASE_URL) {
        throw new Error('VITE_API_BASE_URL must be configured to use exportReadyEpic.');
    }

    const url = `${API_BASE_URL}/api/epics/${epicId}/export`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        },
        credentials: 'include'
    });

    if (!response.ok) {
        const problem = await parseProblemDetails(response);
        throw Object.assign(new Error(problem.message), {
            status: response.status,
            problem: problem.raw
        });
    }

    const blob = await response.blob();
    const fileName = extractFileName(response.headers.get('Content-Disposition')) ??
        `epic-${epicId}.json`;
    const checksum = response.headers.get('X-Checksum') ?? '';
    const contentType = response.headers.get('Content-Type') ?? 'application/json';

    return {
        blob,
        fileName,
        checksum,
        contentType
    };
}

async function parseProblemDetails(response: Response) {
    try {
        const raw = await response.json();
        const message = raw?.detail ?? raw?.title ?? response.statusText;
        return { message, raw };
    }
    catch {
        return { message: response.statusText || 'Export failed.', raw: null };
    }
}

function extractFileName(disposition: string | null) {
    if (!disposition) {
        return undefined;
    }

    const match = /filename="?([^";]+)"?/i.exec(disposition);
    return match?.[1];
}

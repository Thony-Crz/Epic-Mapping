<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Epic } from '$domain/entities/Epic';
	import type { Feature } from '$domain/entities/Feature';
	import type { Scenario } from '$domain/entities/Scenario';

	export let isOpen = false;
	export let readyEpics: Epic[] = [];

	const dispatch = createEventDispatcher();

	let exportType = 'excel';
	let isExporting = false;

	function closeModal() {
		isOpen = false;
		dispatch('close');
	}

	function handleExport() {
		if (readyEpics.length === 0) {
			alert('Aucune épic ready à exporter');
			return;
		}

		isExporting = true;

		if (exportType === 'excel') {
			exportToExcel();
		} else if (exportType === 'azuredevops') {
			exportToAzureDevOps();
		}

		isExporting = false;
		closeModal();
	}

	function exportToExcel() {
		const excelData = readyEpics.map((epic) => {
			const epicData: Record<string, string | number> = {
				'Epic Title': epic.title,
				'Epic ID': epic.id,
				Status: epic.status,
				'Features Count': epic.features.length,
				'Total Scenarios': epic.features.flatMap((f: Feature) => f.scenarios).length
			};

			epic.features.forEach((feature: Feature, fIndex: number) => {
				epicData[`Feature ${fIndex + 1} - Title`] = feature.title;
				epicData[`Feature ${fIndex + 1} - Status`] = feature.status;

				feature.scenarios.forEach((scenario: Scenario, sIndex: number) => {
					epicData[`Feature ${fIndex + 1} - Scenario ${sIndex + 1} - Title`] = scenario.title;
					epicData[`Feature ${fIndex + 1} - Scenario ${sIndex + 1} - Type`] = scenario.type;
				});
			});

			return epicData;
		});

		const csvContent = convertToCSV(excelData);
		downloadCSV(csvContent, 'epics-ready-export.csv');
	}

	function convertToCSV(data: Record<string, string | number>[]) {
		if (data.length === 0) return '';

		const headers = Object.keys(data[0]);
		const csvRows = [headers.join(',')];

		data.forEach((row) => {
			const values = headers.map((header) => {
				const value = row[header] || '';
				return `"${value.toString().replace(/"/g, '""')}"`;
			});
			csvRows.push(values.join(','));
		});

		return csvRows.join('\n');
	}

	function downloadCSV(content: string, filename: string) {
		const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', filename);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function exportToAzureDevOps() {
		alert('Export vers Azure DevOps sera implémenté côté WebAPI prochainement');
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}
</script>

{#if isOpen}
	<div
		class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"
		on:click={handleBackdropClick}
		role="dialog"
		aria-labelledby="export-modal-title"
		aria-modal="true"
	>
		<div class="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
			<div class="mb-6 flex items-center justify-between">
				<h3 id="export-modal-title" class="text-xl font-bold text-gray-900">
					Exporter les Epics Ready
				</h3>
				<button
					on:click={closeModal}
					class="text-gray-400 transition-colors hover:text-gray-600"
					aria-label="Fermer"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						></path>
					</svg>
				</button>
			</div>

			<div class="mb-6">
				<p class="mb-4 text-sm text-gray-600">
					{readyEpics.length} épic{readyEpics.length > 1 ? 's' : ''} ready à exporter
				</p>

				<label for="export-type" class="mb-2 block text-sm font-medium text-gray-700">
					Type d'export
				</label>
				<select
					id="export-type"
					bind:value={exportType}
					class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500"
				>
					<option value="excel">Excel (CSV)</option>
					<option value="azuredevops">Azure DevOps</option>
				</select>
			</div>

			<div class="flex justify-end gap-3">
				<button
					on:click={closeModal}
					class="px-4 py-2 font-medium text-gray-600 transition-colors hover:text-gray-800"
					disabled={isExporting}
				>
					Annuler
				</button>
				<button
					on:click={handleExport}
					disabled={isExporting || readyEpics.length === 0}
					class="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if isExporting}
						<svg class="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							></path>
						</svg>
						Export en cours...
					{:else}
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							></path>
						</svg>
						Exporter
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}

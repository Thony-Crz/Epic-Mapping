<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { projectsStore } from '$lib/stores/projectsStore';
	import type { EpicProps } from '$domain/entities/Epic';
	import type { Feature } from '$domain/entities/Feature';
	import type { Scenario } from '$domain/entities/Scenario';
	import { downloadEpicExport } from '../../../domain/services/EpicExportService';

	export let isOpen = false;
	export let readyEpics: EpicProps[] = [];

	const dispatch = createEventDispatcher();

	let selectedEpicId = '';
	let selectedProjectId = 'all'; // Nouveau filtre par projet
	let isExporting = false;

	// Épics filtrées par projet
	$: filteredEpics =
		selectedProjectId === 'all'
			? readyEpics
			: readyEpics.filter((epic) => epic.projectId === selectedProjectId);

	// Réactive : épic sélectionnée
	$: selectedEpic = filteredEpics.find((epic) => epic.id === selectedEpicId);

	// Réinitialiser la sélection d'épic quand le filtre projet change
	$: if (selectedProjectId) {
		if (filteredEpics.length > 0 && !filteredEpics.some((epic) => epic.id === selectedEpicId)) {
			selectedEpicId = filteredEpics[0]?.id || '';
		} else if (filteredEpics.length === 0) {
			selectedEpicId = '';
		}
	}

	// Initialiser la première épic par défaut quand les épics changent
	$: if (filteredEpics.length > 0 && !selectedEpicId) {
		selectedEpicId = filteredEpics[0].id;
	}

	// Trouver le nom du projet pour une épic
	function getProjectName(projectId: string): string {
		const project = $projectsStore.find((p) => p.id === projectId);
		return project ? project.name : 'Projet inconnu';
	}

	function closeModal() {
		isOpen = false;
		selectedProjectId = 'all'; // Réinitialiser le filtre
		selectedEpicId = '';
		dispatch('close');
	}

	function handleExportToExcel() {
		if (!selectedEpic) {
			alert('Veuillez sélectionner une épic à exporter');
			return;
		}

		isExporting = true;
		exportToExcel();
		isExporting = false;
		closeModal();
	}

	function handleExportToJson() {
		if (!selectedEpic) {
			alert('Veuillez sélectionner une épic à exporter');
			return;
		}

		isExporting = true;
		try {
			const projectName = getProjectName(selectedEpic.projectId);
			downloadEpicExport(selectedEpic, projectName);
		} catch (error) {
			console.error('Export error:', error);
			alert('Erreur lors de l\'export JSON');
		}
		isExporting = false;
		closeModal();
	}

	function exportToExcel() {
		if (!selectedEpic) return;

		const epic = selectedEpic;
		const projectName = getProjectName(epic.projectId);

		const epicData: Record<string, string | number> = {
			'Project Name': projectName,
			'Project ID': epic.projectId,
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

		const csvContent = convertToCSV([epicData]);
		const safeProjectName = projectName.replace(/[^a-zA-Z0-9]/g, '-');
		const safeEpicTitle = epic.title.replace(/[^a-zA-Z0-9]/g, '-');
		downloadCSV(csvContent, `${safeProjectName}-epic-${safeEpicTitle}-export.csv`);
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
		on:keydown={(e) => e.key === 'Escape' && closeModal()}
		role="dialog"
		tabindex="-1"
		aria-labelledby="export-modal-title"
		aria-modal="true"
	>
		<div class="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
			<div class="mb-6 flex items-center justify-between">
				<h3 id="export-modal-title" class="text-xl font-bold text-gray-900">
					Exporter une Epic Ready
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
					{readyEpics.length} épic{readyEpics.length > 1 ? 's' : ''} ready disponible{readyEpics.length >
					1
						? 's'
						: ''}
					{#if selectedProjectId !== 'all'}
						• {filteredEpics.length} dans le projet sélectionné
					{/if}
				</p>

				<!-- Filtre par projet -->
				<div class="mb-4">
					<label for="project-filter" class="mb-2 block text-sm font-medium text-gray-700">
						Filtrer par projet
					</label>
					<select
						id="project-filter"
						bind:value={selectedProjectId}
						class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
					>
						<option value="all">Tous les projets ({readyEpics.length} épics)</option>
						{#each $projectsStore as project (project.id)}
							{@const projectEpics = readyEpics.filter((epic) => epic.projectId === project.id)}
							{#if projectEpics.length > 0}
								<option value={project.id}>
									{project.name} ({projectEpics.length} épic{projectEpics.length > 1 ? 's' : ''})
								</option>
							{/if}
						{/each}
					</select>
				</div>

				<!-- Sélection de l'épic -->
				<div class="mb-4">
					<label for="epic-select" class="mb-2 block text-sm font-medium text-gray-700">
						Épic à exporter
					</label>
					{#if filteredEpics.length > 0}
						<select
							id="epic-select"
							bind:value={selectedEpicId}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500"
						>
							{#each filteredEpics as epic (epic.id)}
								<option value={epic.id}>
									{epic.title}
									{#if selectedProjectId === 'all'}
										• {getProjectName(epic.projectId)}
									{/if}
								</option>
							{/each}
						</select>
					{:else}
						<div
							class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-center text-gray-500"
						>
							Aucune épic ready dans ce projet
						</div>
					{/if}

					<!-- Aperçu de l'épic sélectionnée -->
					{#if selectedEpic}
						<div class="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
							<div class="text-sm text-green-800">
								<p class="mb-1 font-medium">Aperçu de l'épic :</p>
								<p class="mb-1">
									<span class="font-medium">Features :</span>
									{selectedEpic.features.length}
								</p>
								<p>
									<span class="font-medium">Scénarios :</span>
									{selectedEpic.features.flatMap((f) => f.scenarios).length}
								</p>
							</div>
						</div>
					{/if}
				</div>

				<!-- Type d'export -->
				<div>
					<div class="mb-3 text-sm font-medium text-gray-700">Actions d'export</div>
					<p class="mb-4 text-xs text-gray-500">
						Export JSON compatible Azure DevOps pour créer automatiquement les Features et User Stories.
					</p>
				</div>
			</div>

			<div class="flex justify-between gap-3">
				<button
					on:click={closeModal}
					class="px-4 py-2 font-medium text-gray-600 transition-colors hover:text-gray-800"
					disabled={isExporting}
				>
					Annuler
				</button>

				<div class="flex gap-3">
					<!-- Bouton Export Excel/CSV -->
					<button
						on:click={handleExportToExcel}
						disabled={isExporting || !selectedEpic || filteredEpics.length === 0}
						class="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if isExporting}
							<svg
								class="h-4 w-4 animate-spin"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
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
							Export CSV
						{/if}
					</button>

					<!-- Bouton Export JSON pour Azure DevOps -->
					<button
						on:click={handleExportToJson}
						disabled={isExporting || !selectedEpic || filteredEpics.length === 0}
						class="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if isExporting}
							<svg
								class="h-4 w-4 animate-spin"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
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
									d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 5v10"
								></path>
							</svg>
							Export JSON (Azure DevOps)
						{/if}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

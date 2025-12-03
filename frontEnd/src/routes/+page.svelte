<script lang="ts">
	import { onMount } from 'svelte';
	import { epicsDisplayStore, archiveEpic } from '$lib/stores/epicsStore';
	import { projectsStore, loadProjects } from '$lib/stores/projectsStore';
	import { serviceContainer } from '../services/ServiceContainer';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import type { Epic } from '$domain/entities/Epic';
	import type { Feature } from '$domain/entities/Feature';
	import type { Scenario } from '$domain/entities/Scenario';
	import type { Project } from '$domain/entities/Project';

	interface ProjectEpics {
		project: Project;
		readyEpics: Epic[];
		openEpics: Epic[];
		archivedEpics: Epic[];
	}

	interface ProjectStats {
		ready: number;
		open: number;
		archived: number;
	}
	import BlueCard from '$ui/components/cards/BlueCard.svelte';
	import AddEpicForm from '$ui/components/forms/AddEpicForm.svelte';
	import AddProjectForm from '$ui/components/forms/AddProjectForm.svelte';
	import ExportEpicsForm from '$ui/components/forms/ExportEpicsForm.svelte';
	import SessionControls from '$ui/components/SessionControls.svelte';
	import { FeatureFlagService } from '../services/feature-flags/FeatureFlagService.js';
	import {
		featureFlagsStore,
		initializeFeatureFlags,
		isFeatureEnabled
	} from '../services/feature-flags/featureFlagsStore.js';

	// Charger les données au démarrage
	onMount(async () => {
		try {
			// Initialiser les feature flags
			initializeFeatureFlags();

			// Vider complètement le localStorage et réinitialiser toutes les données
			await serviceContainer.clearAllData();

			// Charger/initialiser les projets
			await loadProjects();

			// Réinitialiser les données épics avec les nouvelles données d'exemple
			serviceContainer.reinitializeEpicsData();
		} catch (error) {
			console.error('❌ Erreur lors du chargement initial:', error);
			// Ne pas faire de goto() en cas d'erreur, laisser l'app se charger quand même
		}
	});

	// Fonction pour vérifier si une épic est "ready" pour l'export
	function isEpicReady(epic: Epic): boolean {
		// Si l'épic a le statut "closed", elle est considérée comme ready pour l'export
		if (epic.status === 'closed') {
			return true;
		}

		// Sinon, on applique la logique habituelle
		const allScenarios = epic.features.flatMap((feature: Feature) => feature.scenarios);

		// Vérifier qu'il n'y a aucune carte grise
		const hasGreyCards = allScenarios.some((scenario: Scenario) => scenario.type === 'grey');
		if (hasGreyCards) return false;

		// Vérifier qu'il y a au moins une carte verte
		const hasGreenCards = allScenarios.some((scenario: Scenario) => scenario.type === 'green');
		if (!hasGreenCards) return false;

		// Vérifier que toutes les features (cartes jaunes) ont le statut "ready"
		const allFeaturesReady = epic.features.every((feature: Feature) => feature.status === 'ready');

		return allFeaturesReady;
	}

	// Fonction pour archiver une épic
	async function handleArchiveEpic(epicId: string, event: Event) {
		event.stopPropagation(); // Empêcher la navigation
		try {
			await archiveEpic(epicId);
		} catch (error) {
			console.error("❌ Erreur lors de l'archivage:", error);
		}
	}

	// Fonction de navigation sécurisée
	function handleNavigateToEpic(epicId: string) {
		try {
			const epicUrl = `${base}/epics/${epicId}`;
			goto(epicUrl);
			goto(epicUrl);
		} catch (error) {
			console.error('❌ Erreur de navigation:', error);
		}
	}

	// Variables réactives qui se mettent à jour automatiquement
	$: readyEpics =
		$projectsStore.length > 0
			? $epicsDisplayStore.filter((epic) => epic.status !== 'archived' && isEpicReady(epic))
			: [];
	$: openEpics =
		$projectsStore.length > 0
			? $epicsDisplayStore.filter((epic) => epic.status !== 'archived' && !isEpicReady(epic))
			: [];
	$: archivedEpics =
		$projectsStore.length > 0
			? $epicsDisplayStore.filter((epic) => epic.status === 'archived')
			: [];

	// Initialiser le service de feature flags avec le store réactif
	$: isExportEnabled =
		$featureFlagsStore.find((flag) => flag.name === 'epic-export')?.enabled || false;

	// Regrouper les épics par projet avec filtre
	$: filteredProjects =
		selectedProjectFilter === 'all'
			? $projectsStore
			: $projectsStore.filter((project) => project.id === selectedProjectFilter);

	$: epicsByProject = filteredProjects.reduce(
		(acc, project) => {
			acc[project.id] = {
				project,
				readyEpics: readyEpics.filter((epic) => epic.projectId === project.id),
				openEpics: openEpics.filter((epic) => epic.projectId === project.id),
				archivedEpics: archivedEpics.filter((epic) => epic.projectId === project.id)
			};
			return acc;
		},
		{} as Record<string, ProjectEpics>
	);

	// Calculer les totaux pour les badges du filtre
	$: projectStats = $projectsStore.reduce(
		(acc, project) => {
			acc[project.id] = {
				ready: readyEpics.filter((epic) => epic.projectId === project.id).length,
				open: openEpics.filter((epic) => epic.projectId === project.id).length,
				archived: archivedEpics.filter((epic) => epic.projectId === project.id).length
			};
			return acc;
		},
		{} as Record<string, ProjectStats>
	);

	// Variables pour le modal d'export
	let isExportModalOpen = false;

	// Variable pour le filtre par projet
	let selectedProjectFilter = 'all';

	function openExportModal() {
		if (readyEpics.length === 0) {
			alert('Aucune épic ready à exporter');
			return;
		}
		isExportModalOpen = true;
	}

	function closeExportModal() {
		isExportModalOpen = false;
	}
</script>

<!-- En-tête avec les boutons d'action -->
<div class="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
	<h1 class="text-3xl font-bold text-gray-900">Gestion des Epics</h1>

	<div class="flex gap-3">
		<AddProjectForm />
	</div>
</div>

<!-- Encadré de session (timebox globale) -->
<div class="mb-6">
	<SessionControls />
</div>

<!-- Filtre par projet -->
{#if $projectsStore.length > 1}
	<div class="mb-6 rounded-2xl border border-gray-200 bg-white/60 p-4 shadow-sm backdrop-blur-sm">
		<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div class="flex-1">
				<label for="project-filter" class="mb-2 block text-sm font-medium text-gray-700">
					Filtrer par projet
				</label>
				<select
					id="project-filter"
					bind:value={selectedProjectFilter}
					class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 transition-colors outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:w-80"
				>
					<option value="all">
						Tous les projets ({readyEpics.length + openEpics.length + archivedEpics.length} épics)
					</option>
					{#each $projectsStore as project (project.id)}
						{@const stats = projectStats[project.id]}
						{@const totalEpics = stats.ready + stats.open + stats.archived}
						<option value={project.id}>
							{project.name} ({totalEpics} épic{totalEpics > 1 ? 's' : ''})
						</option>
					{/each}
				</select>
			</div>

			<!-- Statistiques du filtre sélectionné -->
			<div class="flex flex-wrap gap-2">
				{#if selectedProjectFilter === 'all'}
					{#if readyEpics.length > 0}
						<span class="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
							{readyEpics.length} ready
						</span>
					{/if}
					{#if openEpics.length > 0}
						<span class="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
							{openEpics.length} en cours
						</span>
					{/if}
					{#if archivedEpics.length > 0}
						<span class="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
							{archivedEpics.length} archivée{archivedEpics.length > 1 ? 's' : ''}
						</span>
					{/if}
				{:else}
					{@const stats = projectStats[selectedProjectFilter]}
					{#if stats}
						{#if stats.ready > 0}
							<span class="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
								{stats.ready} ready
							</span>
						{/if}
						{#if stats.open > 0}
							<span class="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
								{stats.open} en cours
							</span>
						{/if}
						{#if stats.archived > 0}
							<span class="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
								{stats.archived} archivée{stats.archived > 1 ? 's' : ''}
							</span>
						{/if}
					{/if}
				{/if}
			</div>
		</div>
	</div>
{/if}

<!-- Bouton Export global pour toutes les épics ready -->
{#if readyEpics.length > 0 && isExportEnabled}
	<div class="mb-6 flex justify-end">
		<button
			on:click={openExportModal}
			class="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-medium text-white shadow-lg transition-colors hover:bg-green-700"
			title="Exporter les épics ready"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
				></path>
			</svg>
			Exporter épics ready
			{#if selectedProjectFilter === 'all'}
				({readyEpics.length})
			{:else}
				({projectStats[selectedProjectFilter]?.ready || 0})
			{/if}
		</button>
	</div>
{/if}

<!-- Affichage par projet -->
{#each Object.values(epicsByProject) as { project, readyEpics: projectReadyEpics, openEpics: projectOpenEpics, archivedEpics: projectArchivedEpics } (project.id)}
	{@const totalEpics =
		projectReadyEpics.length + projectOpenEpics.length + projectArchivedEpics.length}

	<section
		class="mb-8 rounded-2xl border border-gray-200 bg-white/60 p-6 shadow-lg backdrop-blur-sm"
	>
		<!-- En-tête du projet -->
		<div class="mb-6 flex items-center gap-4 border-b border-gray-200 pb-4">
			<div
				class="h-6 w-6 rounded-full border-2 border-white shadow-sm"
				style="background-color: {project.color || '#6B7280'}"
			></div>
			<div class="flex-1">
				<h2 class="text-2xl font-bold text-gray-800">{project.name}</h2>
				{#if project.description}
					<p class="mt-1 text-gray-600">{project.description}</p>
				{/if}
			</div>
			<div class="flex items-center gap-3">
				<!-- Bouton Nouvelle Epic pour ce projet -->
				<AddEpicForm preselectedProjectId={project.id} />

				<!-- Badges de statut -->
				<div class="flex gap-2">
					{#if projectReadyEpics.length > 0}
						<span class="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
							{projectReadyEpics.length} ready
						</span>
					{/if}
					{#if projectOpenEpics.length > 0}
						<span class="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
							{projectOpenEpics.length} en cours
						</span>
					{/if}
					{#if projectArchivedEpics.length > 0}
						<span class="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
							{projectArchivedEpics.length} archivée{projectArchivedEpics.length > 1 ? 's' : ''}
						</span>
					{/if}
				</div>
			</div>
		</div>

		<!-- Épics Ready du projet -->
		{#if projectReadyEpics.length > 0}
			<div class="mb-6">
				<div class="mb-4 flex items-center gap-2">
					<div class="h-3 w-3 rounded-full bg-green-500"></div>
					<h3 class="text-lg font-semibold text-green-700">Ready</h3>
				</div>
				<div class="flex flex-wrap gap-4">
					{#each projectReadyEpics as card (card.id)}
						<div class="relative">
							<button
								on:click={() => handleNavigateToEpic(card.id)}
								class="post-it-card w-60 rotate-1 transform cursor-pointer rounded-lg border-l-4 border-green-500 bg-green-200 p-4 text-green-900 shadow-lg transition-all duration-300 hover:scale-105 hover:rotate-0 hover:bg-green-100"
								style="box-shadow: 4px 4px 8px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.5);"
							>
								<BlueCard title={card.title} />
							</button>
							<button
								on:click={(e) => handleArchiveEpic(card.id, e)}
								class="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 opacity-60 shadow-md transition-all duration-200 hover:bg-red-600 hover:opacity-100"
								title="Archiver cette épic"
								aria-label="Archiver cette épic"
							>
								<svg
									class="h-3 w-3 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									></path>
								</svg>
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Épics en cours du projet -->
		{#if projectOpenEpics.length > 0}
			<div class="mb-6">
				<div class="mb-4 flex items-center gap-2">
					<div class="h-3 w-3 rounded-full bg-blue-500"></div>
					<h3 class="text-lg font-semibold text-blue-700">En cours</h3>
				</div>
				<div class="flex flex-wrap gap-4">
					{#each projectOpenEpics as card (card.id)}
						<div class="relative">
							<button
								on:click={() => handleNavigateToEpic(card.id)}
								class="post-it-card w-60 -rotate-1 transform cursor-pointer rounded-lg border-l-4 border-blue-500 bg-blue-200 p-4 text-blue-900 shadow-lg transition-all duration-300 hover:scale-105 hover:rotate-0 hover:bg-blue-100"
								style="box-shadow: 4px 4px 8px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.5);"
							>
								<BlueCard title={card.title} />
							</button>
							<button
								on:click={(e) => handleArchiveEpic(card.id, e)}
								class="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 opacity-60 shadow-md transition-all duration-200 hover:bg-red-600 hover:opacity-100"
								title="Archiver cette épic"
								aria-label="Archiver cette épic"
							>
								<svg
									class="h-3 w-3 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									></path>
								</svg>
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Épics archivées du projet -->
		{#if projectArchivedEpics.length > 0}
			<div>
				<div class="mb-4 flex items-center gap-2">
					<div class="h-3 w-3 rounded-full bg-gray-500"></div>
					<h3 class="text-lg font-semibold text-gray-700">Archivées</h3>
				</div>
				<div class="flex flex-wrap gap-4">
					{#each projectArchivedEpics as card (card.id)}
						<button
							on:click={() => handleNavigateToEpic(card.id)}
							class="post-it-card w-60 rotate-2 transform cursor-pointer rounded-lg border-l-4 border-gray-500 bg-gray-200 p-4 text-gray-700 opacity-75 shadow-lg transition-all duration-300 hover:scale-105 hover:rotate-0 hover:bg-gray-100 hover:opacity-100"
							style="box-shadow: 4px 4px 8px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.5);"
						>
							<BlueCard title={card.title} />
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<!-- État vide si aucune épic dans le projet -->
		{#if totalEpics === 0}
			<div class="flex flex-col items-center justify-center py-12 text-center">
				<!-- Icône simple et élégante -->
				<div
					class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-100"
				>
					<div class="animate-bounce text-4xl">🚀</div>
				</div>

				<h3 class="mb-2 text-xl font-semibold text-gray-700">Prêt à décoller !</h3>
				<p class="mb-4 text-gray-500">
					Ce projet n'a pas encore d'épics. Créez-en une pour commencer !
				</p>

				<!-- Bouton pour créer une épic pour ce projet -->
				<AddEpicForm preselectedProjectId={project.id} />
			</div>
		{/if}
	</section>
{/each}

<!-- Message si aucun projet ou épic -->
{#if $projectsStore.length === 0}
	<div class="rounded-2xl border border-gray-200 bg-white/50 py-16 text-center backdrop-blur-sm">
		<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
			<svg class="h-10 w-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
				></path>
			</svg>
		</div>
		<h3 class="mb-2 text-xl font-semibold text-gray-700">Commencez par créer un projet</h3>
		<p class="mb-6 text-gray-500">Créez votre premier projet pour organiser vos épics</p>
		<div class="flex justify-center gap-3">
			<AddProjectForm />
		</div>
	</div>
{:else if Object.values(epicsByProject).every(({ readyEpics, openEpics, archivedEpics }) => readyEpics.length === 0 && openEpics.length === 0 && archivedEpics.length === 0)}
	<div class="rounded-2xl border border-gray-200 bg-white/50 py-16 text-center backdrop-blur-sm">
		<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
			<svg class="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
				></path>
			</svg>
		</div>
		{#if selectedProjectFilter === 'all'}
			<h3 class="mb-2 text-xl font-semibold text-gray-700">Aucune épic trouvée</h3>
			<p class="mb-6 text-gray-500">Créez votre première épic pour commencer</p>
		{:else}
			{@const selectedProject = $projectsStore.find((p) => p.id === selectedProjectFilter)}
			<h3 class="mb-2 text-xl font-semibold text-gray-700">
				Aucune épic dans "{selectedProject?.name}"
			</h3>
			<p class="mb-6 text-gray-500">Créez une épic pour ce projet ou changez de filtre</p>
		{/if}
		<div class="flex justify-center gap-3">
			{#if selectedProjectFilter !== 'all'}
				{@const selectedProject = $projectsStore.find((p) => p.id === selectedProjectFilter)}
				{#if selectedProject}
					<AddEpicForm preselectedProjectId={selectedProject.id} />
				{/if}
			{:else}
				<AddEpicForm />
			{/if}
			{#if selectedProjectFilter !== 'all'}
				<button
					on:click={() => (selectedProjectFilter = 'all')}
					class="rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
				>
					Voir tous les projets
				</button>
			{/if}
		</div>
	</div>
{/if}

<!-- Modal d'export -->
<ExportEpicsForm bind:isOpen={isExportModalOpen} {readyEpics} on:close={closeExportModal} />

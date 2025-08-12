<!-- src/ui/components/AddEpicForm.svelte -->
<script lang="ts">
	import { addNewEpic } from '$lib/stores/epicsStore';
	import { projectsStore } from '$lib/stores/projectsStore';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	// Prop optionnelle pour pré-sélectionner un projet
	export let preselectedProjectId: string | null = null;

	let showForm = false;
	let epicTitle = '';
	let selectedProjectId = '';

	// S'assurer qu'un projet est sélectionné par défaut
	$: if ($projectsStore.length > 0 && !selectedProjectId) {
		selectedProjectId = preselectedProjectId || $projectsStore[0].id;
	}

	// Mettre à jour la sélection si le projet prédéfini change
	$: if (preselectedProjectId && selectedProjectId !== preselectedProjectId) {
		selectedProjectId = preselectedProjectId;
	}

	function handleSubmit() {
		if (epicTitle.trim() && selectedProjectId) {
			addNewEpic(epicTitle.trim(), selectedProjectId);
			epicTitle = '';
			selectedProjectId = preselectedProjectId || ($projectsStore.length > 0 ? $projectsStore[0].id : '');
			showForm = false;
			dispatch('epicAdded');
		}
	}

	function handleCancel() {
		epicTitle = '';
		selectedProjectId = preselectedProjectId || ($projectsStore.length > 0 ? $projectsStore[0].id : '');
		showForm = false;
	}
</script>

{#if showForm}
	<!-- Formulaire modal -->
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
		<div class="w-96 rounded-lg bg-white p-6 shadow-xl">
			<h3 class="mb-4 text-lg font-semibold">Créer une nouvelle Epic</h3>

			<form on:submit|preventDefault={handleSubmit}>
				<div class="mb-4">
					<label for="epicTitle" class="mb-2 block text-sm font-medium text-gray-700">
						Titre de l'Epic
					</label>
					<input
						id="epicTitle"
						type="text"
						bind:value={epicTitle}
						placeholder="Entrez le titre de l'epic..."
						class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
						required
					/>
				</div>

				<div class="mb-4">
					<label for="projectSelect" class="mb-2 block text-sm font-medium text-gray-700">
						Projet
					</label>
					{#if preselectedProjectId}
						{@const selectedProject = $projectsStore.find(p => p.id === preselectedProjectId)}
						<div class="flex items-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
							<div 
								class="h-4 w-4 rounded-full border border-white shadow-sm" 
								style="background-color: {selectedProject?.color || '#6B7280'}"
							></div>
							<span class="text-gray-700">{selectedProject?.name || 'Projet inconnu'}</span>
						</div>
						<input type="hidden" bind:value={selectedProjectId} />
					{:else}
						<select
							id="projectSelect"
							bind:value={selectedProjectId}
							class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
							required
						>
							{#each $projectsStore as project (project.id)}
								<option value={project.id}>
									● {project.name}
								</option>
							{/each}
						</select>

						{#if $projectsStore.length === 0}
							<p class="mt-1 text-sm text-red-600">
								Aucun projet disponible. Créez d'abord un projet.
							</p>
						{/if}
					{/if}
				</div>

				<div class="flex justify-end space-x-3">
					<button
						type="button"
						on:click={handleCancel}
						class="rounded-md bg-gray-200 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-300"
					>
						Annuler
					</button>
					<button
						type="submit"
						class="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
					>
						Créer Epic
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Bouton pour ouvrir le formulaire -->
<button
	on:click={() => (showForm = true)}
	class="flex transform items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-700"
>
	<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
	</svg>
	Nouvelle Epic
</button>

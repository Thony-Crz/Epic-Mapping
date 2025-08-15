<script lang="ts">
	import { createProject } from '$lib/stores/projectsStore';
	import type { CreateProjectRequest } from '$features/project-management/use-cases/CreateProject';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let isOpen = false;
	let name = '';
	let description = '';
	let color = '#3B82F6';
	let isCreating = false;
	let isLoading = false;
	let errorMessage = '';

	const predefinedColors = [
		'#3B82F6', // Bleu
		'#EF4444', // Rouge
		'#10B981', // Vert
		'#F59E0B', // Jaune
		'#8B5CF6', // Violet
		'#EC4899', // Rose
		'#14B8A6', // Teal
		'#F97316' // Orange
	];

	function openModal() {
		isOpen = true;
	}

	function closeModal() {
		isOpen = false;
		resetForm();
	}

	function resetForm() {
		name = '';
		description = '';
		color = '#3B82F6';
		isCreating = false;
		isLoading = false;
		errorMessage = '';
	}

	async function handleSubmit() {
		if (!name.trim()) return;

		isLoading = true;
		isCreating = true;
		errorMessage = '';
		
		try {
			const request: CreateProjectRequest = { 
				name: name.trim(), 
				description: description.trim(), 
				color 
			};

			const newProject = await createProject(request);
			
			// Réinitialiser le formulaire et fermer le modal
			resetForm();
			closeModal();
		} catch (error) {
			console.error('❌ Erreur lors de la création du projet:', error);
			errorMessage = "Erreur lors de la création du projet";
		} finally {
			isLoading = false;
			isCreating = false;
		}
	}	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}
</script>

<!-- Bouton pour ouvrir le modal -->
<button
	on:click={openModal}
	class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
>
	<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
	</svg>
	Nouveau Projet
</button>

<!-- Modal -->
{#if isOpen}
	<div
		class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"
		on:click={handleBackdropClick}
		on:keydown={(e) => e.key === 'Escape' && closeModal()}
		role="dialog"
		tabindex="-1"
		aria-labelledby="project-modal-title"
		aria-modal="true"
	>
		<div class="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
			<div class="mb-6 flex items-center justify-between">
				<h3 id="project-modal-title" class="text-xl font-bold text-gray-900">Nouveau Projet</h3>
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

			<form on:submit|preventDefault={handleSubmit} class="space-y-4">
				<!-- Message d'erreur -->
				{#if errorMessage}
					<div class="rounded-lg bg-red-50 border border-red-200 p-3">
						<p class="text-sm text-red-700">{errorMessage}</p>
					</div>
				{/if}

				<!-- Nom du projet -->
				<div>
					<label for="project-name" class="mb-2 block text-sm font-medium text-gray-700">
						Nom du projet *
					</label>
					<input
						id="project-name"
						type="text"
						bind:value={name}
						placeholder="Nom de votre projet"
						maxlength="100"
						required
						class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<!-- Description -->
				<div>
					<label for="project-description" class="mb-2 block text-sm font-medium text-gray-700">
						Description (optionnelle)
					</label>
					<textarea
						id="project-description"
						bind:value={description}
						placeholder="Description de votre projet"
						rows="3"
						class="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 transition-colors outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
					></textarea>
				</div>

				<!-- Couleur -->
				<div>
					<div class="mb-2 text-sm font-medium text-gray-700">Couleur du projet</div>
					<div class="flex flex-wrap gap-2">
						{#each predefinedColors as colorOption (colorOption)}
							<button
								type="button"
								on:click={() => (color = colorOption)}
								class="h-8 w-8 rounded-full border-2 transition-all duration-200 {color ===
								colorOption
									? 'scale-110 border-gray-800'
									: 'border-gray-300 hover:border-gray-500'}"
								style="background-color: {colorOption}"
								aria-label="Sélectionner cette couleur"
							></button>
						{/each}
					</div>

					<!-- Aperçu -->
					<div class="mt-3 flex items-center gap-2">
						<div class="h-4 w-4 rounded-full" style="background-color: {color}"></div>
						<span class="text-sm text-gray-600">Aperçu de la couleur sélectionnée</span>
					</div>
				</div>

				<!-- Actions -->
				<div class="flex justify-end gap-3 pt-4">
					<button
						type="button"
						on:click={closeModal}
						class="px-4 py-2 font-medium text-gray-600 transition-colors hover:text-gray-800"
						disabled={isCreating}
					>
						Annuler
					</button>
					<button
						type="submit"
						disabled={isCreating || !name.trim()}
						class="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if isCreating}
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
							Création...
						{:else}
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 4v16m8-8H4"
								></path>
							</svg>
							Créer le Projet
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

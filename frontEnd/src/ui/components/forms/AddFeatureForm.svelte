<script lang="ts">
	import { addFeatureToEpic } from '$lib/stores/epicsStore';

	export let epicId: string;

	let isFormVisible = false;
	let featureTitle = '';

	function handleSubmit() {
		if (featureTitle.trim()) {
			addFeatureToEpic(epicId, featureTitle.trim());
			featureTitle = '';
			isFormVisible = false;
		}
	}

	function toggleForm() {
		isFormVisible = !isFormVisible;
		if (!isFormVisible) {
			featureTitle = '';
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			toggleForm();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="mt-4">
	{#if !isFormVisible}
		<button
			class="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
			on:click={toggleForm}
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"
				></path>
			</svg>
			Ajouter une fonctionnalité
		</button>
	{:else}
		<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
			<h3 class="mb-3 text-lg font-medium">Nouvelle fonctionnalité</h3>
			<form on:submit|preventDefault={handleSubmit} class="space-y-3">
				<div>
					<label for="feature-title" class="mb-1 block text-sm font-medium text-gray-700">
						Titre de la fonctionnalité
					</label>
					<input
						id="feature-title"
						type="text"
						bind:value={featureTitle}
						placeholder="Ex: Saisie du nom d'utilisateur"
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
						required
					/>
				</div>
				<div class="flex gap-2">
					<button
						type="submit"
						class="rounded-md bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 disabled:opacity-50"
						disabled={!featureTitle.trim()}
					>
						Ajouter
					</button>
					<button
						type="button"
						class="rounded-md bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
						on:click={toggleForm}
					>
						Annuler
					</button>
				</div>
			</form>
		</div>
	{/if}
</div>

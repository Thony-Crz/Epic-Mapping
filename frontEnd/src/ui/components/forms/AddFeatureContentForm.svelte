<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let featureId: string;

	const dispatch = createEventDispatcher();

	let isFormVisible = false;
	let contentTitle = '';
	let contentType: 'green' | 'grey' = 'green';

	function handleSubmit() {
		if (contentTitle.trim()) {
			dispatch('addContent', {
				title: contentTitle.trim(),
				type: contentType
			});
			contentTitle = '';
			isFormVisible = false;
		}
	}

	function toggleForm() {
		isFormVisible = !isFormVisible;
		if (!isFormVisible) {
			contentTitle = '';
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			toggleForm();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="mt-2">
	{#if !isFormVisible}
		<button
			class="flex items-center gap-2 rounded-md bg-green-500 px-4 py-1.5 text-sm text-white transition-colors hover:bg-green-600"
			on:click={toggleForm}
		>
			<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"
				></path>
			</svg>
			Ajouter du contenu
		</button>
	{:else}
		<div class="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
			<h4 class="mb-2 text-sm font-medium">Nouveau contenu</h4>
			<form on:submit|preventDefault={handleSubmit} class="space-y-2">
				<div>
					<input
						type="text"
						bind:value={contentTitle}
						placeholder="Ex: L'utilisateur saisit des données valides"
						class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
						required
					/>
				</div>
				<div>
					<fieldset>
						<legend class="mb-1 block text-xs font-medium text-gray-700">Type de contenu</legend>
						<div class="flex gap-2">
							<label class="flex items-center">
								<input type="radio" bind:group={contentType} value="green" class="mr-1" />
								<span class="text-xs">Exemple (vert)</span>
							</label>
							<label class="flex items-center">
								<input type="radio" bind:group={contentType} value="grey" class="mr-1" />
								<span class="text-xs">Question (gris)</span>
							</label>
						</div>
					</fieldset>
				</div>
				<div class="flex gap-2">
					<button
						type="submit"
						class="rounded-md bg-green-500 px-3 py-1 text-xs text-white transition-colors hover:bg-green-600 disabled:opacity-50"
						disabled={!contentTitle.trim()}
					>
						Ajouter
					</button>
					<button
						type="button"
						class="rounded-md bg-gray-500 px-3 py-1 text-xs text-white transition-colors hover:bg-gray-600"
						on:click={toggleForm}
					>
						Annuler
					</button>
				</div>
			</form>
		</div>
	{/if}
</div>

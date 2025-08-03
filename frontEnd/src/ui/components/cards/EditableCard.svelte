<!-- src/ui/components/EditableCard.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import EditableText from '../common/EditableText.svelte';

	export let title: string;
	export let editable: boolean = false;
	export let placeholder: string = 'Entrez du texte...';
	export let cardClass: string = '';
	export let titleClass: string = '';
	export let showDeleteButton: boolean = false;

	const dispatch = createEventDispatcher();

	let isEditing = false;

	function handleEdit() {
		isEditing = true;
	}

	function handleSave(event: CustomEvent<string>) {
		dispatch('titleUpdate', event.detail);
		isEditing = false;
	}

	function handleCancel() {
		isEditing = false;
	}

	function handleDelete() {
		dispatch('delete');
	}
</script>

<div class="relative {cardClass}">
	{#if showDeleteButton}
		<button
			on:click={handleDelete}
			class="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-red-600"
			title="Supprimer"
			aria-label="Supprimer cette carte"
		>
			<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				></path>
			</svg>
		</button>
	{/if}
	{#if editable}
		<EditableText
			text={title}
			{isEditing}
			{placeholder}
			on:edit={handleEdit}
			on:save={handleSave}
			on:cancel={handleCancel}
		/>
	{:else}
		<h4 class={titleClass}>{title}</h4>
	{/if}
	<slot />
</div>

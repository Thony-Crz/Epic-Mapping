<script lang="ts">
	import EditableCard from './EditableCard.svelte';

	export let title: string;
	export let editable: boolean = false;
</script>

<EditableCard
	{title}
	{editable}
	placeholder="Titre de l'epic..."
	cardClass="text-blue-900"
	titleClass="text-lg font-semibold"
	on:titleUpdate
>
	<div class="mt-2">
		<slot />
	</div>
</EditableCard>

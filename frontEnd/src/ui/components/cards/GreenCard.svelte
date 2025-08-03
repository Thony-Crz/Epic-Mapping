<script lang="ts">
	import EditableCard from './EditableCard.svelte';

	export let title: string;
	export let editable: boolean = false;
</script>

<EditableCard
	{title}
	{editable}
	placeholder="Scénario..."
	cardClass="bg-green-300 text-black p-3 rounded-xl shadow-sm hover:shadow-md transition"
	titleClass="text-base font-medium"
	showDeleteButton={true}
	on:titleUpdate
	on:delete
>
	<slot />
</EditableCard>

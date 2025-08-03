<script lang="ts">
	export let title: string;
	export let status: string = '';
</script>

<div class="relative rounded-xl bg-yellow-400 p-3 text-black shadow-sm transition hover:shadow-md">
	<div class="mb-1 flex items-center justify-between">
		<h4 class="text-base font-medium">{title}</h4>
		{#if status}
			<span
				class="rounded-full px-2 py-1 text-xs
        {status === 'ready'
					? 'bg-green-500 text-white'
					: status === 'in-progress'
						? 'bg-orange-500 text-white'
						: 'bg-gray-500 text-white'}"
			>
				{status}
			</span>
		{/if}
	</div>
	<slot />
</div>

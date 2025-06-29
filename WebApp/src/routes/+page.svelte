<script lang="ts">
  import { exampleMapping } from '$lib/data/exampleMapping';
  import { goto } from '$app/navigation';
  import BlueCard from '$ui/components/BlueCard.svelte';

  const blueCards = exampleMapping.filter(e => e.status === 'open');
</script>

<h1 class="text-2xl font-bold mb-4">📘 Epics en cours</h1>

<div class="flex flex-wrap gap-4">
  {#each blueCards as card (card.id)}

  <button 
  on:click={() => goto(`/epic/${card.id}`)}
  class="cursor-pointer">
    <BlueCard title={card.title} id={card.id} />
  </button>

  {/each}
</div>

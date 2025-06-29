<script lang="ts">
  import { page } from '$app/stores';
  import { exampleMapping } from '$lib/data/exampleMapping';
  import BlueCard from '$ui/components/BlueCard.svelte';
  import YellowCard from '$ui/components/YellowCard.svelte';
  import GreenCard from '$ui/components/GreenCard.svelte';
  import GreyCard from '$ui/components/GreyCard.svelte';

  $: id = $page.params.id;
  $: epic = exampleMapping.find(e => e.id === id);
</script>

{#if epic}
  <BlueCard title={epic.title}>
    {#each epic.features as feature}
      <YellowCard title={feature.title}>
        {#each feature.scenarios as scenario}
          {#if scenario.type === 'green'}
            <GreenCard title={scenario.title} />
          {:else if scenario.type === 'grey'}
            <GreyCard title={scenario.title} />
          {/if}
        {/each}
      </YellowCard>
    {/each}
  </BlueCard>
{:else}
  <p class="text-red-500">Épic non trouvé</p>
{/if}

<script lang="ts">
  import { page } from '$app/stores';
  import { exampleMapping } from '$lib/data/exampleMapping';
  import BlueCard from '$ui/components/BlueCard.svelte';
  import YellowCard from '$ui/components/YellowCard.svelte';
  import GreenCard from '$ui/components/GreenCard.svelte';
  import GreyCard from '$ui/components/GreyCard.svelte';
  import YellowStatusCard from '$ui/components/YellowStatusCard.svelte';

  $: id = $page.params.id;
  $: epic = exampleMapping.find(e => e.id === id);
</script>

{#if epic}
  <BlueCard title={epic.title}>
    <div class="flex flex-wrap gap-4">
      {#each epic.features as feature}
        <YellowCard title={feature.title}>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium">Status:</span>
            <span class="text-xs px-2 py-1 rounded-full 
              {feature.status === 'ready' ? 'bg-green-500 text-white' : 
               feature.status === 'in-progress' ? 'bg-orange-500 text-white' : 
               'bg-gray-500 text-white'}">
              {feature.status || 'undefined'}
            </span>
          </div>
          {#each feature.scenarios as scenario}
            {#if scenario.type === 'green'}
              <GreenCard title={scenario.title} />
            {:else if scenario.type === 'grey'}
              <GreyCard title={scenario.title} />
            {/if}
          {/each}
        </YellowCard>
      {/each}
    </div>
  </BlueCard>
{:else}
  <p class="text-red-500">Épic non trouvé</p>
{/if}

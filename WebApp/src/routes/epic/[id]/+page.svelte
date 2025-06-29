<script lang="ts">
  import { page } from '$app/stores';
  import { epicsStore } from '$lib/stores/epicsStore';
  import BlueCard from '$ui/components/BlueCard.svelte';
  import YellowCard from '$ui/components/YellowCard.svelte';
  import GreenCard from '$ui/components/GreenCard.svelte';
  import GreyCard from '$ui/components/GreyCard.svelte';
  import YellowStatusCard from '$ui/components/YellowStatusCard.svelte';
  import AddFeatureForm from '$ui/components/AddFeatureForm.svelte';

  $: id = $page.params.id;
  $: epic = $epicsStore.find(e => e.id === id);
</script>

{#if epic}
  <BlueCard title={epic.title}>
    <AddFeatureForm epicId={id} />
    <br class="my-4 border-t border-gray-200" />
    {#if epic.features.length > 0}
      <div class="flex flex-wrap gap-4">
        {#each epic.features as feature}
          <YellowCard title={feature.title}>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium">Status:</span>
              <span class="text-xs px-2 py-1 rounded-full 
                {feature.status === 'ready' ? 'bg-green-500 text-white' : 
                 feature.status === 'in-progress' ? 'bg-orange-500 text-white' : 
                 feature.status === 'todo' ? 'bg-blue-500 text-white' :
                 'bg-gray-500 text-white'}">
                {feature.status}
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
    {:else}
      <div class="text-center py-8">
        <div class="text-gray-500 mb-4">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p class="text-lg font-medium">Cette épic est vide</p>
          <p class="text-sm">Commencez par ajouter des fonctionnalités pour structurer votre épic.</p>
        </div>
      </div>
    {/if}
  </BlueCard>
{:else}
  <p class="text-red-500">Épic non trouvé</p>
{/if}

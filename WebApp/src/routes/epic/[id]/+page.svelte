<script lang="ts">
  import { page } from '$app/stores';
  import { epicsStore, updateFeature, updateScenario, updateEpicTitle } from '$lib/stores/epicsStore';
  import BlueCard from '$ui/components/BlueCard.svelte';
  import YellowCard from '$ui/components/YellowCard.svelte';
  import GreenCard from '$ui/components/GreenCard.svelte';
  import GreyCard from '$ui/components/GreyCard.svelte';
  import YellowStatusCard from '$ui/components/YellowStatusCard.svelte';
  import AddFeatureForm from '$ui/components/AddFeatureForm.svelte';

  $: id = $page.params.id;
  $: epic = $epicsStore.find(e => e.id === id);

  function handleEpicTitleUpdate(newTitle: string) {
    updateEpicTitle(id, newTitle);
  }

  function handleFeatureUpdate(featureId: string, newTitle: string) {
    updateFeature(id, featureId, newTitle);
  }

  function handleScenarioUpdate(featureId: string, scenarioIndex: number, newTitle: string) {
    updateScenario(id, featureId, scenarioIndex, newTitle);
  }
</script>

{#if epic}
  <!-- Bouton de retour -->
  <div class="mb-6">
    <button 
      on:click={() => history.back()}
      class="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 transition-all duration-200 flex items-center gap-2"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      Retour
    </button>
  </div>

  <!-- Container principal avec effet tableau blanc -->
  <div class="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-lg">
    <BlueCard 
      title={epic.title} 
      editable={true}
      on:titleUpdate={(e) => handleEpicTitleUpdate(e.detail)}    >
      <AddFeatureForm epicId={id} />
      <hr class="my-6 border-t border-gray-200" />
      {#if epic.features.length > 0}
      <div class="flex flex-wrap gap-4">
        {#each epic.features as feature, featureIndex}
          <YellowCard 
            title={feature.title} 
            status={feature.status}
            editable={true}
            on:titleUpdate={(e) => handleFeatureUpdate(feature.id, e.detail)}
          >
            {#each feature.scenarios as scenario, scenarioIndex}
              {#if scenario.type === 'green'}
                <GreenCard 
                  title={scenario.title} 
                  editable={true}
                  on:titleUpdate={(e) => handleScenarioUpdate(feature.id, scenarioIndex, e.detail)}
                />
              {:else if scenario.type === 'grey'}
                <GreyCard 
                  title={scenario.title} 
                  editable={true}
                  on:titleUpdate={(e) => handleScenarioUpdate(feature.id, scenarioIndex, e.detail)}
                />
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
  </div>
{:else}
  <p class="text-red-500">Épic non trouvé</p>
{/if}

<script lang="ts">
  import { exampleMapping } from '$lib/data/exampleMapping';
  import { goto } from '$app/navigation';
  import BlueCard from '$ui/components/BlueCard.svelte';

  // Fonction pour vérifier si une épic est "ready"
  function isEpicReady(epic: any): boolean {
    const allScenarios = epic.features.flatMap((feature: any) => feature.scenarios);
    
    // Vérifier qu'il n'y a aucune carte grise
    const hasGreyCards = allScenarios.some((scenario: any) => scenario.type === 'grey');
    if (hasGreyCards) return false;
    
    // Vérifier qu'il y a au moins une carte verte
    const hasGreenCards = allScenarios.some((scenario: any) => scenario.type === 'green');
    if (!hasGreenCards) return false;
    
    // Vérifier que toutes les features (cartes jaunes) ont le statut "ready"
    const allFeaturesReady = epic.features.every((feature: any) => feature.status === 'ready');
    
    return allFeaturesReady;
  }

  const readyEpics = exampleMapping.filter(isEpicReady);
  const openEpics = exampleMapping.filter(epic => !isEpicReady(epic));
</script>

<h1 class="text-2xl font-bold mb-6">📘 Gestion des Epics</h1>

<!-- Section des Epics Ready -->
<section class="mb-8">
  <h2 class="text-xl font-semibold mb-4 text-green-700">✅ Epics Ready ({readyEpics.length})</h2>
  <div class="flex flex-wrap gap-4">
    {#each readyEpics as card (card.id)}
      <button 
        on:click={() => goto(`/epic/${card.id}`)}
        class="bg-green-100 text-green-900 w-60 p-4 rounded-lg shadow-lg rotate-[1deg] hover:rotate-0 transition-transform cursor-pointer border-2 border-green-300">
        <BlueCard title={card.title} id={card.id} />
      </button>
    {/each}
  </div>
  {#if readyEpics.length === 0}
    <p class="text-gray-500 italic">Aucune épic ready pour le moment</p>
  {/if}
</section>

<!-- Section des Epics Open -->
<section>
  <h2 class="text-xl font-semibold mb-4 text-blue-700">🔄 Epics en cours ({openEpics.length})</h2>
  <div class="flex flex-wrap gap-4">
    {#each openEpics as card (card.id)}
      <button 
        on:click={() => goto(`/epic/${card.id}`)}
        class="bg-blue-100 text-blue-900 w-60 p-4 rounded-lg shadow-lg rotate-[1deg] hover:rotate-0 transition-transform cursor-pointer">
        <BlueCard title={card.title} id={card.id} />
      </button>
    {/each}
  </div>
</section>

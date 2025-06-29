<script lang="ts">
  import { epicsStore } from '$lib/stores/epicsStore';
  import { goto } from '$app/navigation';
  import BlueCard from '$ui/components/cards/BlueCard.svelte';
  import AddEpicForm from '$ui/components/forms/AddEpicForm.svelte';

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

  // Variables réactives qui se mettent à jour automatiquement
  $: readyEpics = $epicsStore.filter(isEpicReady);
  $: openEpics = $epicsStore.filter(epic => !isEpicReady(epic));
</script>

<!-- Bouton pour ajouter une nouvelle epic -->
<div class="mb-8 text-center">
  <AddEpicForm />
</div>

<!-- Section des Epics Ready -->
<section class="mb-12 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
  <div class="flex items-center gap-3 mb-6">
    <div class="w-4 h-4 bg-green-500 rounded-full"></div>
    <h2 class="text-2xl font-bold text-green-700">Epics Ready</h2>
    <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">{readyEpics.length}</span>
  </div>
  
  <div class="flex flex-wrap gap-6 justify-start">
    {#each readyEpics as card (card.id)}
      <button 
        on:click={() => goto(`/epic/${card.id}`)}
        class="post-it-card bg-green-200 hover:bg-green-100 text-green-900 w-64 p-5 rounded-lg shadow-lg transform rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer border-l-4 border-green-500 relative group"
        style="box-shadow: 4px 4px 8px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.5);"
      >
        <!-- Effet "punaise" -->
        <div class="absolute -top-2 -right-2 w-4 h-4 bg-red-400 rounded-full shadow-md border-2 border-white opacity-60 group-hover:opacity-80 transition-opacity"></div>
        <BlueCard title={card.title} />
      </button>
    {/each}
  </div>
  
  {#if readyEpics.length === 0}
    <div class="text-center py-12">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p class="text-gray-500 italic">Aucune épic ready pour le moment</p>
    </div>
  {/if}
</section>

<!-- Section des Epics Open -->
<section class="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
  <div class="flex items-center gap-3 mb-6">
    <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
    <h2 class="text-2xl font-bold text-blue-700">Epics en cours</h2>
    <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{openEpics.length}</span>
  </div>
  
  <div class="flex flex-wrap gap-6 justify-start">
    {#each openEpics as card (card.id)}
      <button 
        on:click={() => goto(`/epic/${card.id}`)}
        class="post-it-card bg-blue-200 hover:bg-blue-100 text-blue-900 w-64 p-5 rounded-lg shadow-lg transform -rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer border-l-4 border-blue-500 relative group"
        style="box-shadow: 4px 4px 8px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.5);"
      >
        <!-- Effet "punaise" -->
        <div class="absolute -top-2 -right-2 w-4 h-4 bg-red-400 rounded-full shadow-md border-2 border-white opacity-60 group-hover:opacity-80 transition-opacity"></div>
        <BlueCard title={card.title} />
      </button>
    {/each}
  </div>
</section>

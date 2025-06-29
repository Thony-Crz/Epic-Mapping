<script lang="ts">
  import { page } from '$app/stores';
  import { epicsStore, updateFeature, updateScenario, updateEpicTitle, updateFeatureStatus, handleAutomaticStatusTransition, addScenarioToFeatureById, reorderFeatures, reorderScenarios, moveScenarioBetweenFeatures } from '$lib/stores/epicsStore';
  import { dndzone, TRIGGERS, SOURCES } from 'svelte-dnd-action';
  import BlueCard from '$ui/components/cards/BlueCard.svelte';
  import YellowCard from '$ui/components/cards/YellowCard.svelte';
  import GreenCard from '$ui/components/cards/GreenCard.svelte';
  import GreyCard from '$ui/components/cards/GreyCard.svelte';
  import YellowStatusCard from '$ui/components/cards/YellowStatusCard.svelte';
  import AddFeatureForm from '$ui/components/forms/AddFeatureForm.svelte';
  import AddFeatureContentForm from '$ui/components/forms/AddFeatureContentForm.svelte';

  $: id = $page.params.id;
  $: epic = $epicsStore.find(e => e.id === id);

  // Variables pour le drag and drop
  let featuresWithId: any[] = [];
  let scenariosForDnd: {[key: string]: any[]} = {};
  
  $: if (epic) {
    // Préparer les features avec des IDs uniques pour le DnD
    featuresWithId = epic.features.map((feature, index) => ({
      ...feature,
      id: feature.id // svelte-dnd-action a besoin d'une propriété 'id'
    }));
    
    // Préparer les scenarios pour chaque feature
    scenariosForDnd = {};
    epic.features.forEach(feature => {
      scenariosForDnd[feature.id] = prepareScenariosForDnd(feature.scenarios);
    });
  }

  // Effet réactif pour gérer les transitions automatiques de statut
  $: if (epic) {
    epic.features.forEach(feature => {
      handleAutomaticStatusTransition(id, feature.id, feature.scenarios);
    });
  }

  function handleEpicTitleUpdate(newTitle: string) {
    updateEpicTitle(id, newTitle);
  }

  function handleFeatureUpdate(featureId: string, newTitle: string) {
    updateFeature(id, featureId, newTitle);
  }

  function handleFeatureStatusUpdate(featureId: string, newStatus: 'ready' | 'in-progress' | 'todo') {
    updateFeatureStatus(id, featureId, newStatus);
  }

  function handleScenarioUpdate(featureId: string, scenarioIndex: number, newTitle: string) {
    updateScenario(id, featureId, scenarioIndex, newTitle);
  }

  function handleAddScenario(featureId: string, event: CustomEvent<{title: string, type: 'green' | 'grey'}>) {
    const { title, type } = event.detail;
    addScenarioToFeatureById(id, featureId, title, type);
  }

  // Gestion du drag and drop pour les features
  function handleFeaturesDnd(e: CustomEvent) {
    const newFeatures = e.detail.items.map((item: any) => {
      // Les items gardent déjà la structure correcte
      return item;
    });
    reorderFeatures(id, newFeatures);
  }

  // Gestion du drag and drop pour les scenarios dans une feature
  function handleScenariosDnd(featureId: string, e: CustomEvent) {
    console.log('DnD Event:', e.type, e.detail.items);
    
    if (e.type === 'consider') {
      // Mettre à jour l'affichage pendant le glissement
      scenariosForDnd[featureId] = e.detail.items;
    } else if (e.type === 'finalize') {
      // Sauvegarder définitivement quand le glissement est terminé
      const newScenarios = e.detail.items.map((item: any) => {
        const { id: dndId, ...scenario } = item;
        return scenario;
      });
      
      console.log('Saving scenarios:', newScenarios);
      reorderScenarios(id, featureId, newScenarios);
      
      // Remettre à jour la version pour DnD
      scenariosForDnd[featureId] = prepareScenariosForDnd(newScenarios);
    }
  }

  // Préparation des scenarios avec des IDs STABLES pour le DnD
  function prepareScenariosForDnd(scenarios: any[]) {
    return scenarios.map((scenario, index) => ({
      ...scenario,
      id: `${scenario.title}-${scenario.type}-${index}` // ID stable basé sur le contenu
    }));
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
      <div 
        class="flex flex-wrap gap-4"
        use:dndzone={{
          items: featuresWithId,
          flipDurationMs: 300,
          dropTargetStyle: {
            outline: '2px dashed #3b82f6',
            outlineOffset: '4px'
          }
        }}
        on:consider={handleFeaturesDnd}
        on:finalize={handleFeaturesDnd}
      >
        {#each featuresWithId as feature, featureIndex (feature.id)}
          <div class="dnd-feature-container">
            <YellowCard 
              title={feature.title} 
              status={feature.status}
              scenarios={feature.scenarios}
              editable={true}
              on:titleUpdate={(e) => handleFeatureUpdate(feature.id, e.detail)}
              on:statusUpdate={(e) => handleFeatureStatusUpdate(feature.id, e.detail)}
            >
            <br />
              <!-- Zone de glisser-déposer pour les scenarios -->
              <div 
                class="scenarios-container"
                use:dndzone={{
                  items: scenariosForDnd[feature.id] || [],
                  flipDurationMs: 200,
                  dropTargetStyle: {
                    outline: '2px dashed #10b981',
                    outlineOffset: '2px'
                  }
                }}
                on:consider={(e) => handleScenariosDnd(feature.id, e)}
                on:finalize={(e) => handleScenariosDnd(feature.id, e)}
              >
                {#each (scenariosForDnd[feature.id] || []) as scenario, scenarioIndex (scenario.id)}
                  <div class="scenario-item mb-2">
                    {#if scenario.type === 'green'}
                      <GreenCard 
                        title={scenario.title} 
                        editable={true}
                        on:titleUpdate={(e) => {
                          // Trouver l'index réel dans le tableau original
                          const realIndex = feature.scenarios.findIndex(s => 
                            s.title === scenario.title && s.type === scenario.type
                          );
                          if (realIndex !== -1) {
                            handleScenarioUpdate(feature.id, realIndex, e.detail);
                          }
                        }}
                      />
                    {:else if scenario.type === 'grey'}
                      <GreyCard 
                        title={scenario.title} 
                        editable={true}
                        on:titleUpdate={(e) => {
                          // Trouver l'index réel dans le tableau original
                          const realIndex = feature.scenarios.findIndex(s => 
                            s.title === scenario.title && s.type === scenario.type
                          );
                          if (realIndex !== -1) {
                            handleScenarioUpdate(feature.id, realIndex, e.detail);
                          }
                        }}
                      />
                    {/if}
                  </div>
                {/each}
              </div>
              <AddFeatureContentForm 
                featureId={feature.id}
                on:addContent={(e) => handleAddScenario(feature.id, e)}
              />
            </YellowCard>
          </div>
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

<style>
  :global(.dnd-feature-container) {
    transition: all 0.3s ease;
  }
  
  :global(.dnd-feature-container:hover) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  :global(.scenarios-container) {
    min-height: 50px;
    padding: 4px;
    border-radius: 8px;
    transition: all 0.2s ease;
  }
  
  :global(.scenario-item) {
    transition: all 0.2s ease;
  }
  
  :global(.scenario-item:hover) {
    transform: scale(1.02);
  }
  
  /* Styles pour les états de drag */
  :global(.dnd-action-dragged-el) {
    opacity: 0.5;
    transform: rotate(5deg);
  }
  
  :global(.drop-target-highlighted) {
    background-color: rgba(59, 130, 246, 0.1);
    border: 2px dashed #3b82f6;
  }
</style>

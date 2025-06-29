<script lang="ts">
  import { onMount } from 'svelte';
  import { epicsDisplayStore, archiveEpic } from '$lib/stores/epicsStore';
  import { projectsStore, loadProjects } from '$lib/stores/projectsStore';
  import { serviceContainer } from '../services/ServiceContainer';
  import { exampleProjects } from '$lib/data/exampleMapping';
  import { goto } from '$app/navigation';
  import BlueCard from '$ui/components/cards/BlueCard.svelte';
  import AddEpicForm from '$ui/components/forms/AddEpicForm.svelte';
  import AddProjectForm from '$ui/components/forms/AddProjectForm.svelte';
  import ExportEpicsForm from '$ui/components/forms/ExportEpicsForm.svelte';

  // Charger les données au démarrage
  onMount(async () => {
    try {
      console.log('🔄 Initialisation de l\'application...');
      
      // Réinitialiser les données épics avec les nouvelles données d'exemple
      serviceContainer.reinitializeEpicsData();
      console.log('✅ Données épics réinitialisées');
      
      // Charger les projets
      await loadProjects();
      console.log('✅ Projets chargés');
      
      console.log('🎉 Initialisation terminée');
    } catch (error) {
      console.error('❌ Erreur lors du chargement initial:', error);
    }
  });

  // Fonction pour vérifier si une épic est "ready" pour l'export
  function isEpicReady(epic: any): boolean {
    // Si l'épic a le statut "closed", elle est considérée comme ready pour l'export
    if (epic.status === 'closed') {
      return true;
    }
    
    // Sinon, on applique la logique habituelle
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

  // Fonction pour archiver une épic
  async function handleArchiveEpic(epicId: string, event: Event) {
    event.stopPropagation(); // Empêcher la navigation
    try {
      await archiveEpic(epicId);
    } catch (error) {
      console.error('Erreur lors de l\'archivage:', error);
    }
  }

  // Variables réactives qui se mettent à jour automatiquement
  $: readyEpics = $epicsDisplayStore.filter(epic => epic.status !== 'archived' && isEpicReady(epic));
  $: openEpics = $epicsDisplayStore.filter(epic => epic.status !== 'archived' && !isEpicReady(epic));
  $: archivedEpics = $epicsDisplayStore.filter(epic => epic.status === 'archived');

  // Debug logs
  $: if ($epicsDisplayStore.length > 0) {
    console.log(`📊 Épics totales: ${$epicsDisplayStore.length}`);
    console.log(`✅ Ready: ${readyEpics.length}, 🔄 En cours: ${openEpics.length}, 📦 Archivées: ${archivedEpics.length}`);
    console.log('📋 Détail épics:', $epicsDisplayStore.map(e => `${e.title} (${e.status}) - Projet: ${e.projectId}`));
  }

  // Regrouper les épics par projet
  $: epicsByProject = $projectsStore.reduce((acc, project) => {
    acc[project.id] = {
      project,
      readyEpics: readyEpics.filter(epic => epic.projectId === project.id),
      openEpics: openEpics.filter(epic => epic.projectId === project.id),
      archivedEpics: archivedEpics.filter(epic => epic.projectId === project.id)
    };
    return acc;
  }, {} as Record<string, any>);

  // Variables pour le modal d'export
  let isExportModalOpen = false;

  function openExportModal() {
    if (readyEpics.length === 0) {
      alert('Aucune épic ready à exporter');
      return;
    }
    isExportModalOpen = true;
  }

  function closeExportModal() {
    isExportModalOpen = false;
  }
</script>

<!-- En-tête avec les boutons d'action -->
<div class="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
  <h1 class="text-3xl font-bold text-gray-900">Gestion des Epics</h1>
  
  <div class="flex gap-3">
    <AddProjectForm />
    <AddEpicForm />
    <!-- Bouton debug temporaire -->
    <button 
      on:click={async () => {
        console.log('🔄 Rechargement forcé des données...');
        // Réinitialiser les projets d'abord avec les IDs corrects
        await serviceContainer.reinitializeProjectsData(exampleProjects);
        console.log('✅ Projets réinitialisés avec IDs prédéfinis');
        
        // Puis réinitialiser les épics
        serviceContainer.reinitializeEpicsData();
        console.log('✅ Épics réinitialisées');
        
        // Recharger les projets dans le store
        await loadProjects();
        console.log('✅ Store des projets rechargé');
      }}
      class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
      title="Recharger les données (debug)"
    >
      🔄 Debug
    </button>
  </div>
</div>

<!-- Bouton Export global pour toutes les épics ready -->
{#if readyEpics.length > 0}
  <div class="mb-6 flex justify-end">
    <button 
      on:click={openExportModal}
      class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg"
      title="Exporter les épics ready"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      Exporter épics ready ({readyEpics.length})
    </button>
  </div>
{/if}

<!-- Affichage par projet -->
{#each Object.values(epicsByProject) as { project, readyEpics: projectReadyEpics, openEpics: projectOpenEpics, archivedEpics: projectArchivedEpics }}
  {@const totalEpics = projectReadyEpics.length + projectOpenEpics.length + projectArchivedEpics.length}
  
  {#if totalEpics > 0}
    <section class="mb-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
      <!-- En-tête du projet -->
      <div class="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        <div 
          class="w-6 h-6 rounded-full border-2 border-white shadow-sm" 
          style="background-color: {project.color || '#6B7280'}"
        ></div>
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-800">{project.name}</h2>
          {#if project.description}
            <p class="text-gray-600 mt-1">{project.description}</p>
          {/if}
        </div>
        <div class="flex gap-2">
          {#if projectReadyEpics.length > 0}
            <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              {projectReadyEpics.length} ready
            </span>
          {/if}
          {#if projectOpenEpics.length > 0}
            <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {projectOpenEpics.length} en cours
            </span>
          {/if}
          {#if projectArchivedEpics.length > 0}
            <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
              {projectArchivedEpics.length} archivée{projectArchivedEpics.length > 1 ? 's' : ''}
            </span>
          {/if}
        </div>
      </div>

      <!-- Épics Ready du projet -->
      {#if projectReadyEpics.length > 0}
        <div class="mb-6">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <h3 class="text-lg font-semibold text-green-700">Ready</h3>
          </div>
          <div class="flex flex-wrap gap-4">
            {#each projectReadyEpics as card (card.id)}
              <div class="relative">
                <button 
                  on:click={() => goto(`/epic/${card.id}`)}
                  class="post-it-card bg-green-200 hover:bg-green-100 text-green-900 w-60 p-4 rounded-lg shadow-lg transform rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer border-l-4 border-green-500"
                  style="box-shadow: 4px 4px 8px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.5);"
                >
                  <BlueCard title={card.title} />
                </button>
                <button 
                  on:click={(e) => handleArchiveEpic(card.id, e)}
                  class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full shadow-md border-2 border-white opacity-60 hover:opacity-100 transition-all duration-200 flex items-center justify-center z-10"
                  title="Archiver cette épic"
                  aria-label="Archiver cette épic"
                >
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Épics en cours du projet -->
      {#if projectOpenEpics.length > 0}
        <div class="mb-6">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h3 class="text-lg font-semibold text-blue-700">En cours</h3>
          </div>
          <div class="flex flex-wrap gap-4">
            {#each projectOpenEpics as card (card.id)}
              <div class="relative">
                <button 
                  on:click={() => goto(`/epic/${card.id}`)}
                  class="post-it-card bg-blue-200 hover:bg-blue-100 text-blue-900 w-60 p-4 rounded-lg shadow-lg transform -rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer border-l-4 border-blue-500"
                  style="box-shadow: 4px 4px 8px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.5);"
                >
                  <BlueCard title={card.title} />
                </button>
                <button 
                  on:click={(e) => handleArchiveEpic(card.id, e)}
                  class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full shadow-md border-2 border-white opacity-60 hover:opacity-100 transition-all duration-200 flex items-center justify-center z-10"
                  title="Archiver cette épic"
                  aria-label="Archiver cette épic"
                >
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Épics archivées du projet -->
      {#if projectArchivedEpics.length > 0}
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-3 h-3 bg-gray-500 rounded-full"></div>
            <h3 class="text-lg font-semibold text-gray-700">Archivées</h3>
          </div>
          <div class="flex flex-wrap gap-4">
            {#each projectArchivedEpics as card (card.id)}
              <button 
                on:click={() => goto(`/epic/${card.id}`)}
                class="post-it-card bg-gray-200 hover:bg-gray-100 text-gray-700 w-60 p-4 rounded-lg shadow-lg transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer border-l-4 border-gray-500 opacity-75 hover:opacity-100"
                style="box-shadow: 4px 4px 8px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.5);"
              >
                <BlueCard title={card.title} />
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </section>
  {/if}
{/each}

<!-- Message si aucun projet ou épic -->
{#if $projectsStore.length === 0 || ($epicsDisplayStore.filter(epic => epic.status !== 'archived').length === 0)}
  <div class="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200">
    <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <svg class="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
      </svg>
    </div>
    <h3 class="text-xl font-semibold text-gray-700 mb-2">Commencez par créer un projet</h3>
    <p class="text-gray-500 mb-6">Créez votre premier projet pour organiser vos épics</p>
    <div class="flex gap-3 justify-center">
      <AddProjectForm />
    </div>
  </div>
{/if}

<!-- Modal d'export -->
<ExportEpicsForm 
  bind:isOpen={isExportModalOpen} 
  {readyEpics}
  on:close={closeExportModal} 
/>

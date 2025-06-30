<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { projectsStore } from '$lib/stores/projectsStore';

  export let isOpen = false;
  export let readyEpics: any[] = [];

  const dispatch = createEventDispatcher();

  let selectedEpicId = '';
  let selectedProjectId = 'all'; // Nouveau filtre par projet
  let isExporting = false;
  let azurePath = '';
  let showAzurePathInput = false;

  // Épics filtrées par projet
  $: filteredEpics = selectedProjectId === 'all' 
    ? readyEpics 
    : readyEpics.filter(epic => epic.projectId === selectedProjectId);

  // Réactive : épic sélectionnée
  $: selectedEpic = filteredEpics.find(epic => epic.id === selectedEpicId);

  // Réinitialiser la sélection d'épic quand le filtre projet change
  $: if (selectedProjectId) {
    if (filteredEpics.length > 0 && !filteredEpics.some(epic => epic.id === selectedEpicId)) {
      selectedEpicId = filteredEpics[0]?.id || '';
    } else if (filteredEpics.length === 0) {
      selectedEpicId = '';
    }
  }

  // Initialiser la première épic par défaut quand les épics changent
  $: if (filteredEpics.length > 0 && !selectedEpicId) {
    selectedEpicId = filteredEpics[0].id;
  }

  // Trouver le nom du projet pour une épic
  function getProjectName(projectId: string): string {
    const project = $projectsStore.find(p => p.id === projectId);
    return project ? project.name : 'Projet inconnu';
  }

  function closeModal() {
    isOpen = false;
    selectedProjectId = 'all'; // Réinitialiser le filtre
    selectedEpicId = '';
    azurePath = '';
    dispatch('close');
  }

  function handleExportToExcel() {
    if (!selectedEpic) {
      alert('Veuillez sélectionner une épic à exporter');
      return;
    }

    isExporting = true;
    exportToExcel();
    isExporting = false;
    closeModal();
  }

  function handleTransferToAzure() {
    if (!selectedEpic) {
      alert('Veuillez sélectionner une épic à transférer');
      return;
    }

    if (!azurePath.trim()) {
      alert('Veuillez saisir le chemin Azure DevOps');
      return;
    }

    isExporting = true;
    transferToAzureDevOps();
    isExporting = false;
    closeModal();
  }

  function exportToExcel() {
    if (!selectedEpic) return;
    
    const epic = selectedEpic;
    const projectName = getProjectName(epic.projectId);
    
    const epicData: any = {
      'Project Name': projectName,
      'Project ID': epic.projectId,
      'Epic Title': epic.title,
      'Epic ID': epic.id,
      'Status': epic.status,
      'Features Count': epic.features.length,
      'Total Scenarios': epic.features.flatMap((f: any) => f.scenarios).length
    };

    epic.features.forEach((feature: any, fIndex: number) => {
      epicData[`Feature ${fIndex + 1} - Title`] = feature.title;
      epicData[`Feature ${fIndex + 1} - Status`] = feature.status;
      
      feature.scenarios.forEach((scenario: any, sIndex: number) => {
        epicData[`Feature ${fIndex + 1} - Scenario ${sIndex + 1} - Title`] = scenario.title;
        epicData[`Feature ${fIndex + 1} - Scenario ${sIndex + 1} - Type`] = scenario.type;
      });
    });

    const csvContent = convertToCSV([epicData]);
    const safeProjectName = projectName.replace(/[^a-zA-Z0-9]/g, '-');
    const safeEpicTitle = epic.title.replace(/[^a-zA-Z0-9]/g, '-');
    downloadCSV(csvContent, `${safeProjectName}-epic-${safeEpicTitle}-export.csv`);
  }

  function convertToCSV(data: any[]) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || '';
        return `"${value.toString().replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  }

  function downloadCSV(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function transferToAzureDevOps() {
    if (!selectedEpic) return;
    
    alert(`Transfert de l'épic "${selectedEpic.title}" vers Azure DevOps au chemin "${azurePath}" sera implémenté côté WebAPI prochainement`);
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }
</script>

{#if isOpen}
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    on:click={handleBackdropClick}
    on:keydown={(e) => e.key === 'Escape' && closeModal()}
    role="dialog"
    tabindex="-1"
    aria-labelledby="export-modal-title"
    aria-modal="true"
  >
    <div class="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
      <div class="flex items-center justify-between mb-6">
        <h3 id="export-modal-title" class="text-xl font-bold text-gray-900">
          Exporter une Epic Ready
        </h3>
        <button 
          on:click={closeModal}
          class="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fermer"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="mb-6">
        <p class="text-sm text-gray-600 mb-4">
          {readyEpics.length} épic{readyEpics.length > 1 ? 's' : ''} ready disponible{readyEpics.length > 1 ? 's' : ''}
          {#if selectedProjectId !== 'all'}
            • {filteredEpics.length} dans le projet sélectionné
          {/if}
        </p>

        <!-- Filtre par projet -->
        <div class="mb-4">
          <label for="project-filter" class="block text-sm font-medium text-gray-700 mb-2">
            Filtrer par projet
          </label>
          <select 
            id="project-filter"
            bind:value={selectedProjectId}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          >
            <option value="all">Tous les projets ({readyEpics.length} épics)</option>
            {#each $projectsStore as project (project.id)}
              {@const projectEpics = readyEpics.filter(epic => epic.projectId === project.id)}
              {#if projectEpics.length > 0}
                <option value={project.id}>
                  {project.name} ({projectEpics.length} épic{projectEpics.length > 1 ? 's' : ''})
                </option>
              {/if}
            {/each}
          </select>
        </div>

        <!-- Sélection de l'épic -->
        <div class="mb-4">
          <label for="epic-select" class="block text-sm font-medium text-gray-700 mb-2">
            Épic à exporter
          </label>
          {#if filteredEpics.length > 0}
            <select 
              id="epic-select"
              bind:value={selectedEpicId}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
            >
              {#each filteredEpics as epic (epic.id)}
                <option value={epic.id}>
                  {epic.title}
                  {#if selectedProjectId === 'all'}
                    • {getProjectName(epic.projectId)}
                  {/if}
                </option>
              {/each}
            </select>
          {:else}
            <div class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-center">
              Aucune épic ready dans ce projet
            </div>
          {/if}
          
          <!-- Aperçu de l'épic sélectionnée -->
          {#if selectedEpic}
            <div class="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div class="text-sm text-green-800">
                <p class="font-medium mb-1">Aperçu de l'épic :</p>
                <p class="mb-1"><span class="font-medium">Features :</span> {selectedEpic.features.length}</p>
                <p><span class="font-medium">Scénarios :</span> {selectedEpic.features.flatMap(f => f.scenarios).length}</p>
              </div>
            </div>
          {/if}
        </div>

        <!-- Type d'export -->
        <div>
          <div class="text-sm font-medium text-gray-700 mb-3">
            Actions d'export
          </div>
          
          <!-- Chemin Azure DevOps -->
          <div class="mb-4">
            <label for="azure-path" class="block text-sm font-medium text-gray-700 mb-2">
              Chemin Azure DevOps (pour le transfert)
            </label>
            <input 
              id="azure-path"
              type="text"
              bind:value={azurePath}
              placeholder="ex: MonProjet/MonArea/Backlog"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <div class="flex gap-3 justify-between">
        <button 
          on:click={closeModal}
          class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          disabled={isExporting}
        >
          Annuler
        </button>
        
        <div class="flex gap-3">
          <!-- Bouton Export Excel -->
          <button 
            on:click={handleExportToExcel}
            disabled={isExporting || !selectedEpic || filteredEpics.length === 0}
            class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {#if isExporting}
              <svg class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Export en cours...
            {:else}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Export Excel
            {/if}
          </button>

          <!-- Bouton Transférer Azure -->
          <button 
            on:click={handleTransferToAzure}
            disabled={isExporting || !selectedEpic || !azurePath.trim() || filteredEpics.length === 0}
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {#if isExporting}
              <svg class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Transfert en cours...
            {:else}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Transférer à Azure
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

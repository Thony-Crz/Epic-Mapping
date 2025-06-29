<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let isOpen = false;
  export let readyEpics: any[] = [];

  const dispatch = createEventDispatcher();

  let exportType = 'excel';
  let selectedEpicId = '';
  let isExporting = false;

  // Réactive : épic sélectionnée
  $: selectedEpic = readyEpics.find(epic => epic.id === selectedEpicId);

  // Initialiser la première épic par défaut quand les épics changent
  $: if (readyEpics.length > 0 && !selectedEpicId) {
    selectedEpicId = readyEpics[0].id;
  }

  function closeModal() {
    isOpen = false;
    dispatch('close');
  }

  function handleExport() {
    if (!selectedEpic) {
      alert('Veuillez sélectionner une épic à exporter');
      return;
    }

    isExporting = true;

    if (exportType === 'excel') {
      exportToExcel();
    } else if (exportType === 'azuredevops') {
      exportToAzureDevOps();
    }

    isExporting = false;
    closeModal();
  }

  function exportToExcel() {
    if (!selectedEpic) return;
    
    const epic = selectedEpic;
    const epicData: any = {
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
    downloadCSV(csvContent, `epic-${epic.title.replace(/[^a-zA-Z0-9]/g, '-')}-export.csv`);
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

  function exportToAzureDevOps() {
    if (!selectedEpic) return;
    
    alert(`Export de l'épic "${selectedEpic.title}" vers Azure DevOps sera implémenté côté WebAPI prochainement`);
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
        </p>

        <!-- Sélection de l'épic -->
        <div class="mb-4">
          <label for="epic-select" class="block text-sm font-medium text-gray-700 mb-2">
            Épic à exporter
          </label>
          <select 
            id="epic-select"
            bind:value={selectedEpicId}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
          >
            {#each readyEpics as epic (epic.id)}
              <option value={epic.id}>{epic.title}</option>
            {/each}
          </select>
          
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
          <label for="export-type" class="block text-sm font-medium text-gray-700 mb-2">
            Type d'export
          </label>
          <select 
            id="export-type"
            bind:value={exportType}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
          >
            <option value="excel">Excel (CSV)</option>
            <option value="azuredevops">Azure DevOps</option>
          </select>
        </div>
      </div>

      <div class="flex gap-3 justify-end">
        <button 
          on:click={closeModal}
          class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          disabled={isExporting}
        >
          Annuler
        </button>
        <button 
          on:click={handleExport}
          disabled={isExporting || !selectedEpic}
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
            Exporter
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

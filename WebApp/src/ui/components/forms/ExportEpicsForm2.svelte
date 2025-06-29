<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let isOpen = false;
  export let readyEpics: any[] = [];

  const dispatch = createEventDispatcher();

  let exportType = 'excel';
  let isExporting = false;

  function closeModal() {
    isOpen = false;
    dispatch('close');
  }

  function handleExport() {
    if (readyEpics.length === 0) {
      alert('Aucune épic ready à exporter');
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
    const excelData = readyEpics.map(epic => {
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

      return epicData;
    });

    const csvContent = convertToCSV(excelData);
    downloadCSV(csvContent, 'epics-ready-export.csv');
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
    alert('Export vers Azure DevOps sera implémenté côté WebAPI prochainement');
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
    role="dialog"
    aria-labelledby="export-modal-title"
    aria-modal="true"
  >
    <div class="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
      <div class="flex items-center justify-between mb-6">
        <h3 id="export-modal-title" class="text-xl font-bold text-gray-900">
          Exporter les Epics Ready
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
          {readyEpics.length} épic{readyEpics.length > 1 ? 's' : ''} ready à exporter
        </p>

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
          disabled={isExporting || readyEpics.length === 0}
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

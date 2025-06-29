<!-- src/ui/components/AddEpicForm.svelte -->
<script lang="ts">
  import { addNewEpic } from '$lib/stores/epicsStore';
  import { projectsStore } from '$lib/stores/projectsStore';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let showForm = false;
  let epicTitle = '';
  let selectedProjectId = '';

  // S'assurer qu'un projet est sélectionné par défaut
  $: if ($projectsStore.length > 0 && !selectedProjectId) {
    selectedProjectId = $projectsStore[0].id;
  }

  function handleSubmit() {
    if (epicTitle.trim() && selectedProjectId) {
      addNewEpic(epicTitle.trim(), selectedProjectId);
      epicTitle = '';
      selectedProjectId = $projectsStore.length > 0 ? $projectsStore[0].id : '';
      showForm = false;
      dispatch('epicAdded');
    }
  }

  function handleCancel() {
    epicTitle = '';
    selectedProjectId = $projectsStore.length > 0 ? $projectsStore[0].id : '';
    showForm = false;
  }
</script>

{#if showForm}
  <!-- Formulaire modal -->
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-xl w-96">
      <h3 class="text-lg font-semibold mb-4">Créer une nouvelle Epic</h3>
      
      <form on:submit|preventDefault={handleSubmit}>
        <div class="mb-4">
          <label for="epicTitle" class="block text-sm font-medium text-gray-700 mb-2">
            Titre de l'Epic
          </label>
          <input
            id="epicTitle"
            type="text"
            bind:value={epicTitle}
            placeholder="Entrez le titre de l'epic..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div class="mb-4">
          <label for="projectSelect" class="block text-sm font-medium text-gray-700 mb-2">
            Projet
          </label>
          <select
            id="projectSelect"
            bind:value={selectedProjectId}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {#each $projectsStore as project (project.id)}
              <option value={project.id}>
                ● {project.name}
              </option>
            {/each}
          </select>
          
          {#if $projectsStore.length === 0}
            <p class="text-sm text-red-600 mt-1">
              Aucun projet disponible. Créez d'abord un projet.
            </p>
          {/if}
        </div>
        
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            on:click={handleCancel}
            class="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Créer Epic
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Bouton pour ouvrir le formulaire -->
<button
  on:click={() => showForm = true}
  class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
>
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
  </svg>
  Nouvelle Epic
</button>

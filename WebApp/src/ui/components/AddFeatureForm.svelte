<script lang="ts">
  import { addFeatureToEpic } from '$lib/stores/epicsStore';

  export let epicId: string;
  
  let isFormVisible = false;
  let featureTitle = '';

  function handleSubmit() {
    if (featureTitle.trim()) {
      addFeatureToEpic(epicId, featureTitle.trim());
      featureTitle = '';
      isFormVisible = false;
    }
  }

  function toggleForm() {
    isFormVisible = !isFormVisible;
    if (!isFormVisible) {
      featureTitle = '';
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      toggleForm();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="mt-4">
  {#if !isFormVisible}
    <button 
      class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
      on:click={toggleForm}
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
      </svg>
      Ajouter une fonctionnalité
    </button>
  {:else}
    <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h3 class="text-lg font-medium mb-3">Nouvelle fonctionnalité</h3>
      <form on:submit|preventDefault={handleSubmit} class="space-y-3">
        <div>
          <label for="feature-title" class="block text-sm font-medium text-gray-700 mb-1">
            Titre de la fonctionnalité
          </label>
          <input
            id="feature-title"
            type="text"
            bind:value={featureTitle}
            placeholder="Ex: Saisie du nom d'utilisateur"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div class="flex gap-2">
          <button
            type="submit"
            class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
            disabled={!featureTitle.trim()}
          >
            Ajouter
          </button>
          <button
            type="button"
            class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            on:click={toggleForm}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  {/if}
</div>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export let featureId: string;
  
  const dispatch = createEventDispatcher();
  
  let isFormVisible = false;
  let scenarioTitle = '';
  let scenarioType: 'green' | 'grey' = 'green';

  function handleSubmit() {
    if (scenarioTitle.trim()) {
      dispatch('addScenario', {
        title: scenarioTitle.trim(),
        type: scenarioType
      });
      scenarioTitle = '';
      isFormVisible = false;
    }
  }

  function toggleForm() {
    isFormVisible = !isFormVisible;
    if (!isFormVisible) {
      scenarioTitle = '';
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      toggleForm();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="mt-2">
  {#if !isFormVisible}
    <button 
      class="bg-green-500 text-white px-4 py-1.5 rounded-md hover:bg-green-600 transition-colors flex items-center gap-2 text-sm"
      on:click={toggleForm}
    >
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
      </svg>
      Ajouter un scénario
    </button>
  {:else}
    <div class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <h4 class="text-sm font-medium mb-2">Nouveau scénario</h4>
      <form on:submit|preventDefault={handleSubmit} class="space-y-2">
        <div>
          <input
            type="text"
            bind:value={scenarioTitle}
            placeholder="Ex: L'utilisateur saisit des données valides"
            class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <fieldset>
            <legend class="block text-xs font-medium text-gray-700 mb-1">Type de scénario</legend>
            <div class="flex gap-2">
              <label class="flex items-center">
                <input
                  type="radio"
                  bind:group={scenarioType}
                  value="green"
                  class="mr-1"
                />
                <span class="text-xs">Scénario (vert)</span>
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  bind:group={scenarioType}
                  value="grey"
                  class="mr-1"
                />
                <span class="text-xs">Question (gris)</span>
              </label>
            </div>
          </fieldset>
        </div>
        <div class="flex gap-2">
          <button
            type="submit"
            class="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 text-xs"
            disabled={!scenarioTitle.trim()}
          >
            Ajouter
          </button>
          <button
            type="button"
            class="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition-colors text-xs"
            on:click={toggleForm}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  {/if}
</div>

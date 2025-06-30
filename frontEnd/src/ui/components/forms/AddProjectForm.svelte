<script lang="ts">
  import { createProject, type CreateProjectRequest } from '$lib/stores/projectsStore';

  let isOpen = false;
  let name = '';
  let description = '';
  let color = '#3B82F6';
  let isCreating = false;

  const predefinedColors = [
    '#3B82F6', // Bleu
    '#EF4444', // Rouge
    '#10B981', // Vert
    '#F59E0B', // Jaune
    '#8B5CF6', // Violet
    '#EC4899', // Rose
    '#14B8A6', // Teal
    '#F97316'  // Orange
  ];

  function openModal() {
    isOpen = true;
  }

  function closeModal() {
    isOpen = false;
    resetForm();
  }

  function resetForm() {
    name = '';
    description = '';
    color = '#3B82F6';
    isCreating = false;
  }

  async function handleSubmit() {
    if (!name.trim()) {
      alert('Veuillez saisir un nom pour le projet');
      return;
    }

    isCreating = true;

    try {
      const request: CreateProjectRequest = {
        name: name.trim(),
        description: description.trim() || undefined,
        color
      };

      await createProject(request);
      closeModal();
    } catch (error) {
      alert(`Erreur lors de la création du projet: ${error.message}`);
    } finally {
      isCreating = false;
    }
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }
</script>

<!-- Bouton pour ouvrir le modal -->
<button 
  on:click={openModal}
  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm"
>
  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
  </svg>
  Nouveau Projet
</button>

<!-- Modal -->
{#if isOpen}
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    on:click={handleBackdropClick}
    on:keydown={(e) => e.key === 'Escape' && closeModal()}
    role="dialog"
    tabindex="-1"
    aria-labelledby="project-modal-title"
    aria-modal="true"
  >
    <div class="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
      <div class="flex items-center justify-between mb-6">
        <h3 id="project-modal-title" class="text-xl font-bold text-gray-900">
          Nouveau Projet
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

      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <!-- Nom du projet -->
        <div>
          <label for="project-name" class="block text-sm font-medium text-gray-700 mb-2">
            Nom du projet *
          </label>
          <input 
            id="project-name"
            type="text"
            bind:value={name}
            placeholder="Nom de votre projet"
            maxlength="100"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        <!-- Description -->
        <div>
          <label for="project-description" class="block text-sm font-medium text-gray-700 mb-2">
            Description (optionnelle)
          </label>
          <textarea 
            id="project-description"
            bind:value={description}
            placeholder="Description de votre projet"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
          ></textarea>
        </div>

        <!-- Couleur -->
        <div>
          <div class="text-sm font-medium text-gray-700 mb-2">
            Couleur du projet
          </div>
          <div class="flex gap-2 flex-wrap">
            {#each predefinedColors as colorOption}
              <button 
                type="button"
                on:click={() => color = colorOption}
                class="w-8 h-8 rounded-full border-2 transition-all duration-200 {color === colorOption ? 'border-gray-800 scale-110' : 'border-gray-300 hover:border-gray-500'}"
                style="background-color: {colorOption}"
                aria-label="Sélectionner cette couleur"
              ></button>
            {/each}
          </div>
          
          <!-- Aperçu -->
          <div class="mt-3 flex items-center gap-2">
            <div 
              class="w-4 h-4 rounded-full"
              style="background-color: {color}"
            ></div>
            <span class="text-sm text-gray-600">Aperçu de la couleur sélectionnée</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 justify-end pt-4">
          <button 
            type="button"
            on:click={closeModal}
            class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            disabled={isCreating}
          >
            Annuler
          </button>
          <button 
            type="submit"
            disabled={isCreating || !name.trim()}
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {#if isCreating}
              <svg class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Création...
            {:else}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Créer le Projet
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

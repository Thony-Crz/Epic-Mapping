<!-- src/ui/components/EditableText.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let text: string;
  export let isEditing: boolean = false;
  export let placeholder: string = 'Entrez le texte...';

  const dispatch = createEventDispatcher();

  let inputValue = text;
  let inputElement: HTMLInputElement;

  $: if (isEditing && inputElement) {
    inputElement.focus();
    inputElement.select();
  }

  function handleSave() {
    if (inputValue.trim() && inputValue.trim() !== text) {
      dispatch('save', inputValue.trim());
    }
    dispatch('cancel');
  }

  function handleCancel() {
    inputValue = text;
    dispatch('cancel');
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSave();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      handleCancel();
    }
  }
</script>

{#if isEditing}
  <div class="flex items-center gap-2">
    <input
      bind:this={inputElement}
      bind:value={inputValue}
      on:keydown={handleKeydown}
      on:blur={handleSave}
      {placeholder}
      class="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
{:else}
  <div class="flex items-center justify-between group">
    <span class="flex-1">{text}</span>
    <button
      on:click={() => dispatch('edit')}
      class="p-1 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
      title="Modifier"
      aria-label="Modifier"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
      </svg>
    </button>
  </div>
{/if}

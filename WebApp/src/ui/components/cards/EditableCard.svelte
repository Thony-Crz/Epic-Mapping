<!-- src/ui/components/EditableCard.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import EditableText from '../common/EditableText.svelte';

  export let title: string;
  export let editable: boolean = false;
  export let placeholder: string = 'Entrez du texte...';
  export let cardClass: string = '';
  export let titleClass: string = '';

  const dispatch = createEventDispatcher();

  let isEditing = false;

  function handleEdit() {
    isEditing = true;
  }

  function handleSave(event: CustomEvent<string>) {
    dispatch('titleUpdate', event.detail);
    isEditing = false;
  }

  function handleCancel() {
    isEditing = false;
  }
</script>

<div class={cardClass}>
  {#if editable}
    <EditableText
      text={title}
      {isEditing}
      {placeholder}
      on:edit={handleEdit}
      on:save={handleSave}
      on:cancel={handleCancel}
    />
  {:else}
    <h4 class={titleClass}>{title}</h4>
  {/if}
  <slot />
</div>

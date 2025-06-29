<script lang="ts">
  import EditableCard from './EditableCard.svelte';

  export let title: string;
  export let editable: boolean = false;
</script>

<EditableCard
  {title}
  {editable}
  placeholder="Nom de la fonctionnalité..."
  cardClass="bg-yellow-400 text-black p-4 rounded-2xl shadow-md w-64 min-w-64"
  titleClass="text-lg font-semibold mb-2"
  on:titleUpdate
>
  <div class="flex flex-col gap-2">
    <slot />
  </div>
</EditableCard>
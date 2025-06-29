<script lang="ts">
  import EditableCard from './EditableCard.svelte';

  export let title: string;
  export let editable: boolean = false;
  export let status: string = '';

  // Générer les classes d'ombre selon le statut
  $: shadowClasses = status === 'ready' ? 'shadow-green-300/50 hover:shadow-green-400/60' : 
                     status === 'in-progress' ? 'shadow-orange-300/50 hover:shadow-orange-400/60' : 
                     status === 'todo' ? 'shadow-blue-300/50 hover:shadow-blue-400/60' :
                     'shadow-gray-300/50 hover:shadow-gray-400/60';
</script>

<EditableCard
  {title}
  {editable}
  placeholder="Nom de la fonctionnalité..."
  cardClass="bg-yellow-400 text-black p-4 rounded-2xl shadow-lg w-64 min-w-64 relative transition-shadow duration-300 hover:shadow-xl {shadowClasses}"
  titleClass="text-lg font-semibold mb-2"
  on:titleUpdate
>
  <div class="flex flex-col gap-2">
    <slot />
  </div>
</EditableCard>
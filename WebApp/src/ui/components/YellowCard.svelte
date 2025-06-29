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

  // Couleur de la bande selon le statut
  $: bandColor = status === 'ready' ? 'bg-green-500' : 
                 status === 'in-progress' ? 'bg-orange-500' : 
                 status === 'todo' ? 'bg-blue-500' :
                 'bg-gray-500';

  // Texte accessible pour le statut
  $: statusText = status === 'ready' ? 'Prêt' : 
                  status === 'in-progress' ? 'En cours' : 
                  status === 'todo' ? 'À faire' : 
                  status || 'Statut non défini';
</script>

<div class="relative">
  <!-- Bande de statut focusable -->
  <button 
    class="{bandColor} h-2 rounded-t-2xl w-full cursor-help focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 border-0"
    aria-label="Statut de la fonctionnalité: {statusText}"
    title="Statut: {statusText}"
    on:click={() => {/* Pas d'action, juste pour l'accessibilité */}}
  ></button>

  <EditableCard
    {title}
    {editable}
    placeholder="Nom de la fonctionnalité..."
    cardClass="bg-yellow-400 text-black p-4 rounded-t-none rounded-b-2xl shadow-lg w-64 min-w-64 relative transition-shadow duration-300 hover:shadow-xl {shadowClasses}"
    titleClass="text-lg font-semibold mb-2"
    on:titleUpdate
  >
    <div class="flex flex-col gap-2">
      <slot />
    </div>
  </EditableCard>
</div>
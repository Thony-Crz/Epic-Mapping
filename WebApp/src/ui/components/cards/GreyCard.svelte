<script lang="ts">
  import EditableCard from './EditableCard.svelte';

  export let title: string;
  export let editable: boolean = false;
</script>

<EditableCard
  {title}
  {editable}
  placeholder="Question ou scénario..."
  cardClass="bg-gray-300 text-black p-3 rounded-xl shadow-inner hover:shadow-md transition"
  titleClass="text-base font-medium italic"
  on:titleUpdate
>
  <slot />
</EditableCard>

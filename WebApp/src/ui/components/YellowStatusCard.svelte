<script lang="ts">
  export let title: string;
  export let status: string = '';
</script>

<div class="bg-yellow-400 text-black p-3 rounded-xl shadow-sm hover:shadow-md transition relative">
  <div class="flex items-center justify-between mb-1">
    <h4 class="text-base font-medium">{title}</h4>
    {#if status}
      <span class="text-xs px-2 py-1 rounded-full 
        {status === 'ready' ? 'bg-green-500 text-white' : 
         status === 'in-progress' ? 'bg-orange-500 text-white' : 
         'bg-gray-500 text-white'}">
        {status}
      </span>
    {/if}
  </div>
  <slot />
</div>

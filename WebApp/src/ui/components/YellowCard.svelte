<script lang="ts">
  export let title: string;
</script>

<div class="bg-yellow-400 text-black p-4 rounded-2xl shadow-md w-64 min-w-64">
  <h3 class="text-lg font-semibold mb-2">{title}</h3>
  <div class="flex flex-col gap-2">
    <slot />
  </div>
</div>
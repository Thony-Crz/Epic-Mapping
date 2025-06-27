<script lang="ts">
  export let title: string;
</script>

<div class="bg-blue-500 text-white p-4 rounded-2xl shadow-md">
  <h2 class="text-xl font-semibold mb-2">{title}</h2>
  <div class="flex gap-4 overflow-x-auto">
    <slot />
  </div>
</div>
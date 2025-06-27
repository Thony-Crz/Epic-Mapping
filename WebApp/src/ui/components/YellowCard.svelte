<script lang="ts">
  export let title: string;
</script>

<div class="bg-yellow-400 text-black p-4 rounded-2xl shadow-md hover:shadow-lg transition">
  <h3 class="text-lg font-semibold">{title}</h3>
  <slot />
</div>
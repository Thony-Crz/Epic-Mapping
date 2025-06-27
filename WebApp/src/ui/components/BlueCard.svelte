<script lang="ts">
  export let title: string;
</script>

<div class="bg-blue-500 text-white p-4 rounded-2xl shadow-md hover:shadow-lg transition">
  <h2 class="text-xl font-semibold">{title}</h2>
  <slot />
</div>
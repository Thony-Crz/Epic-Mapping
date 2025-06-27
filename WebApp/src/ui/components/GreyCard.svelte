<script lang="ts">
  export let title: string;
</script>

<div class="bg-gray-300 text-black p-3 rounded-xl shadow-inner hover:shadow-md transition">
  <h4 class="text-base font-medium italic">{title}</h4>
  <slot />
</div>

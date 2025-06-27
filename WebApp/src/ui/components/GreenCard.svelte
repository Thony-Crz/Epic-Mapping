<script lang="ts">
  export let title: string;
</script>

<div class="bg-green-300 text-black p-3 rounded-xl shadow-sm hover:shadow-md transition">
  <h4 class="text-base font-medium">{title}</h4>
  <slot />
</div>
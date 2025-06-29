<script lang="ts">
  export let title: string;
</script>

<div class="bg-blue-100 text-blue-900 w-60 p-4 rounded-lg shadow-lg rotate-[1deg] hover:rotate-0 transition-transform">
  <h2 class="text-lg font-semibold">{title}</h2>
  <div class="mt-2">
    <slot />
  </div>
</div>
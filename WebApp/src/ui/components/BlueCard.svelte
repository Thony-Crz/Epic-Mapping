<script lang="ts">
  export let title: string;
</script>

<div class="text-blue-900 ">
  <h2 class="text-lg font-semibold">{title}</h2>
  <div class="mt-2">
    <slot />
  </div>
</div>
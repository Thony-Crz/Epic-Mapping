<script lang="ts">
  import { authStore } from '$lib/stores/authStore';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let isReady = false;

  onMount(async () => {
    // Initialiser l'authentification
    authStore.init();
    
    // Attendre un court délai pour que l'état soit bien initialisé
    await new Promise(resolve => setTimeout(resolve, 100));
    
    isReady = true;
  });

  // Réactif: rediriger si pas connecté et pas sur la page de login
  $: if (isReady && !$authStore.isAuthenticated && $page.route.id !== '/login') {
    goto('/login');
  }

  // Réactif: rediriger vers l'accueil si connecté et sur la page de login
  $: if (isReady && $authStore.isAuthenticated && $page.route.id === '/login') {
    goto('/');
  }
</script>

{#if isReady}
  <slot />
{:else}
  <!-- Écran de chargement -->
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Chargement...</p>
    </div>
  </div>
{/if}

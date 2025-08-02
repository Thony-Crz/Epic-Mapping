<script lang="ts">
  import { authStore } from '$lib/stores/authStore';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let isReady = false;
  let shouldShowContent = false;

  onMount(async () => {
    // Initialiser l'authentification de manière synchrone
    authStore.init();
    
    // Vérifier immédiatement l'état d'authentification
    const currentAuth = $authStore;
    const currentRoute = $page.route.id;
    
    if (!currentAuth.isAuthenticated && currentRoute !== '/login') {
      // Pas connecté et pas sur la page de login -> rediriger immédiatement
      goto('/login', { replaceState: true });
    } else if (currentAuth.isAuthenticated && currentRoute === '/login') {
      // Connecté mais sur la page de login -> rediriger vers l'accueil
      goto('/', { replaceState: true });
    } else {
      // État correct -> afficher le contenu
      shouldShowContent = true;
    }
    
    isReady = true;
  });

  // Réactions pour les changements d'état après l'initialisation
  $: if (isReady) {
    const currentAuth = $authStore;
    const currentRoute = $page.route.id;
    
    if (!currentAuth.isAuthenticated && currentRoute !== '/login' && shouldShowContent) {
      goto('/login', { replaceState: true });
      shouldShowContent = false;
    } else if (currentAuth.isAuthenticated && currentRoute === '/login' && shouldShowContent) {
      goto('/', { replaceState: true });
      shouldShowContent = false;
    } else if ((currentAuth.isAuthenticated && currentRoute !== '/login') || 
               (!currentAuth.isAuthenticated && currentRoute === '/login')) {
      shouldShowContent = true;
    }
  }
</script>

{#if isReady && shouldShowContent}
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

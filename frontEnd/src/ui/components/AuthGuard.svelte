<script lang="ts">
	import { authStore } from '$lib/stores/authStore';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let isReady = false;
	let shouldShowContent = false;

	onMount(async () => {
		console.log('🔐 AuthGuard: Starting initialization');
		console.log('🔐 Current page route:', $page.route.id);
		console.log('🔐 Current page URL:', $page.url.pathname);
		
		try {
			// Initialiser l'authentification de manière synchrone
			authStore.init();
			
			// Attendre une micro-tâche pour que le store se mette à jour
			await new Promise(resolve => setTimeout(resolve, 0));

			// Vérifier l'état d'authentification
			const currentAuth = $authStore;
			const currentRoute = $page.route.id;
			
			console.log('🔐 Auth state after init:', currentAuth);
			console.log('🔐 Is authenticated:', currentAuth.isAuthenticated);
			console.log('🔐 Current route:', currentRoute);

			if (!currentAuth.isAuthenticated && currentRoute !== '/login') {
				console.log('🔐 Not authenticated, redirecting to login');
				// Pas connecté et pas sur la page de login -> rediriger
				await goto('/login', { replaceState: true });
			} else if (currentAuth.isAuthenticated && currentRoute === '/login') {
				console.log('🔐 Authenticated but on login page, redirecting to home');
				// Connecté mais sur la page de login -> rediriger vers l'accueil
				await goto('/', { replaceState: true });
			} else {
				console.log('🔐 Auth state is correct, showing content');
				// État correct -> afficher le contenu
				shouldShowContent = true;
			}
		} catch (error) {
			console.error('🔐 AuthGuard error:', error);
			// En cas d'erreur, afficher quand même le contenu pour éviter un blocage
			shouldShowContent = true;
		}

		isReady = true;
		console.log('🔐 AuthGuard initialization complete, isReady:', true, 'shouldShowContent:', shouldShowContent);
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
		} else if (
			(currentAuth.isAuthenticated && currentRoute !== '/login') ||
			(!currentAuth.isAuthenticated && currentRoute === '/login')
		) {
			shouldShowContent = true;
		}
	}
</script>

{#if isReady && shouldShowContent}
	<slot />
{:else}
	<!-- Écran de chargement -->
	<div
		class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
	>
		<div class="text-center">
			<div
				class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"
			></div>
			<p class="text-gray-600">Chargement...</p>
		</div>
	</div>
{/if}

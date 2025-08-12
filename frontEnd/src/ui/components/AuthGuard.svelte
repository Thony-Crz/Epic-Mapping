<script lang="ts">
	import { authStore } from '$lib/stores/authStore';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { base } from '$app/paths';

	let isReady = false;
	let shouldShowContent = false;

	onMount(async () => {
		try {
			// Initialiser l'authentification de manière synchrone
			authStore.init();
			
			// Attendre une micro-tâche pour que le store se mette à jour
			await new Promise(resolve => setTimeout(resolve, 0));

			// Vérifier l'état d'authentification
			const currentAuth = $authStore;
			const currentRoute = $page.route.id;

			if (!currentAuth.isAuthenticated && currentRoute !== '/login') {
				// Utiliser le base path pour les redirections
				const loginUrl = `${base}/login`;
				await goto(loginUrl, { replaceState: true });
			} else if (currentAuth.isAuthenticated && currentRoute === '/login') {
				// Utiliser le base path pour les redirections
				const homeUrl = base || '/';
				await goto(homeUrl, { replaceState: true });
			} else {
				// État correct -> afficher le contenu
				shouldShowContent = true;
			}
		} catch (error) {
			console.error('🔐 AuthGuard error:', error);
			// En cas d'erreur, afficher quand même le contenu pour éviter un blocage
			shouldShowContent = true;
		}

		isReady = true;
	});

	// Réactions pour les changements d'état après l'initialisation
	$: if (isReady) {
		const currentAuth = $authStore;
		const currentRoute = $page.route.id;

		if (!currentAuth.isAuthenticated && currentRoute !== '/login' && shouldShowContent) {
			const loginUrl = `${base}/login`;
			goto(loginUrl, { replaceState: true });
			shouldShowContent = false;
		} else if (currentAuth.isAuthenticated && currentRoute === '/login' && shouldShowContent) {
			const homeUrl = base || '/';
			goto(homeUrl, { replaceState: true });
			goto(homeUrl, { replaceState: true });
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

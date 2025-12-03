<script lang="ts">
	import { authStore } from '$lib/stores/authStore';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { base } from '$app/paths';

	let isReady = false;
	let shouldShowContent = false;

	// Routes that don't require authentication
	const publicRoutes = ['/login', '/auth/callback'];
	// Routes for users pending approval
	const pendingRoutes = ['/pending-approval'];

	function isPublicRoute(routeId: string | null): boolean {
		if (!routeId) return false;
		return publicRoutes.some(r => routeId === r || routeId.startsWith(r + '/'));
	}

	function isPendingRoute(routeId: string | null): boolean {
		if (!routeId) return false;
		return pendingRoutes.some(r => routeId === r || routeId.startsWith(r + '/'));
	}

	onMount(async () => {
		try {
			// Initialiser l'authentification de manière synchrone
			authStore.init();
			
			// Attendre une micro-tâche pour que le store se mette à jour
			await new Promise(resolve => setTimeout(resolve, 0));

			// Vérifier l'état d'authentification
			const currentAuth = $authStore;
			const currentRoute = $page.route.id;

			if (!currentAuth.isAuthenticated && !isPublicRoute(currentRoute)) {
				// Not authenticated and not on public route -> redirect to login
				const loginUrl = `${base}/login`;
				await goto(loginUrl, { replaceState: true });
			} else if (currentAuth.isAuthenticated && isPublicRoute(currentRoute)) {
				// Authenticated and on public route -> redirect appropriately
				if (currentAuth.user?.isApproved) {
					const homeUrl = base || '/';
					await goto(homeUrl, { replaceState: true });
				} else {
					await goto(`${base}/pending-approval`, { replaceState: true });
				}
			} else if (currentAuth.isAuthenticated && !currentAuth.user?.isApproved && !isPendingRoute(currentRoute) && !isPublicRoute(currentRoute)) {
				// Authenticated but not approved -> redirect to pending
				await goto(`${base}/pending-approval`, { replaceState: true });
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

		if (!currentAuth.isAuthenticated && !isPublicRoute(currentRoute) && shouldShowContent) {
			const loginUrl = `${base}/login`;
			goto(loginUrl, { replaceState: true });
			shouldShowContent = false;
		} else if (currentAuth.isAuthenticated && isPublicRoute(currentRoute) && shouldShowContent) {
			if (currentAuth.user?.isApproved) {
				const homeUrl = base || '/';
				goto(homeUrl, { replaceState: true });
			} else {
				goto(`${base}/pending-approval`, { replaceState: true });
			}
			shouldShowContent = false;
		} else if (currentAuth.isAuthenticated && !currentAuth.user?.isApproved && !isPendingRoute(currentRoute) && !isPublicRoute(currentRoute) && shouldShowContent) {
			goto(`${base}/pending-approval`, { replaceState: true });
			shouldShowContent = false;
		} else if (
			(currentAuth.isAuthenticated && currentAuth.user?.isApproved && !isPublicRoute(currentRoute)) ||
			(currentAuth.isAuthenticated && isPendingRoute(currentRoute)) ||
			(!currentAuth.isAuthenticated && isPublicRoute(currentRoute))
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

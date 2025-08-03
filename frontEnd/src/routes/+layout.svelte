<script lang="ts">
	import '../app.css';
	import AuthGuard from '$ui/components/AuthGuard.svelte';
	import Logo from '$ui/components/Logo.svelte';
	import { authStore } from '$lib/stores/authStore';
	import { page } from '$app/stores';

	function handleLogout() {
		authStore.logout();
	}
</script>

<!-- Header -->
<header class="z-10 border-b border-gray-200 bg-white shadow-sm">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo/Titre -->
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<Logo size="md" />
				</div>
			</div>

			<!-- Navigation et actions -->
			<div class="flex items-center space-x-4">
				{#if $authStore.isAuthenticated && $page.route.id !== '/login'}
					<!-- Utilisateur connecté -->
					<div class="flex items-center space-x-3">
						<span class="text-gray-700">Bonjour, {$authStore.user?.name}</span>
						<button
							on:click={handleLogout}
							class="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-red-700"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
								></path>
							</svg>
							Se déconnecter
						</button>
					</div>
				{:else if $page.route.id !== '/login'}
					<!-- Bouton d'authentification -->
					<button
						class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							></path>
						</svg>
						Se connecter
					</button>
				{/if}
			</div>
		</div>
	</div>
</header>

<!-- Contenu principal avec effet tableau blanc -->
<main class="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
	<!-- Effet de texture papier/tableau blanc -->
	<div class="absolute inset-0 opacity-30">
		<div
			class="absolute inset-0"
			style="background-image: radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0); background-size: 20px 20px;"
		></div>
	</div>

	<!-- Contenu avec AuthGuard -->
	<div class="relative z-10">
		<AuthGuard>
			{#if $page.route.id === '/login'}
				<slot />
			{:else}
				<div class="container mx-auto px-4 py-8">
					<slot />
				</div>
			{/if}
		</AuthGuard>
	</div>

	<!-- Effets décoratifs pour simuler un tableau -->
	<div
		class="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 opacity-50"
	></div>
	<div
		class="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 opacity-30"
	></div>
</main>

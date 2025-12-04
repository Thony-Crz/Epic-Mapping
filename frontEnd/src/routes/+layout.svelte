<script lang="ts">
	import '../app.css';
	import AuthGuard from '$ui/components/AuthGuard.svelte';
	import Logo from '$ui/components/Logo.svelte';
	import Breadcrumb from '$ui/components/Breadcrumb.svelte';
	import { authStore } from '$lib/stores/authStore';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	function handleLogout() {
		authStore.logout();
	}

	function handleLoginClick() {
		const loginUrl = `${base}/login`;
		goto(loginUrl);
	}

	// Public routes that don't require auth guard
	$: isPublicRoute = $page.route.id === '/login' || 
		$page.route.id === '/auth/callback' || 
		$page.route.id === '/pending-approval';
</script>

<!-- Header -->
<header class="z-10 border-b border-gray-200 bg-white shadow-sm">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo/Titre cliquable -->
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<a href="{base}/" class="hover:opacity-80 transition-opacity">
						<Logo size="md" />
					</a>
				</div>
			</div>

			<!-- Navigation principale -->
			{#if $authStore.isAuthenticated && $authStore.user?.isApproved && !isPublicRoute}
				<nav class="flex items-center space-x-6">
					<a 
						href="{base}/" 
						class="text-gray-600 hover:text-blue-600 font-medium transition-colors"
						class:text-blue-600={$page.route.id === '/'}
						class:text-gray-900={$page.route.id === '/'}
					>
						<svg class="inline-block w-4 h-4 mr-1 mb-1" fill="currentColor" viewBox="0 0 20 20">
							<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
						</svg>
						Accueil
					</a>
					<a 
						href="{base}/feature-flags" 
						class="text-gray-600 hover:text-blue-600 font-medium transition-colors"
						class:text-blue-600={$page.route.id === '/feature-flags'}
						class:text-gray-900={$page.route.id === '/feature-flags'}
					>
						<svg class="inline-block w-4 h-4 mr-1 mb-1" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13H14a1 1 0 01-1-1z" clip-rule="evenodd"/>
						</svg>
						Feature Flags
					</a>
					{#if $authStore.user?.isAdmin}
						<a 
							href="{base}/admin/users" 
							class="text-gray-600 hover:text-blue-600 font-medium transition-colors"
							class:text-blue-600={$page.route.id?.startsWith('/admin')}
							class:text-gray-900={$page.route.id?.startsWith('/admin')}
						>
							<svg class="inline-block w-4 h-4 mr-1 mb-1" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
							</svg>
							Utilisateurs
						</a>
					{/if}
				</nav>
			{/if}

			<!-- Actions utilisateur -->
			<div class="flex items-center space-x-4">
				{#if $authStore.isAuthenticated && !isPublicRoute}
					<!-- Utilisateur connecté -->
					<div class="flex items-center space-x-3">
						{#if $authStore.user?.avatarUrl}
							<img 
								src={$authStore.user.avatarUrl} 
								alt={$authStore.user.name}
								class="h-8 w-8 rounded-full"
							/>
						{/if}
						<span class="text-gray-700">
							{$authStore.user?.name}
							{#if $authStore.user?.isAdmin}
								<span class="ml-1 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Admin</span>
							{/if}
						</span>
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
				{:else if !isPublicRoute}
					<!-- Bouton d'authentification -->
					<button
						on:click={handleLoginClick}
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
			{#if isPublicRoute}
				<slot />
			{:else}
				<div class="container mx-auto px-4 py-8">
					<!-- Breadcrumb pour la navigation -->
					{#if $authStore.isAuthenticated && $authStore.user?.isApproved}
						<Breadcrumb />
					{/if}
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

<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';

	let error = '';
	let processing = true;

	onMount(async () => {
		const code = $page.url.searchParams.get('code');
		const state = $page.url.searchParams.get('state');
		const errorParam = $page.url.searchParams.get('error');

		if (errorParam) {
			error = `Erreur GitHub: ${errorParam}`;
			processing = false;
			return;
		}

		if (!code || !state) {
			error = 'Paramètres de callback manquants';
			processing = false;
			return;
		}

		try {
			await authStore.handleGitHubCallback(code, state);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Erreur d\'authentification';
			processing = false;
		}
	});

	function goToLogin() {
		goto(`${base}/login`);
	}
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
>
	<div class="w-full max-w-md space-y-8 p-8">
		<div class="space-y-6 rounded-xl bg-white p-8 shadow-lg text-center">
			{#if processing}
				<div class="space-y-4">
					<div class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
					<h2 class="text-xl font-semibold text-gray-800">Authentification en cours...</h2>
					<p class="text-gray-600">Veuillez patienter pendant que nous vérifions vos identifiants.</p>
				</div>
			{:else if error}
				<div class="space-y-4">
					<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
						<svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</div>
					<h2 class="text-xl font-semibold text-gray-800">Erreur d'authentification</h2>
					<p class="text-red-600">{error}</p>
					<button
						on:click={goToLogin}
						class="mt-4 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
					>
						Retourner à la connexion
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>

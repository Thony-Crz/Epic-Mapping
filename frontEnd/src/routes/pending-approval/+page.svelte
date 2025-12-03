<script lang="ts">
	import { authStore } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import Logo from '$ui/components/Logo.svelte';

	let checking = false;

	onMount(() => {
		authStore.init();
		
		// If user is approved, redirect to home
		const unsubscribe = authStore.subscribe((state) => {
			if (state.user?.isApproved) {
				goto(base || '/');
			}
		});

		return unsubscribe;
	});

	async function checkStatus() {
		checking = true;
		try {
			const user = await authStore.refreshUser();
			if (user?.isApproved) {
				goto(base || '/');
			}
		} finally {
			checking = false;
		}
	}

	function handleLogout() {
		authStore.logout();
	}
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
>
	<div class="w-full max-w-md space-y-8 p-8">
		<div class="space-y-4 text-center">
			<div class="flex justify-center">
				<Logo size="lg" />
			</div>
		</div>

		<div class="space-y-6 rounded-xl bg-white p-8 shadow-lg text-center">
			{#if $authStore.user?.approvalStatus === 'Rejected'}
				<!-- Rejected -->
				<div class="space-y-4">
					<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
						<svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</div>
					<h2 class="text-xl font-semibold text-gray-800">Accès refusé</h2>
					<p class="text-gray-600">
						Votre demande d'accès a été refusée par un administrateur.
					</p>
					<p class="text-sm text-gray-500">
						Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administrateur.
					</p>
				</div>
			{:else}
				<!-- Pending -->
				<div class="space-y-4">
					<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
						<svg class="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
					<h2 class="text-xl font-semibold text-gray-800">En attente d'approbation</h2>
					<p class="text-gray-600">
						Bienvenue, <strong>{$authStore.user?.name}</strong> !
					</p>
					<p class="text-gray-600">
						Votre compte est en attente d'approbation par un administrateur.
						Vous recevrez un accès dès qu'un administrateur aura validé votre demande.
					</p>
					
					<button
						on:click={checkStatus}
						disabled={checking}
						class="mt-4 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
					>
						{#if checking}
							<span class="flex items-center justify-center gap-2">
								<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Vérification...
							</span>
						{:else}
							Vérifier mon statut
						{/if}
					</button>
				</div>
			{/if}

			<div class="pt-4 border-t border-gray-200">
				<button
					on:click={handleLogout}
					class="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
				>
					Se déconnecter
				</button>
			</div>
		</div>
	</div>
</div>

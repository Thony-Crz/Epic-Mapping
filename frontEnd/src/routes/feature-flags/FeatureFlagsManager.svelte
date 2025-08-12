<script lang="ts">
	import { onMount } from 'svelte';
	import { featureFlagsStore, toggleFeatureFlag, resetFeatureFlagsToDefaults, initializeFeatureFlags } from '../../services/feature-flags/featureFlagsStore.js';
	import type { FeatureFlag } from '../../services/feature-flags/FeatureFlag.js';

	export let initialFlags: FeatureFlag[] = [];

	// Variable réactive liée au store
	$: flags = $featureFlagsStore;

	onMount(() => {
		// Initialiser les feature flags au montage du composant
		if (initialFlags.length > 0) {
			// Si des flags initiaux sont fournis (pour les tests), les utiliser
			featureFlagsStore.set(initialFlags);
		} else {
			// Sinon, charger depuis la configuration
			initializeFeatureFlags();
		}
	});

	function handleToggleFlag(flagName: string) {
		toggleFeatureFlag(flagName);
	}

	function handleResetToDefaults() {
		resetFeatureFlagsToDefaults();
	}
</script>

<div class="feature-flags-manager">
	<div class="header">
		<h1 class="text-3xl font-bold text-gray-800 mb-2">Gestion des fonctionnalités</h1>
		<p class="text-gray-600 mb-6">Activez ou désactivez les fonctionnalités de l'application. Les modifications sont sauvegardées localement.</p>
		
		<button 
			on:click={handleResetToDefaults}
			class="mb-6 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
		>
			Réinitialiser aux valeurs par défaut
		</button>
	</div>

	{#if flags.length === 0}
		<div class="empty-state bg-gray-50 p-8 rounded-lg text-center">
			<p class="text-gray-500 text-lg">Aucun feature flag disponible</p>
		</div>
	{:else}
		<div class="flags-grid grid gap-6">
			{#each flags as flag}
				<div class="flag-card bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
					<div class="flag-header mb-4">
						<h3 class="text-xl font-semibold text-gray-800">{flag.name}</h3>
						<p class="text-gray-600 mt-2">{flag.description}</p>
					</div>
					
					<div class="flag-controls flex justify-between items-center">
						<span class="status-badge px-3 py-1 rounded-full text-sm font-medium {flag.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
							{flag.enabled ? '✅ Activé' : '❌ Désactivé'}
						</span>
						
						<button 
							on:click={() => handleToggleFlag(flag.name)}
							class="toggle-btn px-4 py-2 rounded-lg font-medium transition-colors {flag.enabled ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}"
						>
							{flag.enabled ? 'Désactiver' : 'Activer'}
						</button>
					</div>

					{#if flag.name === 'epic-export'}
						<div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
							<p class="text-sm text-blue-700">
								<strong>Impact :</strong> {flag.enabled ? 'Le bouton d\'export d\'épics est visible sur la page principale.' : 'Le bouton d\'export d\'épics est masqué sur la page principale.'}
							</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.feature-flags-manager {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}
	
	.flags-grid {
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
	}
	
	@media (max-width: 640px) {
		.flags-grid {
			grid-template-columns: 1fr;
		}
		
		.feature-flags-manager {
			padding: 1rem;
		}
	}
</style>

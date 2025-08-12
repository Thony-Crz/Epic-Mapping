<script lang="ts">
	import FeatureFlagsManager from './FeatureFlagsManager.svelte';
	import { FeatureFlagService } from '../../services/feature-flags/FeatureFlagService.js';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	
	// Créer une instance du service et charger la configuration
	const featureFlagService = new FeatureFlagService();
	featureFlagService.loadFromConfig();
	
	// Récupérer les flags depuis la configuration
	const configFlags = featureFlagService.getAllFlags();

	function goToHome() {
		goto(`${base}/`);
	}
</script>

<svelte:head>
	<title>Feature Flags - Epic Mapping</title>
</svelte:head>

<div class="space-y-6">
	<!-- Actions rapides -->
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900">Configuration des Feature Flags</h1>
		<div class="flex space-x-3">
			<button 
				on:click={goToHome}
				class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
			>
				<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
					<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
				</svg>
				Retour à l'accueil
			</button>
		</div>
	</div>

	<!-- Instructions -->
	<div class="bg-blue-50 border-l-4 border-blue-400 p-4">
		<div class="flex">
			<div class="flex-shrink-0">
				<svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
				</svg>
			</div>
			<div class="ml-3">
				<p class="text-sm text-blue-700">
					<strong>Info :</strong> Les changements sont automatiquement sauvegardés localement. 
					Activez la fonctionnalité d'export et retournez à l'<a href="{base}/" class="underline font-medium">accueil</a> 
					pour voir les nouvelles fonctionnalités disponibles sur les épics.
				</p>
			</div>
		</div>
	</div>

	<!-- Gestionnaire de feature flags -->
	<FeatureFlagsManager initialFlags={configFlags} />
</div>

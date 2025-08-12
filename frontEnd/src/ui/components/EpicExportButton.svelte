<script lang="ts">
	import type { FeatureFlagService } from '../../services/feature-flags/FeatureFlagService.js';

	export let epicId: string;
	export let featureFlagService: FeatureFlagService;
	export let onExport: ((epicId: string) => void) | undefined = undefined;

	// Charger la configuration des feature flags
	featureFlagService.loadFromConfig();
	
	$: isExportEnabled = featureFlagService.isEnabled('epic-export');

	function handleExport() {
		if (onExport) {
			onExport(epicId);
		} else {
			// Implémentation par défaut de l'export
			alert(`Export de l'epic ${epicId} en cours...`);
		}
	}
</script>

{#if isExportEnabled}
	<button 
		on:click={handleExport}
		class="export-button"
	>
		Exporter l'Epic
	</button>
{/if}

<style>
	.export-button {
		padding: 0.5rem 1rem;
		background-color: #28a745;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.875rem;
	}
	
	.export-button:hover {
		background-color: #218838;
	}
	
	.export-button:active {
		background-color: #1e7e34;
	}
</style>

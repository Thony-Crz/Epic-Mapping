<script lang="ts">
	import FeatureFlagsManager from './FeatureFlagsManager.svelte';
	import { FeatureFlagService } from '../../services/feature-flags/FeatureFlagService.js';
	
	// Créer une instance du service et charger la configuration
	const featureFlagService = new FeatureFlagService();
	featureFlagService.loadFromConfig();
	
	// Récupérer les flags depuis la configuration
	const configFlags = featureFlagService.getAllFlags();
</script>

<svelte:head>
	<title>Feature Flags - Epic Mapping</title>
</svelte:head>

<FeatureFlagsManager initialFlags={configFlags} />

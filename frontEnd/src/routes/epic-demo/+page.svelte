<script lang="ts">
	import EpicExportButton from '../../ui/components/EpicExportButton.svelte';
	import { FeatureFlagService } from '../../services/feature-flags/FeatureFlagService.js';
	
	const featureFlagService = new FeatureFlagService();
	
	function handleCustomExport(epicId: string) {
		alert(`Export personnalisé de l'epic ${epicId} déclenché !`);
	}
</script>

<svelte:head>
	<title>Epic Demo - Export Feature</title>
</svelte:head>

<div class="container">
	<h1>Epic Demo - Fonctionnalité d'Export</h1>
	
	<div class="epic-card">
		<h2>Epic: Migration vers SvelteKit</h2>
		<p>Description: Migration complète de l'application vers SvelteKit 2.0</p>
		<p><strong>ID:</strong> epic-001</p>
		
		<div class="actions">
			<EpicExportButton 
				epicId="epic-001" 
				{featureFlagService}
				onExport={handleCustomExport}
			/>
		</div>
	</div>
	
	<div class="info">
		<h3>Instructions:</h3>
		<ol>
			<li>Par défaut, le bouton d'export n'est pas visible (feature flag désactivé)</li>
			<li>Allez sur <a href="/feature-flags">/feature-flags</a> pour activer la fonctionnalité</li>
			<li>Revenez ici pour voir le bouton d'export apparaître</li>
			<li>Cliquez sur le bouton pour tester l'export</li>
		</ol>
	</div>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 1rem;
	}
	
	.epic-card {
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 1.5rem;
		margin: 1rem 0;
		background-color: #f9f9f9;
	}
	
	.epic-card h2 {
		margin-top: 0;
		color: #333;
	}
	
	.epic-card p {
		margin: 0.5rem 0;
		color: #666;
	}
	
	.actions {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid #eee;
	}
	
	.info {
		background-color: #e3f2fd;
		padding: 1rem;
		border-radius: 4px;
		margin-top: 2rem;
	}
	
	.info h3 {
		margin-top: 0;
		color: #1976d2;
	}
	
	.info ol {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
	}
	
	.info li {
		margin: 0.5rem 0;
	}
	
	.info a {
		color: #1976d2;
		text-decoration: none;
	}
	
	.info a:hover {
		text-decoration: underline;
	}
</style>

<script lang="ts">
	import { page } from '$app/stores';
	import {
		epicsDisplayStore,
		updateFeature,
		updateScenario,
		updateEpicTitle,
		updateFeatureStatus,
		addScenarioToFeatureById,
		reorderFeatures,
		reorderScenarios,
		deleteFeature,
		deleteScenario
	} from '$lib/stores/epicsStore';
	import { dndzone } from 'svelte-dnd-action';
	import type { Feature } from '$domain/entities/Feature';
	import type { Scenario } from '$domain/entities/Scenario';
	import BlueCard from '$ui/components/cards/BlueCard.svelte';
	import YellowCard from '$ui/components/cards/YellowCard.svelte';
	import GreenCard from '$ui/components/cards/GreenCard.svelte';
	import GreyCard from '$ui/components/cards/GreyCard.svelte';
	import AddFeatureForm from '$ui/components/forms/AddFeatureForm.svelte';
	import AddFeatureContentForm from '$ui/components/forms/AddFeatureContentForm.svelte';

	$: id = $page.params.id;
	$: epic = $epicsDisplayStore.find((e) => e.id === id);

	// Variables pour le drag and drop
	let featuresWithId: Feature[] = [];
	let scenariosForDnd: { [key: string]: Scenario[] } = {};

	$: if (epic) {
		// Préparer les features avec des IDs uniques pour le DnD
		featuresWithId = epic.features.map((feature) => ({
			...feature,
			id: feature.id // svelte-dnd-action a besoin d'une propriété 'id'
		}));

		// Préparer les scenarios pour chaque feature
		scenariosForDnd = {};
		epic.features.forEach((feature) => {
			scenariosForDnd[feature.id] = prepareScenariosForDnd(feature.scenarios);
		});
	}

	// Effet réactif pour gérer les transitions automatiques de statut
	// TODO: Implémenter la logique de transition automatique si nécessaire

	function handleEpicTitleUpdate(newTitle: string) {
		updateEpicTitle(id, newTitle);
	}

	function handleFeatureUpdate(featureId: string, newTitle: string) {
		updateFeature(id, featureId, newTitle);
	}

	function handleFeatureStatusUpdate(
		featureId: string,
		newStatus: 'ready' | 'in-progress' | 'todo'
	) {
		updateFeatureStatus(id, featureId, newStatus);
	}

	function handleScenarioUpdate(featureId: string, scenarioIndex: number, newTitle: string) {
		updateScenario(id, featureId, scenarioIndex, newTitle);
	}

	function handleAddScenario(
		featureId: string,
		event: CustomEvent<{ title: string; type: 'green' | 'grey' }>
	) {
		const { title, type } = event.detail;
		addScenarioToFeatureById(id, featureId, title, type);
	}

	function handleDeleteFeature(featureId: string) {
		if (confirm('Êtes-vous sûr de vouloir supprimer cette fonctionnalité ?')) {
			deleteFeature(id, featureId);
		}
	}

	function handleDeleteScenario(featureId: string, scenario: Scenario) {
		if (confirm('Êtes-vous sûr de vouloir supprimer ce scénario ?')) {
			// Trouver l'index réel dans le tableau original
			const feature = epic?.features.find((f) => f.id === featureId);
			if (feature) {
				const realIndex = feature.scenarios.findIndex(
					(s) => s.title === scenario.title && s.type === scenario.type
				);
				if (realIndex !== -1) {
					deleteScenario(id, featureId, realIndex);
				}
			}
		}
	}

	// Fonction pour sauvegarder les changements
	function handleSaveChanges() {
		// Ici vous pouvez ajouter la logique de sauvegarde
		// Par exemple : envoyer les données à une API, localStorage, etc.
		console.log("Sauvegarde des changements pour l'épic:", epic?.title);
		console.log('Données à sauvegarder:', epic);

		// Exemple de notification (vous pouvez personnaliser cela)
		alert('Changements sauvegardés avec succès !');
	}

	// Gestion du drag and drop pour les features
	function handleFeaturesDnd(e: CustomEvent) {
		if (e.type === 'consider') {
			isFeaturesDragging = true;
			// Mettre à jour l'affichage pendant le glissement
			featuresWithId = e.detail.items;
		} else if (e.type === 'finalize') {
			// Petite pause pour éviter les conflits de timing
			setTimeout(() => {
				const newFeatures = e.detail.items.map((item: Feature) => {
					return item;
				});
				reorderFeatures(id, newFeatures);
				isFeaturesDragging = false;
			}, 10);
		}
	}

	// Gestion du drag and drop pour les scenarios dans une feature
	function handleScenariosDnd(featureId: string, e: CustomEvent) {
		if (e.type === 'consider') {
			// Mettre à jour l'affichage pendant le glissement
			scenariosForDnd[featureId] = e.detail.items;
		} else if (e.type === 'finalize') {
			// Petite pause pour éviter les conflits de timing
			setTimeout(() => {
				const newScenarios = e.detail.items.map((item: Scenario) => {
					// Remove the dnd id and return the scenario
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { id: _id, ...scenario } = item;
					return scenario;
				});

				reorderScenarios(id, featureId, newScenarios);

				// Remettre à jour la version pour DnD
				scenariosForDnd[featureId] = prepareScenariosForDnd(newScenarios);
			}, 10);
		}
	}

	// Préparation des scenarios avec des IDs STABLES pour le DnD
	function prepareScenariosForDnd(scenarios: Scenario[]) {
		return scenarios.map((scenario, index) => ({
			...scenario,
			id: `${scenario.title}-${scenario.type}-${index}` // ID stable basé sur le contenu
		}));
	}
</script>

{#if epic}
	<!-- Bouton de retour et sauvegarde -->
	<div class="mb-6 flex items-center gap-4">
		<button
			on:click={() => history.back()}
			class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white/80 px-4 py-2 text-gray-600 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-gray-800"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				></path>
			</svg>
			Retour
		</button>

		<button
			on:click={handleSaveChanges}
			class="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white shadow-sm transition-all duration-200 hover:bg-green-600"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
				></path>
			</svg>
			Sauvegarder les changements
		</button>
	</div>

	<!-- Container principal avec effet tableau blanc -->
	<div class="rounded-3xl border border-gray-200 bg-white/60 p-8 shadow-lg backdrop-blur-sm">
		<BlueCard
			title={epic.title}
			editable={true}
			on:titleUpdate={(e) => handleEpicTitleUpdate(e.detail)}
		>
			<AddFeatureForm epicId={id} />
			<hr class="my-6 border-t border-gray-200" />
			{#if epic.features.length > 0}
				<div
					class="flex flex-wrap gap-4"
					use:dndzone={{
						items: featuresWithId,
						flipDurationMs: 300,
						dropTargetStyle: {
							outline: '2px dashed #3b82f6',
							outlineOffset: '4px'
						}
					}}
					on:consider={handleFeaturesDnd}
					on:finalize={handleFeaturesDnd}
				>
					{#each featuresWithId as feature (feature.id)}
						<div class="dnd-feature-container">
							<YellowCard
								title={feature.title}
								status={feature.status}
								scenarios={feature.scenarios}
								editable={true}
								on:titleUpdate={(e) => handleFeatureUpdate(feature.id, e.detail)}
								on:statusUpdate={(e) => handleFeatureStatusUpdate(feature.id, e.detail)}
								on:delete={() => handleDeleteFeature(feature.id)}
							>
								<br />
								<!-- Zone de glisser-déposer pour les scenarios -->
								<div
									class="scenarios-container"
									use:dndzone={{
										items: scenariosForDnd[feature.id] || [],
										flipDurationMs: 200,
										dropTargetStyle: {
											outline: '2px dashed #10b981',
											outlineOffset: '2px'
										}
									}}
									on:consider={(e) => handleScenariosDnd(feature.id, e)}
									on:finalize={(e) => handleScenariosDnd(feature.id, e)}
								>
									{#each scenariosForDnd[feature.id] || [] as scenario (scenario.id)}
										<div class="scenario-item mb-2">
											{#if scenario.type === 'green'}
												<GreenCard
													title={scenario.title}
													editable={true}
													on:titleUpdate={(e) => {
														// Trouver l'index réel dans le tableau original
														const realIndex = feature.scenarios.findIndex(
															(s) => s.title === scenario.title && s.type === scenario.type
														);
														if (realIndex !== -1) {
															handleScenarioUpdate(feature.id, realIndex, e.detail);
														}
													}}
													on:delete={() => handleDeleteScenario(feature.id, scenario)}
												/>
											{:else if scenario.type === 'grey'}
												<GreyCard
													title={scenario.title}
													editable={true}
													on:titleUpdate={(e) => {
														// Trouver l'index réel dans le tableau original
														const realIndex = feature.scenarios.findIndex(
															(s) => s.title === scenario.title && s.type === scenario.type
														);
														if (realIndex !== -1) {
															handleScenarioUpdate(feature.id, realIndex, e.detail);
														}
													}}
													on:delete={() => handleDeleteScenario(feature.id, scenario)}
												/>
											{/if}
										</div>
									{/each}
								</div>
								<AddFeatureContentForm
									featureId={feature.id}
									on:addContent={(e) => handleAddScenario(feature.id, e)}
								/>
							</YellowCard>
						</div>
					{/each}
				</div>
			{:else}
				<div class="py-8 text-center">
					<div class="mb-4 text-gray-500">
						<svg
							class="mx-auto mb-4 h-16 w-16 text-gray-300"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							></path>
						</svg>
						<p class="text-lg font-medium">Cette épic est vide</p>
						<p class="text-sm">
							Commencez par ajouter des fonctionnalités pour structurer votre épic.
						</p>
					</div>
				</div>
			{/if}
		</BlueCard>
	</div>
{:else}
	<p class="text-red-500">Épic non trouvé</p>
{/if}

<style>
	:global(.dnd-feature-container) {
		transition: all 0.3s ease;
	}

	:global(.dnd-feature-container:hover) {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
	}

	:global(.scenarios-container) {
		min-height: 50px;
		padding: 4px;
		border-radius: 8px;
		transition: all 0.2s ease;
	}

	:global(.scenario-item) {
		transition: all 0.2s ease;
	}

	:global(.scenario-item:hover) {
		transform: scale(1.02);
	}

	/* Styles pour les états de drag */
	:global(.dnd-action-dragged-el) {
		opacity: 0.5;
		transform: rotate(5deg);
	}

	:global(.drop-target-highlighted) {
		background-color: rgba(59, 130, 246, 0.1);
		border: 2px dashed #3b82f6;
	}
</style>

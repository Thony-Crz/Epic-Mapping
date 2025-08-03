<script lang="ts">
	import EditableCard from './EditableCard.svelte';
	import { createEventDispatcher } from 'svelte';

	export let title: string;
	export let editable: boolean = false;
	export let status: string = '';
	export let scenarios: Array<{ title: string; type: 'green' | 'grey' | 'yellow' }> = [];

	const dispatch = createEventDispatcher();

	// Vérifier s'il y a des cartes grises et vertes
	$: hasGreyCards = scenarios.some((scenario) => scenario.type === 'grey');
	$: hasGreenCards = scenarios.some((scenario) => scenario.type === 'green');

	// Le statut effectif ne peut pas être "ready" s'il y a des cartes grises
	$: effectiveStatus = status === 'ready' && hasGreyCards ? 'blocked' : status;

	// Détermine si le bouton "Fonctionnalité prête" est activé
	$: isReadyButtonEnabled = status === 'in-progress' && !hasGreyCards && hasGreenCards;

	// Message d'aide pour expliquer pourquoi le bouton est désactivé
	$: readyButtonTooltip =
		status === 'ready'
			? 'La fonctionnalité est déjà prête'
			: status === 'todo'
				? 'Ajoutez au moins un scénario valide pour continuer'
				: hasGreyCards
					? "Résolvez d'abord toutes les questions (cartes grises)"
					: !hasGreenCards
						? 'Ajoutez au moins un scénario valide (carte verte)'
						: 'Fonctionnalité prête à être validée';

	function handleMarkAsReady() {
		dispatch('statusUpdate', 'ready');
	}

	function handleDelete() {
		dispatch('delete');
	}

	// Générer les classes d'ombre selon le statut effectif
	$: shadowClasses =
		effectiveStatus === 'ready'
			? 'shadow-green-300/50 hover:shadow-green-400/60'
			: effectiveStatus === 'blocked'
				? 'shadow-red-300/50 hover:shadow-red-400/60'
				: effectiveStatus === 'in-progress'
					? 'shadow-orange-300/50 hover:shadow-orange-400/60'
					: effectiveStatus === 'todo'
						? 'shadow-blue-300/50 hover:shadow-blue-400/60'
						: 'shadow-gray-300/50 hover:shadow-gray-400/60';

	// Couleur de la bande selon le statut effectif
	$: bandColor =
		effectiveStatus === 'ready'
			? 'bg-green-500'
			: effectiveStatus === 'blocked'
				? 'bg-red-500'
				: effectiveStatus === 'in-progress'
					? 'bg-orange-500'
					: effectiveStatus === 'todo'
						? 'bg-blue-500'
						: 'bg-gray-500';

	// Texte accessible pour le statut effectif
	$: statusText =
		effectiveStatus === 'ready'
			? 'Prêt'
			: effectiveStatus === 'blocked'
				? 'Bloqué (cartes grises restantes)'
				: effectiveStatus === 'in-progress'
					? 'En cours'
					: effectiveStatus === 'todo'
						? 'À faire'
						: status || 'Statut non défini';
</script>

<div class="relative">
	<!-- Bouton de suppression -->
	<button
		on:click={handleDelete}
		class="absolute -top-2 -right-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-red-600"
		title="Supprimer cette fonctionnalité"
		aria-label="Supprimer cette fonctionnalité"
	>
		<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"
			></path>
		</svg>
	</button>

	<!-- Bande de statut focusable -->
	<button
		class="{bandColor} h-2 w-full cursor-help rounded-t-2xl border-0 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none"
		aria-label="Statut de la fonctionnalité: {statusText}"
		title="Statut: {statusText}"
		on:click={() => {
			/* Pas d'action, juste pour l'accessibilité */
		}}
	></button>

	<EditableCard
		{title}
		{editable}
		placeholder="Nom de la fonctionnalité..."
		cardClass="bg-yellow-400 text-black p-4 rounded-t-none rounded-b-2xl shadow-lg w-64 min-w-64 relative transition-shadow duration-300 hover:shadow-xl {shadowClasses} {effectiveStatus ===
		'blocked'
			? 'border-2 border-red-400'
			: ''}"
		titleClass="text-lg font-semibold mb-2"
		on:titleUpdate
	>
		{#if effectiveStatus === 'blocked'}
			<div class="mb-2 rounded-md border border-red-300 bg-red-100 p-2 text-xs text-red-700">
				<div class="flex items-center gap-1">
					<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
							clip-rule="evenodd"
						></path>
					</svg>
					<span class="font-medium">Bloqué</span>
				</div>
				<div class="mt-1">Des questions restent à traiter</div>
			</div>
		{/if}
		<div class="mb-2">
			<button
				on:click={handleMarkAsReady}
				disabled={!isReadyButtonEnabled}
				title={readyButtonTooltip}
				class="flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 {isReadyButtonEnabled
					? 'bg-green-500 text-white hover:bg-green-600'
					: 'cursor-not-allowed bg-gray-300 text-gray-500'}"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"
					></path>
				</svg>
				Soumettre
			</button>
		</div>
		<div class="flex flex-col gap-2">
			<slot />
		</div>
	</EditableCard>
</div>

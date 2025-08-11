<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { sessionStore, startSession, terminateSession } from '../../lib/stores/sessionStore';

	let session = $sessionStore;
	let timeDisplay = '';
	let intervalId: number | null = null;
	let selectedDuration = 30; // Durée par défaut en minutes
	let customDuration = '';
	let showCustomInput = false;

	// Options prédéfinies pour la durée
	const durationOptions = [
		{ value: 15, label: '15 min' },
		{ value: 30, label: '30 min' },
		{ value: 45, label: '45 min' },
		{ value: 60, label: '1 heure' },
		{ value: 'custom', label: 'Personnalisé' }
	];

	// Réactivité du store
	$: session = $sessionStore;

	// Formatage du temps restant
	function formatTime(remainingMs: number): string {
		const minutes = Math.floor(remainingMs / 60000);
		const seconds = Math.floor((remainingMs % 60000) / 1000);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	}

	// Mise à jour du timer toutes les secondes
	function updateTimer() {
		if (session && session.isActive()) {
			timeDisplay = formatTime(session.getRemainingTimeInMs());
		} else {
			timeDisplay = '';
			if (intervalId) {
				clearInterval(intervalId);
				intervalId = null;
			}
		}
	}

	// Démarrer une session
	function handleStartSession() {
		let duration = selectedDuration;
		
		// Si l'option personnalisée est sélectionnée, utiliser la valeur saisie
		if (selectedDuration === 'custom') {
			const customValue = parseInt(customDuration);
			if (isNaN(customValue) || customValue <= 0) {
				alert('Veuillez saisir une durée valide en minutes');
				return;
			}
			duration = customValue;
		}
		
		startSession(duration);
		startTimer();
	}

	// Gestion du changement de durée sélectionnée
	function handleDurationChange() {
		showCustomInput = selectedDuration === 'custom';
		if (!showCustomInput) {
			customDuration = '';
		}
	}

	// Terminer une session
	function handleTerminateSession() {
		terminateSession();
		stopTimer();
	}

	// Démarrer le timer
	function startTimer() {
		if (intervalId) clearInterval(intervalId);
		intervalId = setInterval(updateTimer, 1000);
		updateTimer(); // Mise à jour immédiate
	}

	// Arrêter le timer
	function stopTimer() {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	// Gestion du cycle de vie
	onMount(() => {
		if (session && session.isActive()) {
			startTimer();
		}
	});

	onDestroy(() => {
		stopTimer();
	});

	// Réactivité : démarrer/arrêter le timer selon l'état de la session
	$: {
		if (session && session.isActive() && !intervalId) {
			startTimer();
		} else if ((!session || !session.isActive()) && intervalId) {
			stopTimer();
		}
	}

	// Réactivité pour l'affichage du champ personnalisé
	$: handleDurationChange(), selectedDuration;
</script>

<div class="session-controls">
	{#if !session || !session.isActive()}
		<div class="session-config">
			<div class="duration-selector">
				<label for="duration-select" class="duration-label">Durée de la session :</label>
				<select 
					id="duration-select"
					bind:value={selectedDuration}
					class="duration-select"
				>
					{#each durationOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
				
				{#if showCustomInput}
					<div class="custom-duration">
						<input
							type="number"
							bind:value={customDuration}
							placeholder="Durée en minutes"
							min="1"
							max="480"
							class="custom-input"
						/>
						<span class="custom-unit">min</span>
					</div>
				{/if}
			</div>
			
			<button
				on:click={handleStartSession}
				class="btn-start-session"
			>
				🕐 Démarrer la session
			</button>
		</div>
		
		<div class="session-info">
			⚠️ Vous devez démarrer une session pour modifier les éléments
		</div>
	{:else}
		<div class="session-active">
			<div class="session-timer">
				<div class="timer-icon">⏰</div>
				<div class="timer-content">
					<div class="timer-label">Session active ({session.getDurationInMinutes()} min)</div>
					<div class="timer-display">{timeDisplay}</div>
				</div>
			</div>
			<button
				on:click={handleTerminateSession}
				class="btn-terminate-session"
			>
				Terminer
			</button>
		</div>
	{/if}
</div>

<style>
	.session-controls {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.5rem;
		background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
		border-radius: 1rem;
		border: 2px solid #0ea5e9;
		margin-bottom: 1.5rem;
		box-shadow: 0 4px 20px rgba(14, 165, 233, 0.1);
	}

	.session-config {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.duration-selector {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.duration-label {
		font-size: 1rem;
		font-weight: 600;
		color: #0369a1;
		margin-bottom: 0.5rem;
	}

	.duration-select {
		padding: 0.75rem 1rem;
		border: 2px solid #0ea5e9;
		border-radius: 0.5rem;
		background: white;
		font-size: 1rem;
		font-weight: 500;
		color: #0369a1;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.duration-select:hover {
		border-color: #0284c7;
		box-shadow: 0 2px 8px rgba(14, 165, 233, 0.15);
	}

	.duration-select:focus {
		outline: none;
		border-color: #0284c7;
		box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
	}

	.custom-duration {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.custom-input {
		flex: 1;
		padding: 0.75rem 1rem;
		border: 2px solid #0ea5e9;
		border-radius: 0.5rem;
		background: white;
		font-size: 1rem;
		color: #0369a1;
		transition: all 0.3s ease;
	}

	.custom-input:hover {
		border-color: #0284c7;
		box-shadow: 0 2px 8px rgba(14, 165, 233, 0.15);
	}

	.custom-input:focus {
		outline: none;
		border-color: #0284c7;
		box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
	}

	.custom-unit {
		font-size: 1rem;
		font-weight: 500;
		color: #0369a1;
		min-width: 2rem;
	}

	.session-active {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		gap: 1rem;
	}

	.session-timer {
		display: flex;
		align-items: center;
		gap: 1rem;
		background: white;
		padding: 1rem 1.5rem;
		border-radius: 0.75rem;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		border: 1px solid #e0f2fe;
	}

	.timer-icon {
		font-size: 2rem;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0%, 100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}

	.timer-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.timer-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #0369a1;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.timer-display {
		font-size: 2rem;
		font-weight: 700;
		color: #059669;
		font-family: 'Courier New', monospace;
		text-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);
		animation: glow 2s ease-in-out infinite alternate;
	}

	@keyframes glow {
		from {
			text-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);
		}
		to {
			text-shadow: 0 2px 8px rgba(5, 150, 105, 0.4), 0 0 12px rgba(5, 150, 105, 0.2);
		}
	}

	.session-info {
		background: #fef3c7;
		color: #92400e;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		border: 1px solid #fbbf24;
	}

	.btn-start-session {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: white;
		border: none;
		padding: 1rem 2rem;
		border-radius: 0.75rem;
		font-weight: 600;
		font-size: 1.1rem;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
		transform: translateY(0);
		align-self: flex-start;
	}

	.btn-start-session:hover {
		background: linear-gradient(135deg, #059669 0%, #047857 100%);
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
	}

	.btn-start-session:active {
		transform: translateY(0);
	}

	.btn-terminate-session {
		background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 2px 10px rgba(239, 68, 68, 0.3);
		transform: translateY(0);
	}

	.btn-terminate-session:hover {
		background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
		transform: translateY(-1px);
		box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
	}

	.btn-terminate-session:active {
		transform: translateY(0);
	}

	/* Responsive design */
	@media (min-width: 768px) {
		.session-config {
			flex-direction: row;
			align-items: flex-end;
			gap: 1.5rem;
		}

		.duration-selector {
			flex: 1;
		}

		.btn-start-session {
			align-self: flex-end;
			white-space: nowrap;
		}

		.session-controls {
			gap: 1.5rem;
		}
	}

	@media (min-width: 1024px) {
		.custom-duration {
			flex-direction: row;
			align-items: center;
		}
	}
</style>

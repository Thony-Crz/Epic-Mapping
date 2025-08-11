<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { sessionStore, startSession, terminateSession } from '../../lib/stores/sessionStore';

	let session = $sessionStore;
	let timeDisplay = '';
	let intervalId: number | null = null;

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
		startSession(30); // 30 minutes par défaut
		startTimer();
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
</script>

<div class="session-controls">
	{#if !session || !session.isActive()}
		<button
			on:click={handleStartSession}
			class="btn-start-session"
		>
			🕐 Démarrer une session
		</button>
	{:else}
		<div class="session-active">
			<div class="session-timer">
				⏰ Session active: {timeDisplay}
			</div>
			<button
				on:click={handleTerminateSession}
				class="btn-terminate-session"
			>
				⏹️ Terminer la session
			</button>
		</div>
	{/if}
</div>

<style>
	.session-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.9);
		border-radius: 0.5rem;
		border: 1px solid #e5e7eb;
		margin-bottom: 1rem;
	}

	.session-active {
		display: flex;
		align-items: center;
		gap: 1rem;
		width: 100%;
	}

	.session-timer {
		font-weight: 600;
		color: #059669;
		font-size: 1.1rem;
	}

	.btn-start-session {
		background: #10b981;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.btn-start-session:hover {
		background: #059669;
	}

	.btn-terminate-session {
		background: #ef4444;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
		margin-left: auto;
	}

	.btn-terminate-session:hover {
		background: #dc2626;
	}
</style>

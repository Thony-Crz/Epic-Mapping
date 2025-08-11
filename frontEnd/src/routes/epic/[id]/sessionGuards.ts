// src/routes/epic/[id]/sessionGuards.ts

import { get } from 'svelte/store';
import { sessionStore } from '../../../lib/stores/sessionStore';
import { updateEpicTitle, updateFeature, addScenarioToFeatureById } from '../../../lib/stores/epicsStore';

/**
 * Vérifie qu'une session est active avant d'autoriser une modification
 */
function checkActiveSession(): void {
	const session = get(sessionStore);
	if (!session || !session.isActive()) {
		throw new Error('Cannot modify epic: no active session');
	}
}

/**
 * Met à jour le titre d'un epic seulement si une session est active
 */
export async function safeUpdateEpicTitle(epicId: string, newTitle: string): Promise<void> {
	checkActiveSession();
	try {
		updateEpicTitle(epicId, newTitle);
	} catch (error) {
		// L'erreur sera gérée par l'appelant - nous avons juste vérifié la session
		throw error;
	}
}

/**
 * Met à jour une feature seulement si une session est active
 */
export async function safeUpdateFeature(epicId: string, featureId: string, newTitle: string): Promise<void> {
	checkActiveSession();
	try {
		updateFeature(epicId, featureId, newTitle);
	} catch (error) {
		throw error;
	}
}

/**
 * Ajoute un scénario à une feature seulement si une session est active
 */
export async function safeAddScenarioToFeature(
	epicId: string, 
	featureId: string, 
	title: string, 
	type: 'green' | 'grey'
): Promise<void> {
	checkActiveSession();
	addScenarioToFeatureById(epicId, featureId, title, type);
}

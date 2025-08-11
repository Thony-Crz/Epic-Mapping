// src/routes/epic/[id]/sessionGuards.ts

import { get } from 'svelte/store';
import { sessionStore } from '../../../lib/stores/sessionStore';
import {
	updateEpicTitle,
	updateFeature,
	updateFeatureStatus,
	updateScenario,
	addScenarioToFeatureById
} from '../../../lib/stores/epicsStore';

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
	updateEpicTitle(epicId, newTitle);
}

/**
 * Met à jour une feature seulement si une session est active
 */
export async function safeUpdateFeature(
	epicId: string,
	featureId: string,
	newTitle: string
): Promise<void> {
	checkActiveSession();
	updateFeature(epicId, featureId, newTitle);
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

/**
 * Met à jour le statut d'une feature seulement si une session est active
 */
export async function safeUpdateFeatureStatus(
	epicId: string,
	featureId: string,
	newStatus: 'ready' | 'in-progress' | 'todo'
): Promise<void> {
	checkActiveSession();
	updateFeatureStatus(epicId, featureId, newStatus);
}

/**
 * Met à jour un scénario seulement si une session est active
 */
export async function safeUpdateScenario(
	epicId: string,
	featureId: string,
	scenarioIndex: number,
	newTitle: string
): Promise<void> {
	checkActiveSession();
	updateScenario(epicId, featureId, scenarioIndex, newTitle);
}

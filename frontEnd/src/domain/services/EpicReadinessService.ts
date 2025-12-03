// src/domain/services/EpicReadinessService.ts

import type { EpicProps } from '../entities/Epic';
import type { FeatureProps } from '../entities/Feature';
import type { ScenarioProps } from '../entities/Scenario';

export interface EpicReadinessResult {
isReady: boolean;
reason?: string;
}

/**
 * Checks if an epic is ready for export based on business rules:
 * 1. If status is "closed", it's ready
 * 2. Otherwise: no grey cards, at least one green card, all features have status "ready"
 */
export function checkEpicReadiness(epic: EpicProps): EpicReadinessResult {
// Rule 1: Closed epics are always ready
if (epic.status === 'closed') {
return { isReady: true };
}

// Rule 2: Archived epics cannot be exported
if (epic.status === 'archived') {
return { isReady: false, reason: "Les épics archivées ne peuvent pas être exportées." };
}

// Get all scenarios
const allScenarios: ScenarioProps[] = epic.features.flatMap(
(feature: FeatureProps) => feature.scenarios
);

// Rule 3: No grey cards allowed
const hasGreyCards = allScenarios.some((scenario: ScenarioProps) => scenario.type === 'grey');
if (hasGreyCards) {
return { 
isReady: false, 
reason: "Il reste des questions (cartes grises) à résoudre." 
};
}

// Rule 4: Must have at least one green card (scenario)
const hasGreenCards = allScenarios.some((scenario: ScenarioProps) => scenario.type === 'green');
if (!hasGreenCards) {
return { 
isReady: false, 
reason: "Aucun scénario validé (carte verte) n'est présent." 
};
}

// Rule 5: All features must have status "ready"
const allFeaturesReady = epic.features.every(
(feature: FeatureProps) => feature.status === 'ready'
);
if (!allFeaturesReady) {
return { 
isReady: false, 
reason: "Toutes les fonctionnalités doivent être au statut 'ready'." 
};
}

return { isReady: true };
}

/**
 * Checks if an epic is ready for export (simple boolean version)
 */
export function isEpicReady(epic: EpicProps): boolean {
return checkEpicReadiness(epic).isReady;
}

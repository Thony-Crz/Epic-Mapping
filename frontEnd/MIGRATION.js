// Migration guide from old epicsStore to new DDD architecture

/**
 * Ce fichier sert de guide pour migrer progressivement de l'ancien store vers la nouvelle architecture.
 *
 * ÉTAPES DE MIGRATION :
 *
 * 1. Dans vos composants Svelte, remplacez l'import :
 *    Ancien : import { epicsStore, addNewEpic } from '$lib/stores/epicsStore';
 *    Nouveau : import { epicsStore, addNewEpic } from '$lib/stores/epicsStore.new';
 *
 * 2. Mettez à jour les appels de fonctions pour les rendre async :
 *    Ancien : addNewEpic('Mon Epic');
 *    Nouveau : await addNewEpic('Mon Epic');
 *
 * 3. Ajoutez la gestion d'erreurs :
 *    try {
 *      await addNewEpic('Mon Epic');
 *    } catch (error) {
 *      console.error('Erreur:', error);
 *    }
 */

// MAPPING DES ANCIENNES FONCTIONS VERS LES NOUVELLES

/*
addNewEpic(title) → await addNewEpic(title)
updateEpicTitle(epicId, newTitle) → await updateEpicTitle(epicId, newTitle)
addFeatureToEpic(epicId, featureTitle) → await addFeatureToEpic(epicId, featureTitle)
updateFeature(epicId, featureId, newTitle) → await updateFeature(epicId, featureId, newTitle)
updateFeatureStatus(epicId, featureId, newStatus) → await updateFeatureStatus(epicId, featureId, newStatus)
deleteFeature(epicId, featureId) → await deleteFeature(epicId, featureId)
addScenarioToFeatureById(epicId, featureId, title, type) → await addScenarioToFeatureById(epicId, featureId, title, type)
updateScenario(epicId, featureId, scenarioIndex, newTitle) → await updateScenario(epicId, featureId, scenarioIndex, newTitle)
deleteScenario(epicId, featureId, scenarioIndex) → await deleteScenario(epicId, featureId, scenarioIndex)
reorderFeatures(epicId, newFeatures) → await reorderFeatures(epicId, newFeatures)
reorderScenarios(epicId, featureId, newScenarios) → await reorderScenarios(epicId, featureId, newScenarios)
moveScenarioBetweenFeatures(...args) → await moveScenarioBetweenFeatures(...args)
*/

// FONCTIONS DÉPRÉCIÉES (plus disponibles)
/*
addScenarioToFeature(epicId, featureIndex, ...) → Utiliser addScenarioToFeatureById à la place
handleAutomaticStatusTransition(...) → La logique est maintenant dans l'entité Feature
*/

export const MIGRATION_NOTES = {
	storeReactivity: 'Le store reste réactif avec Svelte, aucun changement côté UI',
	errorHandling: 'Toutes les fonctions sont maintenant async et peuvent throw des erreurs',
	businessLogic: 'La logique métier est maintenant dans les entités du domain',
	validation: 'La validation est automatique dans les entités',
	testing: 'Les use cases peuvent être testés unitairement'
};

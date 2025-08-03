// src/examples/usage.ts

import { serviceContainer } from '../services/ServiceContainer';

/**
 * Exemple d'utilisation de la nouvelle architecture DDD
 * Ce fichier démontre comment utiliser les services et use cases
 */

async function demonstrateNewArchitecture() {
	console.log('=== Démonstration de la nouvelle architecture DDD ===\n');

	const epicService = serviceContainer.getEpicService();

	try {
		// 1. Créer une nouvelle Epic
		console.log("1. Création d'une nouvelle Epic...");
		const { epic: newEpic } = await epicService.createNewEpic({
			title: 'Epic de démonstration',
			status: 'open',
			projectId: 'demo-project-1'
		});
		console.log(`✅ Epic créée avec l'ID: ${newEpic.id}\n`);

		// 2. Ajouter une Feature
		console.log("2. Ajout d'une Feature...");
		const { feature } = await epicService.addFeature({
			epicId: newEpic.id,
			title: 'Feature de test',
			status: 'todo'
		});
		console.log(`✅ Feature créée avec l'ID: ${feature.id}\n`);

		// 3. Ajouter un scénario gris
		console.log("3. Ajout d'un scénario gris...");
		await epicService.addScenario({
			epicId: newEpic.id,
			featureId: feature.id,
			title: 'Scénario de test gris',
			type: 'grey'
		});
		console.log('✅ Scénario gris ajouté\n');

		// 4. Ajouter un scénario vert (devrait changer le statut de la feature)
		console.log("4. Ajout d'un scénario vert (doit changer le statut)...");
		await epicService.addScenario({
			epicId: newEpic.id,
			featureId: feature.id,
			title: 'Scénario de test vert',
			type: 'green'
		});
		console.log('✅ Scénario vert ajouté\n');

		// 5. Vérifier l'état final
		console.log("5. Vérification de l'état final...");
		const finalEpic = await epicService.getEpicById(newEpic.id);
		if (finalEpic) {
			const finalFeature = finalEpic.features.find((f) => f.id === feature.id);
			console.log(`Epic: ${finalEpic.title}`);
			console.log(`Feature: ${finalFeature?.title} - Status: ${finalFeature?.status}`);
			console.log(`Scénarios: ${finalFeature?.scenarios.length}`);
			finalFeature?.scenarios.forEach(
				(scenario: { title: string; type: string }, index: number) => {
					console.log(`  ${index + 1}. ${scenario.title} (${scenario.type})`);
				}
			);
		}

		console.log('\n🎉 Démonstration terminée avec succès !');
		console.log('\n📋 Points clés démontrés:');
		console.log("• Création d'entités avec validation automatique");
		console.log('• Use cases avec responsabilité unique');
		console.log('• Règles métier appliquées automatiquement');
		console.log('• Immutabilité des entités');
		console.log("• Gestion d'erreurs centralisée");
	} catch (error) {
		console.error('❌ Erreur lors de la démonstration:', error);
	}
}

// Pour tester en développement
if (typeof window !== 'undefined') {
	// @ts-expect-error - Attaching function to window for development testing
	window.demonstrateNewArchitecture = demonstrateNewArchitecture;
}

export { demonstrateNewArchitecture };

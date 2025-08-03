// src/domain/entities/__tests__/Feature.test.ts

import { describe, it, expect } from 'vitest';
import { Feature, Scenario } from '../index';

describe('Feature Entity', () => {
	describe('Business Rules', () => {
		it('should change status from todo to in-progress when adding green scenario', () => {
			const feature = Feature.create({
				title: 'Test Feature',
				status: 'todo',
				scenarios: []
			});

			const greenScenario = Scenario.create({
				title: 'Green scenario',
				type: 'green'
			});

			const updatedFeature = feature.addScenario(greenScenario);

			expect(updatedFeature.status).toBe('in-progress');
			expect(feature.status).toBe('todo'); // Immutability
		});

		it('should not change status when adding non-green scenario', () => {
			const feature = Feature.create({
				title: 'Test Feature',
				status: 'todo',
				scenarios: []
			});

			const greyScenario = Scenario.create({
				title: 'Grey scenario',
				type: 'grey'
			});

			const updatedFeature = feature.addScenario(greyScenario);

			expect(updatedFeature.status).toBe('todo');
		});

		it('should detect green scenarios correctly', () => {
			const greenScenario = Scenario.create({
				title: 'Green scenario',
				type: 'green'
			});

			const greyScenario = Scenario.create({
				title: 'Grey scenario',
				type: 'grey'
			});

			const feature = Feature.create({
				title: 'Test Feature',
				status: 'todo',
				scenarios: [greyScenario, greenScenario]
			});

			expect(feature.hasGreenScenarios()).toBe(true);
		});
	});

	describe('Scenario Management', () => {
		it('should remove scenario at correct index', () => {
			const scenario1 = Scenario.create({ title: 'Scenario 1', type: 'grey' });
			const scenario2 = Scenario.create({ title: 'Scenario 2', type: 'green' });
			const scenario3 = Scenario.create({ title: 'Scenario 3', type: 'yellow' });

			const feature = Feature.create({
				title: 'Test Feature',
				status: 'todo',
				scenarios: [scenario1, scenario2, scenario3]
			});

			const updatedFeature = feature.removeScenario(1); // Remove scenario2

			expect(updatedFeature.scenarios).toHaveLength(2);
			expect(updatedFeature.scenarios[0].title).toBe('Scenario 1');
			expect(updatedFeature.scenarios[1].title).toBe('Scenario 3');
		});

		it('should throw error for invalid scenario index', () => {
			const feature = Feature.create({
				title: 'Test Feature',
				status: 'todo',
				scenarios: []
			});

			expect(() => {
				feature.removeScenario(0);
			}).toThrow('Invalid scenario index');

			expect(() => {
				feature.removeScenario(-1);
			}).toThrow('Invalid scenario index');
		});
	});
});

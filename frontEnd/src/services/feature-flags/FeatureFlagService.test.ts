import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FeatureFlagService } from './FeatureFlagService';
import type { FeatureFlag } from './FeatureFlag';

describe('FeatureFlagService', () => {
	let service: FeatureFlagService;

	beforeEach(() => {
		service = new FeatureFlagService();
	});

	it('should exist', () => {
		expect(service).toBeDefined();
	});

	it('should return false for unknown feature flag', () => {
		const result = service.isEnabled('unknown-feature');
		expect(result).toBe(false);
	});

	it('should return true for enabled feature flag', () => {
		const flag: FeatureFlag = {
			name: 'test-feature',
			description: 'Test feature',
			enabled: false
		};
		service.registerFlag(flag);
		service.enable('test-feature');
		const result = service.isEnabled('test-feature');
		expect(result).toBe(true);
	});

	it('should return false for disabled feature flag', () => {
		const flag: FeatureFlag = {
			name: 'test-feature',
			description: 'Test feature',
			enabled: true
		};
		service.registerFlag(flag);
		service.disable('test-feature');
		const result = service.isEnabled('test-feature');
		expect(result).toBe(false);
	});

	it('should return all available feature flags', () => {
		const flags = service.getAllFlags();
		expect(Array.isArray(flags)).toBe(true);
		expect(flags.length).toBe(0); // Initially empty
	});

	it('should register a new feature flag', () => {
		const flag: FeatureFlag = {
			name: 'new-feature',
			description: 'A new feature',
			enabled: false
		};
		service.registerFlag(flag);
		const flags = service.getAllFlags();
		expect(flags.length).toBe(1);
		expect(flags[0]).toEqual(flag);
	});

	it('should load feature flags from JSON configuration', () => {
		service.loadFromConfig();
		const flags = service.getAllFlags();
		
		// Vérifier que le flag epic-export est chargé
		const epicExportFlag = flags.find((f: FeatureFlag) => f.name === 'epic-export');
		expect(epicExportFlag).toBeDefined();
		expect(epicExportFlag?.enabled).toBe(false); // Par défaut désactivé
		expect(epicExportFlag?.description).toBe('Fonctionnalité d\'export des epics en PDF/Excel et d\'export en Backlog Azure');
	});

	it('should toggle feature flag states correctly', () => {
		service.loadFromConfig();
		
		// Vérifier l'état initial
		expect(service.isEnabled('epic-export')).toBe(false);
		
		// Activer
		service.enable('epic-export');
		expect(service.isEnabled('epic-export')).toBe(true);
		
		// Désactiver
		service.disable('epic-export');
		expect(service.isEnabled('epic-export')).toBe(false);
	});
});

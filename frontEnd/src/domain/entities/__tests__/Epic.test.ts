// src/domain/entities/__tests__/Epic.test.ts

import { describe, it, expect } from 'vitest';
import { Epic, Feature, Scenario } from '../index';

describe('Epic Entity', () => {
  describe('Creation', () => {
    it('should create an epic with valid data', () => {
      const epic = Epic.create({
        title: 'Test Epic',
        status: 'open',
        features: []
      });

      expect(epic.title).toBe('Test Epic');
      expect(epic.status).toBe('open');
      expect(epic.features).toEqual([]);
      expect(epic.id).toBeDefined();
    });

    it('should throw error for empty title', () => {
      expect(() => {
        Epic.create({
          title: '',
          status: 'open',
          features: []
        });
      }).toThrow('Epic title cannot be empty');
    });

    it('should throw error for title too long', () => {
      const longTitle = 'a'.repeat(101);
      expect(() => {
        Epic.create({
          title: longTitle,
          status: 'open',
          features: []
        });
      }).toThrow('Epic title cannot exceed 100 characters');
    });
  });

  describe('Business Operations', () => {
    it('should update title correctly', () => {
      const epic = Epic.create({
        title: 'Original Title',
        status: 'open',
        features: []
      });

      const updatedEpic = epic.updateTitle('New Title');

      expect(updatedEpic.title).toBe('New Title');
      expect(epic.title).toBe('Original Title'); // Immutability
    });

    it('should add feature correctly', () => {
      const epic = Epic.create({
        title: 'Test Epic',
        status: 'open',
        features: []
      });

      const feature = Feature.create({
        title: 'Test Feature',
        status: 'todo',
        scenarios: []
      });

      const updatedEpic = epic.addFeature(feature);

      expect(updatedEpic.features).toHaveLength(1);
      expect(updatedEpic.features[0].title).toBe('Test Feature');
      expect(epic.features).toHaveLength(0); // Immutability
    });

    it('should remove feature correctly', () => {
      const feature = Feature.create({
        title: 'Test Feature',
        status: 'todo',
        scenarios: []
      });

      const epic = Epic.create({
        title: 'Test Epic',
        status: 'open',
        features: [feature]
      });

      const updatedEpic = epic.removeFeature(feature.id);

      expect(updatedEpic.features).toHaveLength(0);
      expect(epic.features).toHaveLength(1); // Immutability
    });
  });
});

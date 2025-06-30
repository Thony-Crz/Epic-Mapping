// src/services/EpicService.ts

import type { EpicRepository } from '../domain/repositories';
import { 
  CreateEpic, 
  UpdateEpic, 
  DeleteEpic,
  type CreateEpicInput,
  type UpdateEpicInput,
  type DeleteEpicInput
} from '../features/epic-management/use-cases';
import {
  AddFeatureToEpic,
  UpdateFeature,
  DeleteFeature,
  type AddFeatureToEpicInput,
  type UpdateFeatureInput,
  type DeleteFeatureInput
} from '../features/feature-management/use-cases';
import {
  AddScenarioToFeature,
  UpdateScenario,
  DeleteScenario,
  type AddScenarioToFeatureInput,
  type UpdateScenarioInput,
  type DeleteScenarioInput
} from '../features/scenario-management/use-cases';

export class EpicService {
  private createEpic: CreateEpic;
  private updateEpic: UpdateEpic;
  private deleteEpic: DeleteEpic;
  private addFeatureToEpic: AddFeatureToEpic;
  private updateFeature: UpdateFeature;
  private deleteFeature: DeleteFeature;
  private addScenarioToFeature: AddScenarioToFeature;
  private updateScenario: UpdateScenario;
  private deleteScenario: DeleteScenario;

  constructor(private epicRepository: EpicRepository) {
    this.createEpic = new CreateEpic(epicRepository);
    this.updateEpic = new UpdateEpic(epicRepository);
    this.deleteEpic = new DeleteEpic(epicRepository);
    this.addFeatureToEpic = new AddFeatureToEpic(epicRepository);
    this.updateFeature = new UpdateFeature(epicRepository);
    this.deleteFeature = new DeleteFeature(epicRepository);
    this.addScenarioToFeature = new AddScenarioToFeature(epicRepository);
    this.updateScenario = new UpdateScenario(epicRepository);
    this.deleteScenario = new DeleteScenario(epicRepository);
  }

  // Epic operations
  async createNewEpic(input: CreateEpicInput) {
    return this.createEpic.execute(input);
  }

  async updateEpicDetails(input: UpdateEpicInput) {
    return this.updateEpic.execute(input);
  }

  async removeEpic(input: DeleteEpicInput) {
    return this.deleteEpic.execute(input);
  }

  // Feature operations
  async addFeature(input: AddFeatureToEpicInput) {
    return this.addFeatureToEpic.execute(input);
  }

  async updateFeatureDetails(input: UpdateFeatureInput) {
    return this.updateFeature.execute(input);
  }

  async removeFeature(input: DeleteFeatureInput) {
    return this.deleteFeature.execute(input);
  }

  // Scenario operations
  async addScenario(input: AddScenarioToFeatureInput) {
    return this.addScenarioToFeature.execute(input);
  }

  async updateScenarioDetails(input: UpdateScenarioInput) {
    return this.updateScenario.execute(input);
  }

  async removeScenario(input: DeleteScenarioInput) {
    return this.deleteScenario.execute(input);
  }

  // Query operations
  async getAllEpics() {
    return this.epicRepository.findAll();
  }

  async getEpicById(id: string) {
    return this.epicRepository.findById(id);
  }
}

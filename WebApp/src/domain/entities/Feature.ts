// src/domain/entities/Feature.ts

import { Scenario, type ScenarioProps } from './Scenario';

export type FeatureStatus = 'ready' | 'in-progress' | 'todo';

export interface FeatureProps {
  id: string;
  title: string;
  status: FeatureStatus;
  scenarios: ScenarioProps[];
}

export class Feature {
  private constructor(private props: FeatureProps) {
    this.validateTitle(props.title);
  }

  static create(props: Omit<FeatureProps, 'id'>): Feature {
    const id = crypto.randomUUID();
    return new Feature({ ...props, id });
  }

  static fromProps(props: FeatureProps): Feature {
    return new Feature(props);
  }

  private validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Feature title cannot be empty');
    }
    if (title.length > 200) {
      throw new Error('Feature title cannot exceed 200 characters');
    }
  }

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get status(): FeatureStatus {
    return this.props.status;
  }

  get scenarios(): Scenario[] {
    return this.props.scenarios.map(scenarioProps => Scenario.fromProps(scenarioProps));
  }

  updateTitle(newTitle: string): Feature {
    this.validateTitle(newTitle);
    return new Feature({
      ...this.props,
      title: newTitle
    });
  }

  updateStatus(newStatus: FeatureStatus): Feature {
    return new Feature({
      ...this.props,
      status: newStatus
    });
  }

  addScenario(scenario: Scenario): Feature {
    const newScenarios = [...this.props.scenarios, scenario.toProps()];
    let newStatus = this.props.status;

    // Règle métier : Si on ajoute un scénario vert à une feature "todo", elle passe en "in-progress"
    if (this.props.status === 'todo' && scenario.type === 'green') {
      newStatus = 'in-progress';
    }

    return new Feature({
      ...this.props,
      scenarios: newScenarios,
      status: newStatus
    });
  }

  removeScenario(scenarioIndex: number): Feature {
    if (scenarioIndex < 0 || scenarioIndex >= this.props.scenarios.length) {
      throw new Error('Invalid scenario index');
    }

    const newScenarios = [...this.props.scenarios];
    newScenarios.splice(scenarioIndex, 1);

    return new Feature({
      ...this.props,
      scenarios: newScenarios
    });
  }

  updateScenario(scenarioIndex: number, updatedScenario: Scenario): Feature {
    if (scenarioIndex < 0 || scenarioIndex >= this.props.scenarios.length) {
      throw new Error('Invalid scenario index');
    }

    const newScenarios = [...this.props.scenarios];
    newScenarios[scenarioIndex] = updatedScenario.toProps();

    return new Feature({
      ...this.props,
      scenarios: newScenarios
    });
  }

  reorderScenarios(newScenarios: Scenario[]): Feature {
    if (newScenarios.length !== this.props.scenarios.length) {
      throw new Error('All scenarios must be present when reordering');
    }

    return new Feature({
      ...this.props,
      scenarios: newScenarios.map(s => s.toProps())
    });
  }

  moveScenarioToIndex(fromIndex: number, toIndex: number): Feature {
    if (fromIndex < 0 || fromIndex >= this.props.scenarios.length ||
        toIndex < 0 || toIndex >= this.props.scenarios.length) {
      throw new Error('Invalid scenario index');
    }

    const newScenarios = [...this.props.scenarios];
    const [movedScenario] = newScenarios.splice(fromIndex, 1);
    newScenarios.splice(toIndex, 0, movedScenario);

    return new Feature({
      ...this.props,
      scenarios: newScenarios
    });
  }

  hasGreenScenarios(): boolean {
    return this.props.scenarios.some(scenario => scenario.type === 'green');
  }

  toProps(): FeatureProps {
    return {
      id: this.props.id,
      title: this.props.title,
      status: this.props.status,
      scenarios: this.props.scenarios
    };
  }
}

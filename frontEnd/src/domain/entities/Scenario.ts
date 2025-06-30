// src/domain/entities/Scenario.ts

export type ScenarioType = 'green' | 'grey' | 'yellow';

export interface ScenarioProps {
  title: string;
  type: ScenarioType;
}

export class Scenario {
  private constructor(private props: ScenarioProps) {
    this.validateTitle(props.title);
    this.validateType(props.type);
  }

  static create(props: ScenarioProps): Scenario {
    return new Scenario(props);
  }

  static fromProps(props: ScenarioProps): Scenario {
    return new Scenario(props);
  }

  private validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Scenario title cannot be empty');
    }
    if (title.length > 500) {
      throw new Error('Scenario title cannot exceed 500 characters');
    }
  }

  private validateType(type: ScenarioType): void {
    const validTypes: ScenarioType[] = ['green', 'grey', 'yellow'];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid scenario type: ${type}`);
    }
  }

  get title(): string {
    return this.props.title;
  }

  get type(): ScenarioType {
    return this.props.type;
  }

  updateTitle(newTitle: string): Scenario {
    this.validateTitle(newTitle);
    return new Scenario({
      ...this.props,
      title: newTitle
    });
  }

  updateType(newType: ScenarioType): Scenario {
    this.validateType(newType);
    return new Scenario({
      ...this.props,
      type: newType
    });
  }

  isGreen(): boolean {
    return this.props.type === 'green';
  }

  isGrey(): boolean {
    return this.props.type === 'grey';
  }

  isYellow(): boolean {
    return this.props.type === 'yellow';
  }

  toProps(): ScenarioProps {
    return {
      title: this.props.title,
      type: this.props.type
    };
  }
}

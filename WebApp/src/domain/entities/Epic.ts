// src/domain/entities/Epic.ts

import { Feature, type FeatureProps } from './Feature';

export type EpicStatus = 'open' | 'in progress' | 'closed' | 'archived';

export interface EpicProps {
  id: string;
  title: string;
  status: EpicStatus;
  features: FeatureProps[];
}

export class Epic {
  private constructor(private props: EpicProps) {
    this.validateTitle(props.title);
  }

  static create(props: Omit<EpicProps, 'id'>): Epic {
    const id = `epic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return new Epic({ ...props, id });
  }

  static fromProps(props: EpicProps): Epic {
    return new Epic(props);
  }

  private validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Epic title cannot be empty');
    }
    if (title.length > 100) {
      throw new Error('Epic title cannot exceed 100 characters');
    }
  }

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get status(): EpicStatus {
    return this.props.status;
  }

  get features(): Feature[] {
    return this.props.features.map(featureProps => Feature.fromProps(featureProps));
  }

  updateTitle(newTitle: string): Epic {
    this.validateTitle(newTitle);
    return new Epic({
      ...this.props,
      title: newTitle
    });
  }

  updateStatus(newStatus: EpicStatus): Epic {
    return new Epic({
      ...this.props,
      status: newStatus
    });
  }

  archive(): Epic {
    return new Epic({
      ...this.props,
      status: 'archived'
    });
  }

  addFeature(feature: Feature): Epic {
    return new Epic({
      ...this.props,
      features: [...this.props.features, feature.toProps()]
    });
  }

  removeFeature(featureId: string): Epic {
    return new Epic({
      ...this.props,
      features: this.props.features.filter(f => f.id !== featureId)
    });
  }

  updateFeature(featureId: string, updatedFeature: Feature): Epic {
    const featureIndex = this.props.features.findIndex(f => f.id === featureId);
    if (featureIndex === -1) {
      throw new Error(`Feature with id ${featureId} not found`);
    }

    const newFeatures = [...this.props.features];
    newFeatures[featureIndex] = updatedFeature.toProps();

    return new Epic({
      ...this.props,
      features: newFeatures
    });
  }

  reorderFeatures(newFeatures: Feature[]): Epic {
    // Vérifier que toutes les features sont présentes
    if (newFeatures.length !== this.props.features.length) {
      throw new Error('All features must be present when reordering');
    }

    return new Epic({
      ...this.props,
      features: newFeatures.map(f => f.toProps())
    });
  }

  toProps(): EpicProps {
    return {
      id: this.props.id,
      title: this.props.title,
      status: this.props.status,
      features: this.props.features
    };
  }
}

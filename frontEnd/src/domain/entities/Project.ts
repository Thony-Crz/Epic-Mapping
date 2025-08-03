// src/domain/entities/Project.ts

export interface ProjectProps {
	id: string;
	name: string;
	description?: string;
	createdAt: Date;
	updatedAt: Date;
	color?: string; // Couleur pour identifier visuellement le projet
}

export class Project {
	private props: ProjectProps;

	constructor(props: ProjectProps) {
		this.props = { ...props };
	}

	get id(): string {
		return this.props.id;
	}

	get name(): string {
		return this.props.name;
	}

	get description(): string | undefined {
		return this.props.description;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	get color(): string | undefined {
		return this.props.color;
	}

	updateName(name: string): void {
		this.props.name = name;
		this.props.updatedAt = new Date();
	}

	updateDescription(description: string): void {
		this.props.description = description;
		this.props.updatedAt = new Date();
	}

	updateColor(color: string): void {
		this.props.color = color;
		this.props.updatedAt = new Date();
	}

	toPlainObject(): ProjectProps {
		return { ...this.props };
	}
}

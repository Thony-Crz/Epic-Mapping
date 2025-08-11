// src/domain/entities/Session.ts

export interface SessionProps {
	id: string;
	startTime: number;
	durationInMinutes: number;
	isActive: boolean;
}

export class Session {
	private constructor(private props: SessionProps) {}

	static create(durationInMinutes: number = 30): Session {
		const id = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		const startTime = Date.now();

		return new Session({
			id,
			startTime,
			durationInMinutes,
			isActive: true
		});
	}

	static fromProps(props: SessionProps): Session {
		return new Session(props);
	}

	get id(): string {
		return this.props.id;
	}

	isActive(): boolean {
		if (!this.props.isActive) {
			return false;
		}

		const now = Date.now();
		const elapsedTime = now - this.props.startTime;
		const durationInMs = this.props.durationInMinutes * 60 * 1000;

		return elapsedTime < durationInMs;
	}

	getDurationInMinutes(): number {
		return this.props.durationInMinutes;
	}

	getRemainingTimeInMs(): number {
		if (!this.props.isActive) {
			return 0;
		}

		const now = Date.now();
		const elapsedTime = now - this.props.startTime;
		const durationInMs = this.props.durationInMinutes * 60 * 1000;
		const remaining = durationInMs - elapsedTime;

		return Math.max(0, remaining);
	}

	terminate(): Session {
		return new Session({
			...this.props,
			isActive: false
		});
	}

	toProps(): SessionProps {
		return { ...this.props };
	}
}

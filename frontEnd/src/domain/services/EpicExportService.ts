// src/domain/services/EpicExportService.ts

import type { EpicProps } from '../entities/Epic';
import type { FeatureProps } from '../entities/Feature';
import type { ScenarioProps } from '../entities/Scenario';

/**
 * Azure DevOps compatible export format for story mapping
 */
export interface AzureDevOpsExport {
	schemaVersion: string;
	exportedAt: string;
	epic: AzureDevOpsEpic;
	features: AzureDevOpsFeature[];
}

export interface AzureDevOpsEpic {
	id: string;
	title: string;
	status: string;
	projectId: string;
	workItemType: 'Epic';
}

export interface AzureDevOpsFeature {
	id: string;
	title: string;
	status: string;
	order: number;
	workItemType: 'Feature';
	parentEpicId: string;
	scenarios: AzureDevOpsScenario[];
}

export interface AzureDevOpsScenario {
	title: string;
	type: string;
	order: number;
	workItemType: 'User Story' | 'Test Case';
	parentFeatureId: string;
	acceptanceCriteria?: string;
}

/**
 * Converts an Epic to Azure DevOps compatible JSON format
 */
export function exportEpicToAzureDevOps(
	epic: EpicProps,
	_projectName?: string
): AzureDevOpsExport {
	const exportedAt = new Date().toISOString();

	const features: AzureDevOpsFeature[] = epic.features.map(
		(feature: FeatureProps, featureIndex: number) => {
			const scenarios: AzureDevOpsScenario[] = feature.scenarios.map(
				(scenario: ScenarioProps, scenarioIndex: number) => ({
					title: scenario.title,
					type: scenario.type,
					order: scenarioIndex + 1,
					workItemType: scenario.type === 'green' ? 'User Story' : 'Test Case',
					parentFeatureId: feature.id,
					acceptanceCriteria:
						scenario.type === 'green' ? `Validated scenario: ${scenario.title}` : undefined
				})
			);

			return {
				id: feature.id,
				title: feature.title,
				status: mapFeatureStatus(feature.status),
				order: featureIndex + 1,
				workItemType: 'Feature' as const,
				parentEpicId: epic.id,
				scenarios
			};
		}
	);

	return {
		schemaVersion: '1.0.0',
		exportedAt,
		epic: {
			id: epic.id,
			title: epic.title,
			status: mapEpicStatus(epic.status),
			projectId: epic.projectId,
			workItemType: 'Epic'
		},
		features
	};
}

/**
 * Downloads the export as a JSON file
 */
export function downloadEpicExport(epic: EpicProps, projectName?: string): void {
	const exportData = exportEpicToAzureDevOps(epic, projectName);
	const json = JSON.stringify(exportData, null, 2);

	const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
	const url = URL.createObjectURL(blob);

	const filename = generateExportFilename(epic.title);

	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.style.visibility = 'hidden';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

// Constants for filename generation
const MAX_TITLE_LENGTH = 50;
const ISO_DATETIME_LENGTH = 19; // Length of "YYYY-MM-DDTHH-MM-SS"

/**
 * Generates a safe filename for the export
 */
function generateExportFilename(epicTitle: string): string {
	const safeTitle = epicTitle
		.replace(/[^a-zA-Z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.toLowerCase()
		.substring(0, MAX_TITLE_LENGTH);

	const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, ISO_DATETIME_LENGTH);

	return `epic-${safeTitle}-${timestamp}.json`;
}

/**
 * Maps internal epic status to Azure DevOps status
 */
function mapEpicStatus(status: string): string {
	switch (status) {
		case 'closed':
			return 'Done';
		case 'archived':
			return 'Removed';
		case 'in progress':
			return 'Active';
		case 'open':
		default:
			return 'New';
	}
}

/**
 * Maps internal feature status to Azure DevOps status
 */
function mapFeatureStatus(status: string): string {
	switch (status) {
		case 'ready':
			return 'Done';
		case 'in-progress':
			return 'Active';
		case 'todo':
		default:
			return 'New';
	}
}

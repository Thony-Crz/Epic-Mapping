<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from 'storybook/test';
	import YellowCard from '../../../ui/components/cards/YellowCard.svelte';

	const { Story } = defineMeta({
		title: 'Components/Cards/YellowCard',
		component: YellowCard,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
			docs: {
				description: {
					component: 'Carte jaune pour les fonctionnalités avec gestion de statut et validation'
				}
			}
		},
		argTypes: {
			title: {
				control: 'text',
				description: 'Titre de la fonctionnalité'
			},
			editable: {
				control: 'boolean',
				description: 'Permet l\'édition du titre'
			},
			status: {
				control: 'select',
				options: ['todo', 'in-progress', 'ready', 'blocked'],
				description: 'Statut de la fonctionnalité'
			},
			scenarios: {
				control: 'object',
				description: 'Liste des scénarios associés'
			}
		},
		args: {
			onTitleUpdate: fn(),
			onStatusUpdate: fn(),
			onDelete: fn()
		}
	});
</script>

<Story name="Todo" args={{ 
	title: 'Nouvelle fonctionnalité',
	editable: true,
	status: 'todo',
	scenarios: []
}}>
	<p class="text-sm text-gray-700">Fonctionnalité en attente de traitement</p>
</Story>

<Story name="In Progress" args={{ 
	title: 'Fonctionnalité en cours',
	editable: true,
	status: 'in-progress',
	scenarios: [
		{ title: 'Scénario principal', type: 'green' },
		{ title: 'Question en attente', type: 'grey' }
	]
}}>
	<div class="space-y-2">
		<p class="text-sm text-gray-700">Développement en cours</p>
		<div class="flex gap-1">
			<div class="w-3 h-3 bg-green-500 rounded"></div>
			<div class="w-3 h-3 bg-gray-400 rounded"></div>
		</div>
	</div>
</Story>

<Story name="Ready" args={{ 
	title: 'Fonctionnalité prête',
	editable: true,
	status: 'ready',
	scenarios: [
		{ title: 'Scénario validé', type: 'green' },
		{ title: 'Scénario secondaire', type: 'green' }
	]
}}>
	<div class="space-y-2">
		<p class="text-sm text-gray-700">Prête pour validation</p>
		<div class="flex gap-1">
			<div class="w-3 h-3 bg-green-500 rounded"></div>
			<div class="w-3 h-3 bg-green-500 rounded"></div>
		</div>
	</div>
</Story>

<Story name="Blocked" args={{ 
	title: 'Fonctionnalité bloquée',
	editable: true,
	status: 'ready',
	scenarios: [
		{ title: 'Scénario validé', type: 'green' },
		{ title: 'Question bloquante', type: 'grey' }
	]
}}>
	<div class="space-y-2">
		<p class="text-sm text-gray-700">Bloquée par des questions non résolues</p>
		<div class="flex gap-1">
			<div class="w-3 h-3 bg-green-500 rounded"></div>
			<div class="w-3 h-3 bg-gray-400 rounded"></div>
		</div>
	</div>
</Story>

<Story name="Feature Workflow">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
		<div class="space-y-4">
			<h3 class="text-lg font-semibold">États de fonctionnalité</h3>
			
			<YellowCard 
				title="À faire"
				editable={true}
				status="todo"
				scenarios={[]}
			>
				<p class="text-sm text-gray-700">Nouvelle fonctionnalité planifiée</p>
			</YellowCard>
			
			<YellowCard 
				title="En cours"
				editable={true}
				status="in-progress"
				scenarios={[
					{ title: 'Scénario principal', type: 'green' }
				]}
			>
				<div class="space-y-2">
					<p class="text-sm text-gray-700">Développement en cours</p>
					<div class="text-xs text-green-600">✓ 1 scénario validé</div>
				</div>
			</YellowCard>
		</div>
		
		<div class="space-y-4">
			<h3 class="text-lg font-semibold">États avancés</h3>
			
			<YellowCard 
				title="Prête"
				editable={true}
				status="ready"
				scenarios={[
					{ title: 'Scénario principal', type: 'green' },
					{ title: 'Scénario alternatif', type: 'green' }
				]}
			>
				<div class="space-y-2">
					<p class="text-sm text-gray-700">Prête pour validation</p>
					<div class="text-xs text-green-600">✓ 2 scénarios validés</div>
				</div>
			</YellowCard>
			
			<YellowCard 
				title="Bloquée"
				editable={true}
				status="ready"
				scenarios={[
					{ title: 'Scénario validé', type: 'green' },
					{ title: 'Question ouverte', type: 'grey' }
				]}
			>
				<div class="space-y-2">
					<p class="text-sm text-gray-700">Questions non résolues</p>
					<div class="text-xs text-red-600">⚠ 1 question en attente</div>
				</div>
			</YellowCard>
		</div>
	</div>
</Story>

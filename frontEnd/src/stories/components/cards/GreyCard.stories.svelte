<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from 'storybook/test';
	import GreyCard from '../../../ui/components/cards/GreyCard.svelte';

	const { Story } = defineMeta({
		title: 'Components/Cards/GreyCard',
		component: GreyCard,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
			docs: {
				description: {
					component: 'Carte grise pour les questions ou scénarios en attente de clarification'
				}
			}
		},
		argTypes: {
			title: {
				control: 'text',
				description: 'Titre de la question ou scénario'
			},
			editable: {
				control: 'boolean',
				description: 'Permet l\'édition du titre'
			}
		},
		args: {
			onTitleUpdate: fn(),
			onDelete: fn()
		}
	});
</script>

<Story name="Default" args={{ 
	title: 'Question en attente',
	editable: false
}}>
	<p class="text-sm text-gray-600 mt-2 italic">Nécessite clarification</p>
</Story>

<Story name="Editable" args={{ 
	title: 'Que se passe-t-il si...?',
	editable: true
}}>
	<div class="mt-2 space-y-1">
		<p class="text-sm text-gray-600 italic">Question à résoudre</p>
		<p class="text-sm text-gray-500">Assigné à: Product Owner</p>
	</div>
</Story>

<Story name="Multiple Questions">
	<div class="space-y-4 max-w-md">
		<h3 class="text-lg font-semibold">Questions en attente</h3>
		
		<GreyCard title="Validation des données" editable={true}>
			<div class="mt-2 text-sm text-gray-600 italic">
				<p>Comment gérer la validation côté client vs serveur ?</p>
				<div class="mt-2 text-xs text-gray-500">
					<span class="bg-gray-200 px-2 py-1 rounded">Backend</span>
					<span class="bg-gray-200 px-2 py-1 rounded ml-1">Frontend</span>
				</div>
			</div>
		</GreyCard>
		
		<GreyCard title="Performance" editable={true}>
			<div class="mt-2 text-sm text-gray-600 italic">
				<p>Quelle est la limite acceptable de temps de réponse ?</p>
				<div class="mt-2 text-xs text-gray-500">
					<span class="bg-gray-200 px-2 py-1 rounded">Performance</span>
				</div>
			</div>
		</GreyCard>
		
		<GreyCard title="Compatibilité navigateur" editable={true}>
			<div class="mt-2 text-sm text-gray-600 italic">
				<p>Doit-on supporter Internet Explorer ?</p>
				<div class="mt-2 text-xs text-gray-500">
					<span class="bg-gray-200 px-2 py-1 rounded">Compatibilité</span>
				</div>
			</div>
		</GreyCard>
	</div>
</Story>

<Story name="Question Types">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
		<div class="space-y-3">
			<h3 class="text-md font-semibold">Questions techniques</h3>
			
			<GreyCard title="Architecture" editable={true}>
				<p class="text-sm text-gray-600 italic mt-2">
					Microservices ou monolithe ?
				</p>
			</GreyCard>
			
			<GreyCard title="Base de données" editable={true}>
				<p class="text-sm text-gray-600 italic mt-2">
					SQL ou NoSQL pour ce cas d'usage ?
				</p>
			</GreyCard>
		</div>
		
		<div class="space-y-3">
			<h3 class="text-md font-semibold">Questions business</h3>
			
			<GreyCard title="Processus métier" editable={true}>
				<p class="text-sm text-gray-600 italic mt-2">
					Qui valide cette étape du workflow ?
				</p>
			</GreyCard>
			
			<GreyCard title="Règles de gestion" editable={true}>
				<p class="text-sm text-gray-600 italic mt-2">
					Comment calculer les remises ?
				</p>
			</GreyCard>
		</div>
	</div>
</Story>

<Story name="Interactive Example">
	<div class="p-4 border rounded-lg bg-gray-50">
		<h3 class="text-lg font-semibold mb-4">Exemple interactif</h3>
		<p class="text-sm text-gray-600 mb-4">
			Cette carte représente une question ou un point nécessitant clarification.
			Elle bloque l'avancement jusqu'à résolution.
		</p>
		<GreyCard 
			title="Question bloquante"
			editable={true}
			on:titleUpdate={(e) => console.log('Question mise à jour:', e.detail)}
			on:delete={() => console.log('Question supprimée')}
		>
			<div class="mt-2 text-sm text-gray-600 italic">
				<p>⚠️ Clarification nécessaire</p>
				<p>🤔 En attente de réponse</p>
				<p>⏳ Bloque l'avancement</p>
			</div>
		</GreyCard>
	</div>
</Story>

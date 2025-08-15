<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from 'storybook/test';
	import BlueCard from '../../../ui/components/cards/BlueCard.svelte';

	const { Story } = defineMeta({
		title: 'Components/Cards/BlueCard',
		component: BlueCard,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
			docs: {
				description: {
					component: 'Carte bleue spécialisée pour les Epics avec style prédéfini'
				}
			}
		},
		argTypes: {
			title: {
				control: 'text',
				description: 'Titre de l\'epic'
			},
			editable: {
				control: 'boolean',
				description: 'Permet l\'édition du titre'
			}
		},
		args: {
			onTitleUpdate: fn()
		}
	});
</script>

<Story name="Default" args={{ 
	title: 'Epic: Nouvelle fonctionnalité',
	editable: false
}}>
	<div class="space-y-2">
		<p class="text-sm text-blue-700">Status: En cours</p>
		<p class="text-sm text-blue-600">5 features associées</p>
		<p class="text-sm text-blue-600">Deadline: 30 septembre 2024</p>
	</div>
</Story>

<Story name="Editable" args={{ 
	title: 'Epic: Amélioration UX',
	editable: true
}}>
	<div class="space-y-2">
		<p class="text-sm text-blue-700">Status: Planifié</p>
		<p class="text-sm text-blue-600">3 features associées</p>
		<div class="flex gap-2 mt-3">
			<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Frontend</span>
			<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">UX</span>
		</div>
	</div>
</Story>

<Story name="Multiple Cards">
	<div class="grid gap-4 max-w-2xl">
		<BlueCard title="Epic: Authentification" editable={true}>
			<div class="space-y-2">
				<p class="text-sm text-blue-700">Implémentation du système d'auth</p>
				<div class="flex gap-2">
					<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Backend</span>
					<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Sécurité</span>
				</div>
			</div>
		</BlueCard>
		
		<BlueCard title="Epic: Dashboard" editable={true}>
			<div class="space-y-2">
				<p class="text-sm text-blue-700">Création du tableau de bord principal</p>
				<div class="flex gap-2">
					<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Frontend</span>
					<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Analytics</span>
				</div>
			</div>
		</BlueCard>
		
		<BlueCard title="Epic: API REST" editable={false}>
			<div class="space-y-2">
				<p class="text-sm text-blue-700">Développement de l'API principale</p>
				<p class="text-sm text-blue-600">Status: Terminé ✅</p>
			</div>
		</BlueCard>
	</div>
</Story>

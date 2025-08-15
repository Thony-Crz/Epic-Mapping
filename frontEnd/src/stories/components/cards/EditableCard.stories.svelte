<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from 'storybook/test';
	import EditableCard from '../../../ui/components/cards/EditableCard.svelte';

	const { Story } = defineMeta({
		title: 'Components/Cards/EditableCard',
		component: EditableCard,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
			docs: {
				description: {
					component: 'Carte éditable avec titre modifiable et contenu personnalisable'
				}
			}
		},
		argTypes: {
			title: {
				control: 'text',
				description: 'Titre de la carte'
			},
			editable: {
				control: 'boolean',
				description: 'Permet l\'édition du titre'
			},
			placeholder: {
				control: 'text',
				description: 'Placeholder pour l\'édition'
			},
			cardClass: {
				control: 'text',
				description: 'Classes CSS pour la carte'
			},
			titleClass: {
				control: 'text',
				description: 'Classes CSS pour le titre'
			},
			showDeleteButton: {
				control: 'boolean',
				description: 'Affiche le bouton de suppression'
			}
		},
		args: {
			onTitleUpdate: fn(),
			onDelete: fn()
		}
	});
</script>

<Story name="Default" args={{ 
	title: 'Titre de la carte',
	editable: false,
	cardClass: 'bg-white border rounded-lg p-4 shadow-sm',
	titleClass: 'text-lg font-semibold text-gray-800'
}}>
	<p class="mt-2 text-gray-600">Contenu de la carte par défaut</p>
</Story>

<Story name="Editable" args={{ 
	title: 'Titre éditable',
	editable: true,
	placeholder: 'Entrez le titre...',
	cardClass: 'bg-white border rounded-lg p-4 shadow-sm',
	titleClass: 'text-lg font-semibold text-blue-600'
}}>
	<p class="mt-2 text-gray-600">Cette carte a un titre éditable. Cliquez sur le titre pour le modifier.</p>
</Story>

<Story name="With Delete Button" args={{ 
	title: 'Carte supprimable',
	editable: true,
	showDeleteButton: true,
	cardClass: 'bg-white border rounded-lg p-4 shadow-sm',
	titleClass: 'text-lg font-semibold text-red-600'
}}>
	<p class="mt-2 text-gray-600">Cette carte peut être supprimée avec le bouton X en haut à droite.</p>
</Story>

<Story name="Different Styles">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
		<EditableCard 
			title="Carte Bleue"
			editable={true}
			cardClass="bg-blue-50 border-blue-200 border rounded-lg p-4"
			titleClass="text-lg font-semibold text-blue-800"
			placeholder="Titre bleu..."
		>
			<p class="mt-2 text-blue-600">Contenu avec thème bleu</p>
		</EditableCard>
		
		<EditableCard 
			title="Carte Verte"
			editable={true}
			cardClass="bg-green-50 border-green-200 border rounded-lg p-4"
			titleClass="text-lg font-semibold text-green-800"
			placeholder="Titre vert..."
		>
			<p class="mt-2 text-green-600">Contenu avec thème vert</p>
		</EditableCard>
		
		<EditableCard 
			title="Carte Jaune"
			editable={true}
			showDeleteButton={true}
			cardClass="bg-yellow-50 border-yellow-200 border rounded-lg p-4"
			titleClass="text-lg font-semibold text-yellow-800"
			placeholder="Titre jaune..."
		>
			<p class="mt-2 text-yellow-600">Contenu avec thème jaune et bouton de suppression</p>
		</EditableCard>
		
		<EditableCard 
			title="Carte Grise"
			editable={false}
			cardClass="bg-gray-50 border-gray-200 border rounded-lg p-4"
			titleClass="text-lg font-semibold text-gray-800"
		>
			<p class="mt-2 text-gray-600">Contenu non-éditable</p>
		</EditableCard>
	</div>
</Story>

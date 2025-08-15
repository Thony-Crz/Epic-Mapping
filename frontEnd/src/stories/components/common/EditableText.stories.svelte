<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from 'storybook/test';
	import EditableText from '../../../ui/components/common/EditableText.svelte';

	const { Story } = defineMeta({
		title: 'Components/Common/EditableText',
		component: EditableText,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
			docs: {
				description: {
					component: 'Composant de texte éditable avec gestion des événements clavier et boutons de contrôle'
				}
			}
		},
		argTypes: {
			text: {
				control: 'text',
				description: 'Texte à afficher/éditer'
			},
			isEditing: {
				control: 'boolean',
				description: 'Mode édition activé'
			},
			placeholder: {
				control: 'text',
				description: 'Texte de placeholder'
			}
		},
		args: {
			onEdit: fn(),
			onSave: fn(),
			onCancel: fn()
		}
	});
</script>

<Story name="Default" args={{ 
	text: 'Cliquez pour éditer ce texte',
	isEditing: false,
	placeholder: 'Entrez votre texte...'
}} />

<Story name="Editing Mode" args={{ 
	text: 'Texte en cours d\'édition',
	isEditing: true,
	placeholder: 'Modifiez ce texte...'
}} />

<Story name="Empty Text" args={{ 
	text: '',
	isEditing: false,
	placeholder: 'Aucun texte - cliquez pour ajouter'
}} />

<Story name="Long Text" args={{ 
	text: 'Ceci est un texte très long qui pourrait nécessiter une gestion spéciale lors de l\'édition pour voir comment le composant se comporte',
	isEditing: false,
	placeholder: 'Texte long...'
}} />

<Story name="Interactive Example">
	<div class="space-y-4 p-4">
		<h3 class="text-lg font-semibold">Exemple interactif</h3>
		<p class="text-gray-600">Cliquez sur le texte ci-dessous pour l'éditer :</p>
		<div class="border rounded p-4 bg-gray-50">
			<EditableText 
				text="Epic: Améliorer l'expérience utilisateur"
				placeholder="Titre de l'epic..."
				on:edit={() => console.log('Mode édition activé')}
				on:save={(e) => console.log('Texte sauvegardé:', e.detail)}
				on:cancel={() => console.log('Édition annulée')}
			/>
		</div>
		<div class="text-sm text-gray-500">
			Utilisez Entrée pour sauvegarder, Échap pour annuler
		</div>
	</div>
</Story>

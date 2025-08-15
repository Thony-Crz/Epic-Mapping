<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from 'storybook/test';
	import GreenCard from '../../../ui/components/cards/GreenCard.svelte';

	const { Story } = defineMeta({
		title: 'Components/Cards/GreenCard',
		component: GreenCard,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
			docs: {
				description: {
					component: 'Carte verte pour les scénarios validés avec bouton de suppression'
				}
			}
		},
		argTypes: {
			title: {
				control: 'text',
				description: 'Titre du scénario'
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
	title: 'Scénario principal',
	editable: false
}}>
	<p class="text-sm text-gray-700 mt-2">Description du scénario validé</p>
</Story>

<Story name="Editable" args={{ 
	title: 'Scénario modifiable',
	editable: true
}}>
	<div class="mt-2 space-y-1">
		<p class="text-sm text-gray-700">En tant qu'utilisateur</p>
		<p class="text-sm text-gray-700">Je veux pouvoir...</p>
		<p class="text-sm text-gray-700">Afin de...</p>
	</div>
</Story>

<Story name="Multiple Scenarios">
	<div class="space-y-4 max-w-md">
		<h3 class="text-lg font-semibold">Scénarios validés</h3>
		
		<GreenCard title="Connexion utilisateur" editable={true}>
			<div class="mt-2 text-sm text-gray-700">
				<p><strong>Étant donné</strong> que je suis sur la page de connexion</p>
				<p><strong>Quand</strong> je saisis mes identifiants</p>
				<p><strong>Alors</strong> je suis connecté avec succès</p>
			</div>
		</GreenCard>
		
		<GreenCard title="Gestion des erreurs" editable={true}>
			<div class="mt-2 text-sm text-gray-700">
				<p><strong>Étant donné</strong> que je saisis de mauvais identifiants</p>
				<p><strong>Quand</strong> je clique sur connexion</p>
				<p><strong>Alors</strong> un message d'erreur s'affiche</p>
			</div>
		</GreenCard>
		
		<GreenCard title="Déconnexion" editable={true}>
			<div class="mt-2 text-sm text-gray-700">
				<p><strong>Étant donné</strong> que je suis connecté</p>
				<p><strong>Quand</strong> je clique sur déconnexion</p>
				<p><strong>Alors</strong> je retourne à la page d'accueil</p>
			</div>
		</GreenCard>
	</div>
</Story>

<Story name="Interactive Example">
	<div class="p-4 border rounded-lg bg-green-50">
		<h3 class="text-lg font-semibold mb-4">Exemple interactif</h3>
		<p class="text-sm text-gray-600 mb-4">
			Cette carte représente un scénario validé. Vous pouvez l'éditer ou la supprimer.
		</p>
		<GreenCard 
			title="Scénario de test"
			editable={true}
			on:titleUpdate={(e) => console.log('Titre mis à jour:', e.detail)}
			on:delete={() => console.log('Carte supprimée')}
		>
			<div class="mt-2 text-sm text-gray-700">
				<p>✅ Cas de test validé</p>
				<p>🔄 Automatisé</p>
				<p>📋 Documenté</p>
			</div>
		</GreenCard>
	</div>
</Story>

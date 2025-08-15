<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Breadcrumb from '../../ui/components/Breadcrumb.svelte';

	const { Story } = defineMeta({
		title: 'Components/Breadcrumb',
		component: Breadcrumb,
		tags: ['autodocs'],
		parameters: {
			layout: 'padded',
			docs: {
				description: {
					component: 'Composant de fil d\'Ariane pour la navigation'
				}
			}
		},
		argTypes: {
			customBreadcrumbs: {
				control: 'object',
				description: 'Breadcrumbs personnalisés'
			}
		}
	});
</script>

<Story name="Default">
	<div class="mock-page-context">
		<Breadcrumb />
		<p class="mt-4 text-gray-600">Fil d'Ariane automatique basé sur l'URL</p>
	</div>
</Story>

<Story name="Custom Breadcrumbs" args={{
	customBreadcrumbs: [
		{ label: 'Accueil', href: '/' },
		{ label: 'Projets', href: '/projects' },
		{ label: 'Epic Mapping', href: '/projects/epic-mapping' },
		{ label: 'Epic-123', href: '/projects/epic-mapping/epic-123' }
	]
}}>
	<div class="space-y-4">
		<Breadcrumb customBreadcrumbs={[
			{ label: 'Accueil', href: '/' },
			{ label: 'Projets', href: '/projects' },
			{ label: 'Epic Mapping', href: '/projects/epic-mapping' },
			{ label: 'Epic-123', href: '/projects/epic-mapping/epic-123' }
		]} />
		<p class="text-gray-600">Breadcrumbs personnalisés avec navigation hiérarchique</p>
	</div>
</Story>

<Story name="Different Levels">
	<div class="space-y-6">
		<div>
			<h3 class="text-lg font-semibold mb-2">Navigation simple</h3>
			<Breadcrumb customBreadcrumbs={[
				{ label: 'Accueil', href: '/' },
				{ label: 'Dashboard', href: '/dashboard' }
			]} />
		</div>
		
		<div>
			<h3 class="text-lg font-semibold mb-2">Navigation à 3 niveaux</h3>
			<Breadcrumb customBreadcrumbs={[
				{ label: 'Accueil', href: '/' },
				{ label: 'Équipes', href: '/teams' },
				{ label: 'Développement', href: '/teams/dev' }
			]} />
		</div>
		
		<div>
			<h3 class="text-lg font-semibold mb-2">Navigation profonde</h3>
			<Breadcrumb customBreadcrumbs={[
				{ label: 'Accueil', href: '/' },
				{ label: 'Projets', href: '/projects' },
				{ label: 'Epic Mapping', href: '/projects/epic-mapping' },
				{ label: 'Épics', href: '/projects/epic-mapping/epics' },
				{ label: 'Epic-456', href: '/projects/epic-mapping/epics/epic-456' },
				{ label: 'Fonctionnalités', href: '/projects/epic-mapping/epics/epic-456/features' }
			]} />
		</div>
	</div>
</Story>

<Story name="Real World Examples">
	<div class="space-y-6">
		<div class="p-4 border rounded-lg">
			<h3 class="text-lg font-semibold mb-2">Gestion d'Epic</h3>
			<Breadcrumb customBreadcrumbs={[
				{ label: 'Accueil', href: '/' },
				{ label: 'Epic Mapping', href: '/epic-mapping' },
				{ label: 'Authentification', href: '/epic-mapping/epic-auth' }
			]} />
			<p class="mt-2 text-gray-600">Navigation vers un epic spécifique</p>
		</div>
		
		<div class="p-4 border rounded-lg">
			<h3 class="text-lg font-semibold mb-2">Feature Flags</h3>
			<Breadcrumb customBreadcrumbs={[
				{ label: 'Accueil', href: '/' },
				{ label: 'Feature Flags', href: '/feature-flags' },
				{ label: 'Configuration', href: '/feature-flags/config' }
			]} />
			<p class="mt-2 text-gray-600">Navigation vers la configuration des feature flags</p>
		</div>
		
		<div class="p-4 border rounded-lg">
			<h3 class="text-lg font-semibold mb-2">Administration</h3>
			<Breadcrumb customBreadcrumbs={[
				{ label: 'Accueil', href: '/' },
				{ label: 'Administration', href: '/admin' },
				{ label: 'Utilisateurs', href: '/admin/users' },
				{ label: 'john.doe', href: '/admin/users/john.doe' }
			]} />
			<p class="mt-2 text-gray-600">Navigation vers un utilisateur spécifique</p>
		</div>
	</div>
</Story>

<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from 'storybook/test';
	
	// Import all components
	import Logo from '../../ui/components/Logo.svelte';
	import Breadcrumb from '../../ui/components/Breadcrumb.svelte';
	import BlueCard from '../../ui/components/cards/BlueCard.svelte';
	import YellowCard from '../../ui/components/cards/YellowCard.svelte';
	import GreenCard from '../../ui/components/cards/GreenCard.svelte';
	import GreyCard from '../../ui/components/cards/GreyCard.svelte';

	const { Story } = defineMeta({
		title: 'Examples/Epic Mapping Workflow',
		tags: ['autodocs'],
		parameters: {
			layout: 'fullscreen',
			docs: {
				description: {
					component: 'Démonstration complète du workflow Epic Mapping avec tous les composants intégrés'
				}
			}
		}
	});
</script>

<Story name="Complete Workflow">
	<div class="min-h-screen bg-gray-50 p-6">
		<!-- Header avec Logo -->
		<header class="bg-white shadow-sm rounded-lg p-4 mb-6">
			<div class="flex items-center justify-between">
				<Logo size="lg" />
				<div class="text-sm text-gray-500">
					Projet: Application E-commerce
				</div>
			</div>
		</header>

		<!-- Breadcrumb -->
		<Breadcrumb customBreadcrumbs={[
			{ label: 'Accueil', href: '/' },
			{ label: 'Epic Mapping', href: '/epic-mapping' },
			{ label: 'Authentification', href: '/epic-mapping/epic-auth' }
		]} />

		<!-- Epic Principal -->
		<div class="mb-8">
			<h1 class="text-2xl font-bold text-gray-900 mb-6">Epic: Système d'Authentification</h1>
			
			<BlueCard title="Epic: Authentification complète" editable={true}>
				<div class="space-y-3">
					<p class="text-blue-700">
						Implémentation d'un système d'authentification sécurisé pour l'application e-commerce
					</p>
					<div class="flex gap-2">
						<span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Backend</span>
						<span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Frontend</span>
						<span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Sécurité</span>
					</div>
					<div class="text-sm text-blue-600">
						<p>📅 Deadline: 15 octobre 2024</p>
						<p>👥 Équipe: 4 développeurs</p>
						<p>⏱️ Estimation: 3 sprints</p>
					</div>
				</div>
			</BlueCard>
		</div>

		<!-- Fonctionnalités -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Fonctionnalité 1: Connexion -->
			<div class="space-y-4">
				<YellowCard 
					title="Connexion utilisateur"
					editable={true}
					status="ready"
					scenarios={[
						{ title: 'Connexion valide', type: 'green' },
						{ title: 'Connexion invalide', type: 'green' }
					]}
				>
					<div class="space-y-3">
						<GreenCard title="Connexion avec email/mot de passe" editable={true}>
							<div class="text-sm text-gray-700 mt-2">
								<p><strong>Étant donné</strong> que l'utilisateur a un compte</p>
								<p><strong>Quand</strong> il saisit ses identifiants corrects</p>
								<p><strong>Alors</strong> il accède à son espace personnel</p>
							</div>
						</GreenCard>
						
						<GreenCard title="Gestion des erreurs de connexion" editable={true}>
							<div class="text-sm text-gray-700 mt-2">
								<p><strong>Étant donné</strong> que l'utilisateur saisit de mauvais identifiants</p>
								<p><strong>Quand</strong> il clique sur "Se connecter"</p>
								<p><strong>Alors</strong> un message d'erreur clair s'affiche</p>
							</div>
						</GreenCard>
					</div>
				</YellowCard>
			</div>

			<!-- Fonctionnalité 2: Inscription -->
			<div class="space-y-4">
				<YellowCard 
					title="Inscription utilisateur"
					editable={true}
					status="in-progress"
					scenarios={[
						{ title: 'Inscription basique', type: 'green' },
						{ title: 'Validation email', type: 'grey' }
					]}
				>
					<div class="space-y-3">
						<GreenCard title="Création de compte" editable={true}>
							<div class="text-sm text-gray-700 mt-2">
								<p><strong>Étant donné</strong> un nouvel utilisateur</p>
								<p><strong>Quand</strong> il remplit le formulaire d'inscription</p>
								<p><strong>Alors</strong> son compte est créé avec succès</p>
							</div>
						</GreenCard>
						
						<GreyCard title="Processus de validation email" editable={true}>
							<div class="text-sm text-gray-600 italic mt-2">
								<p>❓ Faut-il valider l'email immédiatement ou permettre l'accès ?</p>
								<p>❓ Quel délai d'expiration pour le lien de validation ?</p>
								<div class="mt-2 text-xs">
									<span class="bg-gray-200 px-2 py-1 rounded">Product Owner</span>
									<span class="bg-gray-200 px-2 py-1 rounded ml-1">UX</span>
								</div>
							</div>
						</GreyCard>
					</div>
				</YellowCard>
			</div>

			<!-- Fonctionnalité 3: Mot de passe oublié -->
			<div class="space-y-4">
				<YellowCard 
					title="Récupération mot de passe"
					editable={true}
					status="todo"
					scenarios={[]}
				>
					<div class="space-y-3">
						<GreyCard title="Processus de récupération" editable={true}>
							<div class="text-sm text-gray-600 italic mt-2">
								<p>❓ Email ou SMS pour la récupération ?</p>
								<p>❓ Combien de tentatives autorisées par jour ?</p>
								<div class="mt-2 text-xs">
									<span class="bg-gray-200 px-2 py-1 rounded">Sécurité</span>
									<span class="bg-gray-200 px-2 py-1 rounded ml-1">Product</span>
								</div>
							</div>
						</GreyCard>
						
						<GreyCard title="Interface utilisateur" editable={true}>
							<div class="text-sm text-gray-600 italic mt-2">
								<p>❓ Page dédiée ou modal ?</p>
								<p>❓ Instructions pour l'utilisateur ?</p>
								<div class="mt-2 text-xs">
									<span class="bg-gray-200 px-2 py-1 rounded">UX/UI</span>
								</div>
							</div>
						</GreyCard>
					</div>
				</YellowCard>
			</div>
		</div>

		<!-- Légende -->
		<div class="mt-8 bg-white rounded-lg p-6 shadow-sm">
			<h3 class="text-lg font-semibold mb-4">Légende du workflow</h3>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div class="flex items-center gap-3">
					<div class="w-4 h-4 bg-blue-500 rounded"></div>
					<span class="text-sm">Epic (objectif principal)</span>
				</div>
				<div class="flex items-center gap-3">
					<div class="w-4 h-4 bg-yellow-400 rounded"></div>
					<span class="text-sm">Fonctionnalité</span>
				</div>
				<div class="flex items-center gap-3">
					<div class="w-4 h-4 bg-green-400 rounded"></div>
					<span class="text-sm">Scénario validé</span>
				</div>
				<div class="flex items-center gap-3">
					<div class="w-4 h-4 bg-gray-400 rounded"></div>
					<span class="text-sm">Question/Clarification</span>
				</div>
			</div>
			
			<div class="mt-4 pt-4 border-t border-gray-200">
				<h4 class="font-medium mb-2">États des fonctionnalités</h4>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
					<div class="flex items-center gap-2">
						<div class="w-3 h-1 bg-blue-500"></div>
						<span>À faire</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-3 h-1 bg-orange-500"></div>
						<span>En cours</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-3 h-1 bg-green-500"></div>
						<span>Prêt</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-3 h-1 bg-red-500"></div>
						<span>Bloqué</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</Story>

<Story name="Simple Epic View">
	<div class="p-6 bg-gray-50 min-h-screen">
		<div class="max-w-4xl mx-auto">
			<!-- En-tête -->
			<div class="flex items-center justify-between mb-6">
				<Logo size="md" />
				<div class="text-sm text-gray-500">Epic Mapping v1.0</div>
			</div>

			<!-- Epic principal -->
			<BlueCard title="Epic: Dashboard Analytics" editable={true}>
				<p class="text-blue-700 mb-3">
					Création d'un tableau de bord avec métriques temps réel
				</p>
				<div class="flex gap-2">
					<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Analytics</span>
					<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Real-time</span>
				</div>
			</BlueCard>

			<!-- Fonctionnalités en grille -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
				<YellowCard 
					title="Métriques utilisateurs"
					editable={true}
					status="ready"
					scenarios={[{ title: 'Connexions actives', type: 'green' }]}
				>
					<GreenCard title="Affichage temps réel des connexions" editable={true}>
						<p class="text-sm text-gray-700 mt-2">Widget avec compteur live</p>
					</GreenCard>
				</YellowCard>

				<YellowCard 
					title="Graphiques de performance"
					editable={true}
					status="in-progress"
					scenarios={[
						{ title: 'Graphique CPU', type: 'green' },
						{ title: 'Fréquence de mise à jour', type: 'grey' }
					]}
				>
					<div class="space-y-2">
						<GreenCard title="Monitoring CPU/RAM" editable={true}>
							<p class="text-sm text-gray-700 mt-2">Graphiques en temps réel</p>
						</GreenCard>
						<GreyCard title="Fréquence de rafraîchissement ?" editable={true}>
							<p class="text-sm text-gray-600 italic mt-2">Toutes les secondes ou minutes ?</p>
						</GreyCard>
					</div>
				</YellowCard>
			</div>
		</div>
	</div>
</Story>

<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';

	export let customBreadcrumbs: Array<{label: string, href: string}> = [];

	$: segments = $page.url.pathname.split('/').filter(segment => segment && segment !== base.replace('/', ''));
	$: breadcrumbs = customBreadcrumbs.length > 0 ? customBreadcrumbs : generateBreadcrumbs(segments);

	function generateBreadcrumbs(segments: string[]) {
		const crumbs = [{label: 'Accueil', href: `${base}/`}];
		
		let currentPath = base;
		segments.forEach((segment, index) => {
			currentPath += `/${segment}`;
			
			// Générer des labels plus lisibles
			let label = segment;
			switch(segment) {
				case 'feature-flags':
					label = 'Feature Flags';
					break;
				case 'epic':
					label = 'Epic';
					break;
				default:
					// Si c'est un ID (commence par epic- ou est numérique), on le garde tel quel
					if (segment.startsWith('epic-') || /^\d+$/.test(segment)) {
						label = segment;
					} else {
						// Sinon on capitalise
						label = segment.charAt(0).toUpperCase() + segment.slice(1);
					}
			}
			
			crumbs.push({
				label,
				href: currentPath
			});
		});
		
		return crumbs;
	}
</script>

{#if breadcrumbs.length > 1}
	<nav class="flex items-center space-x-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
		{#each breadcrumbs as crumb, index}
			{#if index < breadcrumbs.length - 1}
				<a 
					href={crumb.href} 
					class="hover:text-blue-600 transition-colors"
				>
					{crumb.label}
				</a>
				<svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
				</svg>
			{:else}
				<span class="text-gray-900 font-medium">
					{crumb.label}
				</span>
			{/if}
		{/each}
	</nav>
{/if}

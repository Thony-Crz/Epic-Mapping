<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Logo from '../../ui/components/Logo.svelte';

	const { Story } = defineMeta({
		title: 'Components/Logo',
		component: Logo,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
			docs: {
				description: {
					component: 'Composant Logo d\'Epic Mapping avec différentes tailles disponibles'
				}
			}
		},
		argTypes: {
			size: {
				control: { type: 'select' },
				options: ['sm', 'md', 'lg'],
				description: 'Taille du logo'
			}
		}
	});
</script>

<Story name="Small" args={{ size: 'sm' }} />

<Story name="Medium" args={{ size: 'md' }} />

<Story name="Large" args={{ size: 'lg' }} />

<Story name="All Sizes">
	<div class="flex flex-col gap-8 items-start">
		<div class="flex flex-col gap-2">
			<h3 class="text-lg font-semibold">Small (32px)</h3>
			<Logo size="sm" />
		</div>
		<div class="flex flex-col gap-2">
			<h3 class="text-lg font-semibold">Medium (40px)</h3>
			<Logo size="md" />
		</div>
		<div class="flex flex-col gap-2">
			<h3 class="text-lg font-semibold">Large (48px)</h3>
			<Logo size="lg" />
		</div>
	</div>
</Story>

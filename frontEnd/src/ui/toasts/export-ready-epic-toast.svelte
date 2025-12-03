<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	type ToastType = 'success' | 'error';
	export type ExportReadyEpicToastMessage = {
		id: number;
		type: ToastType;
		message: string;
	};

	export let toasts: ExportReadyEpicToastMessage[] = [];

	const dispatch = createEventDispatcher<{ dismiss: { id: number } }>();

	function handleDismiss(id: number) {
		dispatch('dismiss', { id });
	}

	function variantClasses(type: ToastType) {
		return type === 'error'
			? 'border-red-200 text-red-900'
			: 'border-green-200 text-green-900';
	}

	function bulletClasses(type: ToastType) {
		return type === 'error' ? 'bg-red-500' : 'bg-green-500';
	}
</script>

{#if toasts.length > 0}
	<div class="fixed right-4 top-4 z-50 flex max-w-sm flex-col gap-2" aria-live="polite">
		{#each toasts as toast (toast.id)}
			<div
				class={`rounded-lg border bg-white p-3 text-sm shadow-lg ${variantClasses(toast.type)}`}
				role={toast.type === 'error' ? 'alert' : 'status'}
			>
				<div class="flex items-start gap-3">
					<div class={`mt-2 h-2 w-2 rounded-full ${bulletClasses(toast.type)}`} aria-hidden="true"></div>
					<div class="flex-1">
						<p class="font-semibold">
							{toast.type === 'error' ? 'Export echoue' : 'Export reussi'}
						</p>
						<p class="text-xs text-slate-600">{toast.message}</p>
					</div>
					<button
						type="button"
						class="rounded-md px-2 py-1 text-xs text-slate-500 transition hover:bg-slate-100"
						on:click={() => handleDismiss(toast.id)}
						aria-label="Fermer la notification"
					>
						Fermer
					</button>
				</div>
			</div>
		{/each}
	</div>
{/if}

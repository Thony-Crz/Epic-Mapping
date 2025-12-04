<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	interface User {
		id: string;
		name: string;
		email: string;
		avatarUrl?: string;
		role: string;
		approvalStatus: string;
		isApproved: boolean;
		isAdmin: boolean;
	}

	let users: User[] = [];
	let pendingUsers: User[] = [];
	let loading = true;
	let error = '';
	let activeTab: 'pending' | 'all' = 'pending';

	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

	onMount(async () => {
		authStore.init();

		// Check if user is admin
		if (!$authStore.user?.isAdmin) {
			goto(base || '/');
			return;
		}

		await loadUsers();
	});

	async function loadUsers() {
		loading = true;
		error = '';

		try {
			const token = authStore.getToken();
			if (!token) {
				throw new Error('Non authentifié');
			}

			const [pendingRes, allRes] = await Promise.all([
				fetch(`${API_BASE_URL}/api/auth/users/pending`, {
					headers: { 'Authorization': `Bearer ${token}` }
				}),
				fetch(`${API_BASE_URL}/api/auth/users`, {
					headers: { 'Authorization': `Bearer ${token}` }
				})
			]);

			if (!pendingRes.ok || !allRes.ok) {
				throw new Error('Erreur lors du chargement des utilisateurs');
			}

			pendingUsers = await pendingRes.json();
			users = await allRes.json();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Erreur inconnue';
		} finally {
			loading = false;
		}
	}

	async function approveUser(userId: string) {
		try {
			const token = authStore.getToken();
			if (!token) throw new Error('Non authentifié');

			const response = await fetch(`${API_BASE_URL}/api/auth/users/${userId}/approve`, {
				method: 'POST',
				headers: { 'Authorization': `Bearer ${token}` }
			});

			if (!response.ok) {
				throw new Error('Erreur lors de l\'approbation');
			}

			await loadUsers();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Erreur lors de l\'approbation';
		}
	}

	async function rejectUser(userId: string) {
		try {
			const token = authStore.getToken();
			if (!token) throw new Error('Non authentifié');

			const response = await fetch(`${API_BASE_URL}/api/auth/users/${userId}/reject`, {
				method: 'POST',
				headers: { 'Authorization': `Bearer ${token}` }
			});

			if (!response.ok) {
				throw new Error('Erreur lors du rejet');
			}

			await loadUsers();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Erreur lors du rejet';
		}
	}

	function getStatusBadge(status: string) {
		switch (status) {
			case 'Approved':
				return 'bg-green-100 text-green-800';
			case 'Pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'Rejected':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function getRoleBadge(role: string) {
		return role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
	}
</script>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<h1 class="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
		<button
			on:click={loadUsers}
			class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
			</svg>
			Actualiser
		</button>
	</div>

	{#if error}
		<div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
			{error}
		</div>
	{/if}

	<!-- Tabs -->
	<div class="border-b border-gray-200">
		<nav class="-mb-px flex space-x-8">
			<button
				on:click={() => activeTab = 'pending'}
				class="py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'pending' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
			>
				En attente
				{#if pendingUsers.length > 0}
					<span class="ml-2 bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full text-xs">
						{pendingUsers.length}
					</span>
				{/if}
			</button>
			<button
				on:click={() => activeTab = 'all'}
				class="py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
			>
				Tous les utilisateurs
				<span class="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
					{users.length}
				</span>
			</button>
		</nav>
	</div>

	{#if loading}
		<div class="flex justify-center py-12">
			<div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
		</div>
	{:else}
		<!-- Users Table -->
		<div class="bg-white shadow-sm rounded-lg overflow-hidden">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each activeTab === 'pending' ? pendingUsers : users as user (user.id)}
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex items-center">
									{#if user.avatarUrl}
										<img class="h-10 w-10 rounded-full" src={user.avatarUrl} alt={user.name} />
									{:else}
										<div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
											<span class="text-gray-600 font-medium">{user.name.charAt(0).toUpperCase()}</span>
										</div>
									{/if}
									<div class="ml-4">
										<div class="text-sm font-medium text-gray-900">{user.name}</div>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{user.email || '-'}
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class="px-2 py-1 text-xs font-medium rounded-full {getRoleBadge(user.role)}">
									{user.role}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class="px-2 py-1 text-xs font-medium rounded-full {getStatusBadge(user.approvalStatus)}">
									{user.approvalStatus === 'Pending' ? 'En attente' : user.approvalStatus === 'Approved' ? 'Approuvé' : 'Rejeté'}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
								{#if user.approvalStatus === 'Pending'}
									<button
										on:click={() => approveUser(user.id)}
										class="text-green-600 hover:text-green-900 font-medium"
									>
										Approuver
									</button>
									<button
										on:click={() => rejectUser(user.id)}
										class="text-red-600 hover:text-red-900 font-medium"
									>
										Rejeter
									</button>
								{:else if user.approvalStatus === 'Rejected'}
									<button
										on:click={() => approveUser(user.id)}
										class="text-green-600 hover:text-green-900 font-medium"
									>
										Approuver
									</button>
								{/if}
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class="px-6 py-12 text-center text-gray-500">
								{activeTab === 'pending' ? 'Aucun utilisateur en attente d\'approbation' : 'Aucun utilisateur'}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

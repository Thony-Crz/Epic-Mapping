import { writable } from 'svelte/store';
import { goto } from '$app/navigation';
import { base } from '$app/paths';

export interface User {
	id: string;
	name: string;
	email: string;
	avatarUrl?: string;
	role: 'User' | 'Admin';
	approvalStatus: 'Pending' | 'Approved' | 'Rejected';
	isApproved: boolean;
	isAdmin: boolean;
}

interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	token: string | null;
	loading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	isAuthenticated: false,
	user: null,
	token: null,
	loading: false,
	error: null
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>(initialState);

	return {
		subscribe,

		// Initiate GitHub OAuth flow
		loginWithGitHub: async () => {
			update((state) => ({ ...state, loading: true, error: null }));

			try {
				const response = await fetch(`${API_BASE_URL}/api/auth/github/url`);
				if (!response.ok) {
					throw new Error('Impossible de récupérer l\'URL d\'authentification GitHub');
				}
				
				const data = await response.json();
				
				// Store state for CSRF protection
				sessionStorage.setItem('oauth_state', data.state);
				
				// Redirect to GitHub
				window.location.href = data.url;
			} catch (error) {
				console.error('Erreur lors de l\'authentification GitHub:', error);
				update((state) => ({ 
					...state, 
					loading: false, 
					error: error instanceof Error ? error.message : 'Erreur d\'authentification'
				}));
				throw error;
			}
		},

		// Handle GitHub OAuth callback
		handleGitHubCallback: async (code: string, state: string) => {
			update((state) => ({ ...state, loading: true, error: null }));

			try {
				// Verify state for CSRF protection
				const storedState = sessionStorage.getItem('oauth_state');
				if (state !== storedState) {
					throw new Error('État OAuth invalide - possible attaque CSRF');
				}
				sessionStorage.removeItem('oauth_state');

				const response = await fetch(`${API_BASE_URL}/api/auth/github/callback`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ code, state })
				});

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					throw new Error(errorData.error || 'Échec de l\'authentification');
				}

				const data = await response.json();
				
				const user: User = {
					id: data.user.id,
					name: data.user.name,
					email: data.user.email || '',
					avatarUrl: data.user.avatarUrl,
					role: data.user.role,
					approvalStatus: data.user.approvalStatus,
					isApproved: data.user.isApproved,
					isAdmin: data.user.isAdmin
				};

				set({
					isAuthenticated: true,
					user,
					token: data.token,
					loading: false,
					error: null
				});

				// Save to localStorage
				localStorage.setItem('auth', JSON.stringify({ 
					isAuthenticated: true, 
					user,
					token: data.token
				}));
				
				// Redirect based on approval status
				const homeUrl = base || '/';
				if (!user.isApproved) {
					goto(`${base}/pending-approval`);
				} else {
					goto(homeUrl);
				}

				return user;
			} catch (error) {
				console.error('Erreur lors du callback GitHub:', error);
				update((state) => ({ 
					...state, 
					loading: false, 
					error: error instanceof Error ? error.message : 'Erreur d\'authentification'
				}));
				throw error;
			}
		},

		// Refresh current user from API
		refreshUser: async () => {
			const stored = localStorage.getItem('auth');
			if (!stored) return null;

			try {
				const parsed = JSON.parse(stored);
				if (!parsed.token) return null;

				const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
					headers: {
						'Authorization': `Bearer ${parsed.token}`
					}
				});

				if (!response.ok) {
					// Token invalid, logout
					localStorage.removeItem('auth');
					set(initialState);
					return null;
				}

				const userData = await response.json();
				const user: User = {
					id: userData.id,
					name: userData.name,
					email: userData.email || '',
					avatarUrl: userData.avatarUrl,
					role: userData.role,
					approvalStatus: userData.approvalStatus,
					isApproved: userData.isApproved,
					isAdmin: userData.isAdmin
				};

				set({
					isAuthenticated: true,
					user,
					token: parsed.token,
					loading: false,
					error: null
				});

				localStorage.setItem('auth', JSON.stringify({ 
					isAuthenticated: true, 
					user,
					token: parsed.token
				}));

				return user;
			} catch (error) {
				console.error('Erreur lors du rafraîchissement utilisateur:', error);
				return null;
			}
		},

		// Déconnexion
		logout: () => {
			set(initialState);
			localStorage.removeItem('auth');
			const loginUrl = `${base}/login`;
			goto(loginUrl);
		},

		// Initialiser l'état depuis le localStorage
		init: () => {
			try {
				const stored = localStorage.getItem('auth');
				
				if (stored) {
					const parsed = JSON.parse(stored);
					
					if (parsed.isAuthenticated && parsed.user && parsed.token) {
						set({
							isAuthenticated: true,
							user: parsed.user,
							token: parsed.token,
							loading: false,
							error: null
						});
					}
				}
			} catch (error) {
				console.error("🔐 AuthStore: Error parsing auth from localStorage:", error);
			}
		},

		// Get current token
		getToken: (): string | null => {
			const stored = localStorage.getItem('auth');
			if (!stored) return null;
			try {
				const parsed = JSON.parse(stored);
				return parsed.token || null;
			} catch {
				return null;
			}
		},

		// Clear error
		clearError: () => {
			update((state) => ({ ...state, error: null }));
		}
	};
}

export const authStore = createAuthStore();

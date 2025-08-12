import { writable } from 'svelte/store';
import { goto } from '$app/navigation';
import { base } from '$app/paths';

export interface User {
	id: string;
	name: string;
	email: string;
	provider?: 'local' | 'github' | 'azure' | 'gitlab';
}

interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	loading: boolean;
}

const initialState: AuthState = {
	isAuthenticated: false,
	user: null,
	loading: false
};

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>(initialState);

	return {
		subscribe,

		// Connexion locale (fake pour l'instant)
		loginLocal: async (email: string) => {
			update((state) => ({ ...state, loading: true }));

			// Simulation d'une connexion
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const user: User = {
				id: '1',
				name: 'Utilisateur Demo',
				email: email,
				provider: 'local'
			};

			set({
				isAuthenticated: true,
				user,
				loading: false
			});

			// Sauvegarder dans le localStorage pour persister la session
			localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, user }));
			
			// Rediriger vers l'accueil après connexion
			const homeUrl = base || '/';
			goto(homeUrl);
		},

		// Connexion avec un provider externe (fake pour l'instant)
		loginWithProvider: async (provider: 'github' | 'azure' | 'gitlab') => {
			update((state) => ({ ...state, loading: true }));

			// Simulation d'une connexion
			await new Promise((resolve) => setTimeout(resolve, 1500));

			const user: User = {
				id: '1',
				name: `Utilisateur ${provider}`,
				email: `user@${provider}.com`,
				provider
			};

			set({
				isAuthenticated: true,
				user,
				loading: false
			});

			// Sauvegarder dans le localStorage
			localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, user }));
			
			// Rediriger vers l'accueil après connexion
			const homeUrl = base || '/';
			goto(homeUrl);
		},

		// Déconnexion
		logout: () => {
			set(initialState);
			localStorage.removeItem('auth');
		},

		// Initialiser l'état depuis le localStorage
		init: () => {
			try {
				const stored = localStorage.getItem('auth');
				
				if (stored) {
					const parsed = JSON.parse(stored);
					
					if (parsed.isAuthenticated && parsed.user) {
						set({
							isAuthenticated: true,
							user: parsed.user,
							loading: false
						});
					}
				}
			} catch (error) {
				console.error("🔐 AuthStore: Error parsing auth from localStorage:", error);
			}
		}
	};
}

export const authStore = createAuthStore();

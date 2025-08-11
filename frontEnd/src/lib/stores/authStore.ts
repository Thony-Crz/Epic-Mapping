import { writable } from 'svelte/store';

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
		},

		// Déconnexion
		logout: () => {
			set(initialState);
			localStorage.removeItem('auth');
		},

		// Initialiser l'état depuis le localStorage
		init: () => {
			console.log('🔐 AuthStore: Initializing...');
			try {
				const stored = localStorage.getItem('auth');
				console.log('🔐 AuthStore: localStorage auth data:', stored);
				
				if (stored) {
					const parsed = JSON.parse(stored);
					console.log('🔐 AuthStore: Parsed auth data:', parsed);
					
					if (parsed.isAuthenticated && parsed.user) {
						console.log('🔐 AuthStore: Restoring authenticated session for user:', parsed.user.email);
						set({
							isAuthenticated: true,
							user: parsed.user,
							loading: false
						});
					} else {
						console.log('🔐 AuthStore: Invalid stored data, staying unauthenticated');
					}
				} else {
					console.log('🔐 AuthStore: No stored auth data found, user not authenticated');
				}
			} catch (error) {
				console.error("🔐 AuthStore: Error parsing auth from localStorage:", error);
			}
		}
	};
}

export const authStore = createAuthStore();

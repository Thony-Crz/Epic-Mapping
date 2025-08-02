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
      update(state => ({ ...state, loading: true }));
      
      // Simulation d'une connexion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      update(state => ({ ...state, loading: true }));
      
      // Simulation d'une connexion
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
      const stored = localStorage.getItem('auth');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.isAuthenticated && parsed.user) {
            set({
              isAuthenticated: true,
              user: parsed.user,
              loading: false
            });
          }
        } catch (error) {
          console.error('Erreur lors du parsing de l\'auth depuis localStorage:', error);
        }
      }
    }
  };
}

export const authStore = createAuthStore();

<script lang="ts">
  import { authStore } from '$lib/stores/authStore';
  import { onMount } from 'svelte';

  let email = '';
  let password = '';
  let loading = false;

  onMount(() => {
    authStore.init();
  });

  async function handleLocalLogin() {
    if (!email || !password) return;
    
    loading = true;
    try {
      await authStore.loginLocal(email);
    } catch (error) {
      console.error('Erreur de connexion:', error);
    } finally {
      loading = false;
    }
  }

  async function handleProviderLogin(provider: 'github' | 'azure' | 'gitlab') {
    loading = true;
    try {
      await authStore.loginWithProvider(provider);
    } catch (error) {
      console.error('Erreur de connexion:', error);
    } finally {
      loading = false;
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleLocalLogin();
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
  <div class="max-w-md w-full space-y-8 p-8">
    <!-- Logo/Titre -->
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Epic Mapping</h1>
      <p class="text-gray-600">Connectez-vous pour commencer</p>
    </div>

    <!-- Formulaire de connexion -->
    <div class="bg-white rounded-xl shadow-lg p-8 space-y-6">
      <!-- Connexion locale -->
      <div class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            bind:value={email}
            on:keypress={handleKeyPress}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="votre@email.com"
            disabled={loading}
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            bind:value={password}
            on:keypress={handleKeyPress}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <button
          on:click={handleLocalLogin}
          disabled={loading || !email || !password}
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {#if loading}
            <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connexion...
          {:else}
            Se connecter
          {/if}
        </button>
      </div>

      <!-- Séparateur -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">Ou connectez-vous avec</span>
        </div>
      </div>

      <!-- Connexions externes -->
      <div class="space-y-3">
        <!-- GitHub -->
        <button
          on:click={() => handleProviderLogin('github')}
          disabled={loading}
          class="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </button>

        <!-- Azure DevOps -->
        <button
          on:click={() => handleProviderLogin('azure')}
          disabled={loading}
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M0 10.305L6.234 8.72l8.212-6.572V.688L24 3.27v17.46L14.446 24l-8.212-3.27V18.18L0 16.595v-6.29zm2.663 1.115v4.160l3.583 1.13V11.42l-3.583-1.115zM22.337 4.85l-6.891-2.235v17.77l6.891-2.235V4.85z"/>
          </svg>
          Azure DevOps
        </button>

        <!-- GitLab -->
        <button
          on:click={() => handleProviderLogin('gitlab')}
          disabled={loading}
          class="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="m23.6004 9.5927-.0337-.0862L20.3.9814a.851.851 0 0 0-.3362-.405.8748.8748 0 0 0-.9997.0539.8748.8748 0 0 0-.29.4399l-2.2055 6.748H7.5375l-2.2057-6.748a.8573.8573 0 0 0-.29-.4412.8748.8748 0 0 0-.9997-.0537.8585.8585 0 0 0-.3362.4049L.4332 9.5015l-.0325.0862a6.0657 6.0657 0 0 0 2.0119 7.0105L11.9989 24l9.5963-7.3982a6.0657 6.0657 0 0 0 2.0052-7.0091z"/>
          </svg>
          GitLab
        </button>
      </div>
    </div>

    <!-- Note pour le développement -->
    <div class="text-center text-sm text-gray-500">
      <p>Mode développement - Utilisez n'importe quel email/mot de passe</p>
    </div>
  </div>
</div>

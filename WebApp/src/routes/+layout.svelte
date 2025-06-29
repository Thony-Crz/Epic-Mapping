<script lang="ts">
  import '../app.css';
</script>

<!-- Header -->
<header class="bg-white shadow-sm border-b border-gray-200 z-10">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <!-- Logo/Titre -->
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <h1 class="text-xl font-bold text-gray-900">Epic Mapping</h1>
        </div>
      </div>

      <!-- Navigation et actions -->
      <div class="flex items-center space-x-4">
        <!-- Bouton d'authentification -->
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Se connecter
        </button>
      </div>
    </div>
  </div>
</header>

<!-- Contenu principal avec effet tableau blanc -->
<main class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
  <!-- Effet de texture papier/tableau blanc -->
  <div class="absolute inset-0 opacity-30">
    <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0); background-size: 20px 20px;"></div>
  </div>
  
  <!-- Contenu -->
  <div class="relative z-10 container mx-auto px-4 py-8">
    <slot />
  </div>
  
  <!-- Effets décoratifs pour simuler un tableau -->
  <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 opacity-50"></div>
  <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 opacity-30"></div>
</main>
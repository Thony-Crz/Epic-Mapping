<script lang="ts">
  export let size: 'sm' | 'md' | 'lg' = 'md';
  
  const sizes = {
    sm: { width: 32, height: 32, text: 'text-sm' },
    md: { width: 40, height: 40, text: 'text-lg' },
    lg: { width: 48, height: 48, text: 'text-xl' }
  };
  
  const currentSize = sizes[size];
</script>

<div class="flex items-center gap-3">
  <!-- Logo SVG -->
  <div class="relative">
    <svg 
      width={currentSize.width} 
      height={currentSize.height} 
      viewBox="0 0 48 48" 
      class="drop-shadow-sm"
    >
      <!-- Dégradés -->
      <defs>
        <linearGradient id="epicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#6366F1;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
        </linearGradient>
        
        <radialGradient id="epicGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:#DBEAFE;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#DBEAFE;stop-opacity:0" />
        </radialGradient>
        
        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#EF4444;stop-opacity:0.3" />
          <stop offset="50%" style="stop-color:#F59E0B;stop-opacity:0.5" />
          <stop offset="100%" style="stop-color:#10B981;stop-opacity:0.7" />
        </linearGradient>
      </defs>
      
      <!-- Fond avec effet de rayonnement -->
      <circle cx="24" cy="24" r="22" fill="url(#epicGlow)" opacity="0.6"/>
      
      <!-- Lignes de connexion (communication) -->
      <g stroke="url(#connectionGradient)" stroke-width="2" fill="none" opacity="0.8">
        <!-- Connexions principales -->
        <path d="M12 16 L24 24 L36 16" stroke-linecap="round"/>
        <path d="M12 32 L24 24 L36 32" stroke-linecap="round"/>
        <path d="M16 12 L24 24 L32 36" stroke-linecap="round"/>
        <path d="M32 12 L24 24 L16 36" stroke-linecap="round"/>
      </g>
      
      <!-- Nœuds de décision -->
      <g fill="url(#epicGradient)">
        <!-- Nœud central (décision principale) -->
        <circle cx="24" cy="24" r="4" />
        <circle cx="24" cy="24" r="2" fill="white" opacity="0.9"/>
        
        <!-- Nœuds périphériques (parties prenantes) -->
        <circle cx="12" cy="16" r="3"/>
        <circle cx="36" cy="16" r="3"/>
        <circle cx="12" cy="32" r="3"/>
        <circle cx="36" cy="32" r="3"/>
        
        <!-- Points de communication -->
        <circle cx="16" cy="12" r="2" opacity="0.8"/>
        <circle cx="32" cy="12" r="2" opacity="0.8"/>
        <circle cx="16" cy="36" r="2" opacity="0.8"/>
        <circle cx="32" cy="36" r="2" opacity="0.8"/>
      </g>
      
      <!-- Flèches de décision -->
      <g fill="url(#epicGradient)" opacity="0.7">
        <path d="M20 20 l2 -1 l0 2 z"/>
        <path d="M28 20 l-2 -1 l0 2 z"/>
        <path d="M20 28 l2 1 l0 -2 z"/>
        <path d="M28 28 l-2 1 l0 -2 z"/>
      </g>
      
      <!-- Effet "Epic" - éclats -->
      <g stroke="url(#epicGradient)" stroke-width="1" opacity="0.6">
        <path d="M24 8 L24 12" stroke-linecap="round"/>
        <path d="M24 36 L24 40" stroke-linecap="round"/>
        <path d="M8 24 L12 24" stroke-linecap="round"/>
        <path d="M36 24 L40 24" stroke-linecap="round"/>
        
        <path d="M35.3 12.7 L32.9 15.1" stroke-linecap="round"/>
        <path d="M12.7 35.3 L15.1 32.9" stroke-linecap="round"/>
        <path d="M12.7 12.7 L15.1 15.1" stroke-linecap="round"/>
        <path d="M35.3 35.3 L32.9 32.9" stroke-linecap="round"/>
      </g>
    </svg>
  </div>
  
  <!-- Texte du logo -->
  <div class="flex flex-col">
    <span class="font-bold {currentSize.text} bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
      Epic Mapping
    </span>
    {#if size === 'lg'}
      <span class="text-xs text-gray-500 -mt-1">Communication & Decisions</span>
    {/if}
  </div>
</div>

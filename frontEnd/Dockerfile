# ============================================
# Epic Mapping Frontend - Dockerfile (Production)
# ============================================
# Image multi-stage pour SvelteKit avec sortie statique
# Servie par nginx pour des performances optimales

# Étape 1 : Build de l'application SvelteKit
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm ci

# Copie du code source
COPY . .

# Build de l'application en mode statique
ENV NODE_ENV=production
ENV PUBLIC_API_URL=""
RUN npm run build

# Étape 2 : Image de production avec nginx
FROM nginx:alpine AS production

# Suppression de la configuration nginx par défaut
RUN rm -rf /usr/share/nginx/html/*

# Copie des fichiers buildés depuis l'étape builder
COPY --from=builder /app/build /usr/share/nginx/html

# Template nginx pour substitution de variable PORT
RUN echo 'server { \
    listen ${PORT:-80}; \
    listen [::]:${PORT:-80}; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Compression gzip \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
    gzip_min_length 1000; \
    \
    # Cache pour les assets statiques \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    # SPA fallback - toutes les routes vers index.html \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Headers de sécurité \
    add_header X-Frame-Options "SAMEORIGIN" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    add_header X-XSS-Protection "1; mode=block" always; \
}' > /etc/nginx/templates/default.conf.template

# Port exposé (Railway utilise la variable PORT)
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-80}/ || exit 1

# Démarrage de nginx avec substitution des variables d'environnement
CMD ["/bin/sh", "-c", "envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

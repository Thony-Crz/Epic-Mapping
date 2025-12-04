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
# PUBLIC_API_URL sera configuré via les variables d'environnement Railway
# au moment du déploiement, ou via un proxy API relatif
ENV NODE_ENV=production
RUN npm run build

# Étape 2 : Image de production avec nginx
FROM nginx:alpine AS production

# Installation de gettext pour envsubst
RUN apk add --no-cache gettext

# Suppression de la configuration nginx par défaut
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Copie des fichiers buildés depuis l'étape builder
COPY --from=builder /app/build /usr/share/nginx/html

# Création du répertoire pour le template nginx
RUN mkdir -p /etc/nginx/templates

# Template nginx pour substitution de variable PORT
# Note: nginx:alpine supporte les templates avec envsubst automatiquement
RUN echo 'server { \n\
    listen 80; \n\
    listen [::]:80; \n\
    server_name _; \n\
    root /usr/share/nginx/html; \n\
    index index.html; \n\
    \n\
    gzip on; \n\
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \n\
    gzip_min_length 1000; \n\
    \n\
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ { \n\
        expires 1y; \n\
        add_header Cache-Control "public, immutable"; \n\
    } \n\
    \n\
    location / { \n\
        try_files $uri $uri/ /index.html; \n\
    } \n\
    \n\
    add_header X-Frame-Options "SAMEORIGIN" always; \n\
    add_header X-Content-Type-Options "nosniff" always; \n\
    add_header X-XSS-Protection "1; mode=block" always; \n\
}' > /etc/nginx/templates/default.conf.template

# Port exposé (Railway injecte PORT automatiquement)
EXPOSE 80

# Health check sur port fixe 80 (nginx écoute toujours sur 80 en interne)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Script de démarrage qui gère la substitution PORT pour Railway
# Si PORT est défini (Railway), on modifie la config nginx pour écouter sur ce port
CMD ["/bin/sh", "-c", "if [ -n \"$PORT\" ]; then sed -i \"s/listen 80;/listen $PORT;/g\" /etc/nginx/templates/default.conf.template && sed -i \"s/listen \\[::\\]:80;/listen [::]:$PORT;/g\" /etc/nginx/templates/default.conf.template; fi && envsubst < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

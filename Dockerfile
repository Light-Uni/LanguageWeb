# ─────────────────────────────────────────────────────────────────────────────
# LinguaFlow — Frontend Dockerfile (React + Vite)
# Multi-stage: 'development' (hot-reload) | 'builder' | 'production' (Nginx)
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Development (Vite dev server with hot-reload) ────────────────────
FROM node:20-alpine AS development

LABEL maintainer="LinguaFlow Team"
LABEL description="Vite/React frontend for LinguaFlow AI Learning Platform"

WORKDIR /app

# Copy package manifests first for better layer caching
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for Vite)
RUN npm install

# Copy source code
COPY . .

EXPOSE 5173

# Listen on 0.0.0.0 so Docker can route to the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]


# ── Stage 2: Build static assets ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build


# ── Stage 3: Production (Nginx static server + API proxy) ─────────────────────
FROM nginx:1.25-alpine AS production

LABEL description="LinguaFlow Production — Nginx static frontend + API proxy"

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config for SPA routing and API proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

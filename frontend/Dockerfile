# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:18-alpine AS build
WORKDIR /app

# Accept API URL as build arg (injected by docker-compose)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Cache node_modules separately
COPY package*.json ./
RUN npm ci --prefer-offline

# Build the app
COPY . .
RUN npm run build

# ── Serve stage (nginx) ───────────────────────────────────────────────────────
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx page
RUN rm -rf ./*

# Copy built assets
COPY --from=build /app/dist .

# Copy our optimized nginx config
# In CI, nginx.conf is copied into the frontend context before build
# In local docker-compose, it's available via the copy step too
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
